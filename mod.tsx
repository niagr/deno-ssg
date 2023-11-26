import * as fs from "https://deno.land/std@0.207.0/fs/mod.ts"
import * as FrontMatter from "https://deno.land/std@0.207.0/front_matter/any.ts"
import * as path from "https://deno.land/std@0.208.0/path/mod.ts"

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"
import postcss from "https://deno.land/x/postcss@8.4.16/mod.js"

import React from "https://esm.sh/react@18.2.0"
import ReactDomServer from "https://esm.sh/react-dom@18.2.0/server"
import ReactMarkdown from "https://esm.sh/react-markdown@6.0.3"
import { Helmet } from "https://esm.sh/react-helmet@6.1.0"
import xmlpretty from "https://esm.sh/xml-formatter@3.6.0"

function replacePath(origPath: string, replaceThis: string, replaceWith: string): string {
    origPath = path.normalize(origPath)
    replaceThis = path.normalize(replaceThis)
    replaceWith = path.normalize(replaceWith)
    return origPath.replace(replaceThis, replaceWith)
}

async function copyStaticFiles(staticDirPath: string, contentDirPath: string, outDirPath: string) {
    // copy files from the static directory to the output directory verbatim
    for await (const file of fs.walk(staticDirPath)) {
        if (!file.isFile) {
            continue
        }
        console.log(`Processing static file: ${file.path}`)
        const outputPath = replacePath(file.path, staticDirPath, outDirPath)
        await fs.ensureDir(path.dirname(outputPath))
        await fs.copy(file.path, outputPath, { overwrite: true })
        console.log(`├─ Copied to ${outputPath}`)
    }

    // copy non-markdown files from the content directory to the output directory verbatim
    for await (const file of fs.walk(contentDirPath)) {
        if (!file.isFile || file.name.endsWith(".md")) {
            continue
        }
        console.log(`Processing non-markdown file in content dir: ${file.path}`)
        const outputPath = replacePath(file.path, contentDirPath, outDirPath)
        await fs.ensureDir(path.dirname(outputPath))
        await fs.copy(file.path, outputPath, { overwrite: true })
        console.log(`├─ Copied to ${outputPath}`)
    }
}

const FRONT_MATTER_SCHEMA = z.object({
    component: z.string().optional(),
})

type FrontMatter = z.infer<typeof FRONT_MATTER_SCHEMA>

async function readWithFrontMatter(
    filepath: string,
): Promise<{ body: string; fm: FrontMatter }> {
    const content = await Deno.readTextFile(filepath)
    if (FrontMatter.test(content)) {
        const { attrs, body } = FrontMatter.extract(content)
        let fm: FrontMatter
        try {
            fm = FRONT_MATTER_SCHEMA.passthrough().parse(attrs)
        } catch (e) {
            throw new Error(
                `Error parsing front matter for \`${filepath}\`: ${e.message}`,
                { cause: e },
            )
        }
        return {
            fm,
            body,
        }
    }
    return {
        fm: {},
        body: content,
    }
}

type ContentData = {
    data: Record<string, unknown> | null
    children: Record<string, ContentData> | null
}

/**
 * Loads the content data from the given path.
 *
 * The content data is a tree of objects created from the markdown files in the content directory.
 * Each object has a `data` field, and a `children` field.
 *
 * For directories:
 * - the `data` field is the front matter of the `index.md` file directly inside the directory, if
 *   it exists, or null otherwise.
 * - the `children` field is an object mapping the names of the files and directories inside the
 *   directory to their content data. The keys are the names of the files and directories, without
 *   the `.md` extension. The `index.md` file is not included in the `children` field.
 *
 * For files
 * - the `data` field is the front matter of the file
 * - the `children` field is null.
 *
 * Example:
 *
 * The following directory structure:
 * ```
 *    content/
 *    ├─ index.md
 *    ├─ about.md
 *    └─ blog/
 *       ├─ index.md
 *       ├─ post1.md
 *       └─ post2/
 *          ├─ index.md
 *          └─ image.png
 * ```
 *
 * will be loaded as:
 *
 * ```json
 * {
 *   "data": {},
 *   "children": {
 *     "about": {
 *       "data": {},
 *       "children": null
 *     },
 *     "blog": {
 *       "data": {},
 *       "children": {
 *         "post1": {
 *           "data": {},
 *           "children": null
 *         },
 *         "post2": {
 *           "data": {},
 *           "children": null
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
async function loadContentData(path: string): Promise<ContentData> {
    const data: ContentData = {
        data: null,
        children: null,
    }
    for await (const file of Deno.readDir(path)) {
        if (file.isFile) {
            if (!file.name.endsWith(".md")) {
                continue
            }
            const { fm } = await readWithFrontMatter(`${path}/${file.name}`)
            if (file.name === "index.md") {
                data.data = fm
            } else {
                data.children = data.children || {}
                data.children[file.name.slice(0, -3)] = {
                    data: fm,
                    children: null,
                }
            }
        } else if (file.isDirectory) {
            data.children = data.children || {}
            data.children[file.name] = await loadContentData(`${path}/${file.name}`)
        } else {
            throw new Error(`Unexpected file type: ${file.name}`)
        }
    }
    return data
}

/**
 * A component that adds a stylesheet to the `<head>` of the page using a `<link>` tag.
 *
 * Example:
 * ```tsx
 * <CSS href="/css/home.css" />
 * ```
 */
const CSS = (props: { href: string }) => {
    if (!props.href.startsWith("/")) {
        throw new Error(
            `CSS href must be an absolute path (must start with '/'), got ${props.href}`,
        )
    }
    return (
        <Helmet>
            <link rel="stylesheet" href={props.href} />
        </Helmet>
    )
}

/**
 * A template literal tag to create a component that adds a stylesheet to the `<head>` of the page
 * using a `<style>` tag.
 *
 * Example:
 *
 * ```tsx
 * const Style = css`
 *     .content {
 *         background: lightpink;
 *     }
 * `
 *
 * export default () => (
 *  <>
 *      <Style />
 *      <div className="content">
 *          some content
 *      </div>
 *  </>
 * )
 * ```
 */
function css(parts: TemplateStringsArray, ...args: unknown[]): React.ComponentType {
    if (args.length > 0) {
        throw new Error("interpolation not supported")
    }
    const str = parts[0]
    postcss.parse(str) // throws if invalid
    return () => (
        <Helmet>
            <style type="text/css">{str}</style>
        </Helmet>
    )
}

/**
 * Props passed to all components used to render markdown files.
 *
 * The props interface for components intended to be used as the root component to render markdown
 * files should extend this interface.
 */
interface BaseComponentProps {
    site: ContentData
    children?: React.ReactNode
}

async function processMarkdownFiles(
    contentDirPath: string,
    componentsDirPath: string,
    staticDirPath: string,
    outDirPath: string,
    contentData: ContentData,
) {
    for await (const file of fs.walk(contentDirPath)) {
        if (!file.isFile || !file.name.endsWith(".md")) {
            continue
        }
        const contentFilePath = file.path
        console.log(`Building ${contentFilePath}`)
        const content = await Deno.readTextFile(contentFilePath)
        const { fm, body } = await readWithFrontMatter(contentFilePath)
        let componentPath: string
        if (fm.component) {
            const path = `${componentsDirPath}/${fm.component}.tsx`
            if (!(await fs.exists(path))) {
                throw new Error(
                    `Component \`${path}\` specified in front matter ` +
                        `for \`${contentFilePath}\` does not exist.`,
                )
            }
            componentPath = path
        } else {
            await fs.ensureDir(componentsDirPath)
            const path = replacePath(contentFilePath, contentDirPath, componentsDirPath)
                .replace(".md", ".tsx")
            if (!(await fs.exists(path))) {
                throw new Error(
                    `No component found for \`${contentFilePath}\`(tried '${path}'). ` +
                        `Add a \`component\` field to the front matter or create a component file ` +
                        `at \`${path}\`.`,
                )
            }
            componentPath = path
        }
        console.log(`├─ Using component ${componentPath}`)
        const fullModulePath = "file://" + await Deno.realPath(componentPath)
        console.log(`├─ Importing ${fullModulePath}`)
        const defaultExport = (await import(fullModulePath)).default
        if (typeof defaultExport !== "function") {
            throw new Error(
                `Component \`${componentPath}\` must export a component as the default export.`,
            )
        }
        const Component = defaultExport as React.ComponentType<BaseComponentProps>
        let html: string
        try {
            html = ReactDomServer.renderToString(
                <Component {...fm} site={contentData}>
                    <ReactMarkdown>{body}</ReactMarkdown>
                </Component>,
            )
        } catch (e) {
            throw new Error(
                `Error while rendering '${contentFilePath}' using '${componentPath}': ${e}`,
                { cause: e },
            )
        }
        const helmet = Helmet.renderStatic()
        if (!html.includes("<head>")) {
            html = html.replace("<html>", "<html><head></head>")
        }
        html = html.replace(
            "</head>",
            `${helmet.link.toString()} ${helmet.style.toString()} </head>`,
        )
        await fs.ensureDir(outDirPath)
        let outputPath = replacePath(contentFilePath, contentDirPath, outDirPath)
            .replace(".md", ".html")
        if (!outputPath.endsWith("index.html")) {
            outputPath = outputPath.replace(".html", "/index.html")
        }
        await fs.ensureFile(outputPath)
        await Deno.writeTextFile(outputPath, xmlpretty(html))
        console.log(`├─ Wrote ${outputPath}`)
    }
}

interface BuildConfig {
    contentDirPath: string
    componentsDirPath: string
    staticDirPath: string
    outDirPath: string
}

/**
 * Builds the site.
 *
 * Options:
 * - `contentDirPath`: The path to the content directory. Defaults to `./content`.
 * - `componentsDirPath`: The path to the components directory. Defaults to `./components`.
 * - `staticDirPath`: The path to the static directory. Defaults to `./static`.
 * - `outDirPath`: The path to the output directory. Defaults to `./dist`.
 */
async function build(conf: Partial<BuildConfig> = {}) {
    const {
        contentDirPath = "./content",
        componentsDirPath = "./components",
        staticDirPath = "./static",
        outDirPath = "./dist",
    } = conf
    const contentData = await loadContentData(contentDirPath)
    await processMarkdownFiles(
        contentDirPath,
        componentsDirPath,
        staticDirPath,
        outDirPath,
        contentData,
    )
    await copyStaticFiles(staticDirPath, contentDirPath, outDirPath)
}

export { type BaseComponentProps, build, CSS, css, React }
