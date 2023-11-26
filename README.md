# deno-ssg

Minimalistic static site generator based on Deno and JSX.

- Uses JSX/TSX for templating.
- Emphasizes code over convention, apart from a couple of easy-to-remember conventions.
- Uses Deno as the runtime.
- Zero transpilation/compilation. Deno supports JSX out of the box.

## Installation

#### Install Deno

The framework uses Deno as the runtime. [Install Deno
first](https://docs.deno.com/runtime/manual/getting_started/installation).

#### Copy ssg.tsx to your project

This "framework" is just a single file - [ssg.tsx](./ssg.tsx). You can copy it to your project and
use it directly.

The entry point `build()` is called by your script to generate the site.

```typescript
// main.ts

import { build } from "./ssg.tsx"

await build()
```

And then you run your script with Deno:

```bash
deno run main.ts
```

Optionally, specify custom paths for the different directories:

```typescript
await build({
    contentDirPath: "./content",        
    componentsDirPath: "./components",
    staticDirPath: "./static",
    outDirPath: "./dist",
})
```

## Usage

In a nutshell, you create a `content` directory with your content files, and a `components` directory
with your components. The framework will generate a static site in the `dist` directory.

**TLDR:**

- Markdown files in the `content` directory are rendered using React components from the
  `components` directory.

- Non-markdown files in the `content` directory are copied to the `dist` directory verbatim, 
  preserving the directory structure.

- All files in the `static` directory are copied to the `dist` directory verbatim, preserving the
  directory structure.

### Content

The content directory contains your content files. The framework will recursively traverse the
directory and generate a static site based on the files it finds. The directory structure is
preserved in the generated site.

The content files are written in Markdown. 

```markdown

## Happy New Year!

Welcome back! New year, new beginnings...
```

The content files can contain front matter. The front matter is a YAML block at the top of the file
that contains metadata about the file.

```markdown
---
title: Most Memorable Moments of 2022
date: 2023-01-01
---

## Happy New Year!

Welcome back! New year, new beginnings...
```

Apart from markdown files, the content directory can contain any other type of file. The framework
will copy all files from the content directory to the `dist` directory. The directory structure is 
preserved.

### Components

The framework uses React components from the `components` directory to render the content. A
component is just a `.tsx` file that has a React component as its default export.

The content file's front matter and the content itself are passed to the component as props. The
front matter is passed as-is, and the markdown content is passed as the `children` prop, already
rendered as HTML.

```typescript
// components/Post.tsx

import { React } from "./ssg.tsx"

export default function Post(props: { date: Date, children: React.ReactNode }) {
    return (
        <article>
            <h1>{props.title}</h1>
            {children}
        </article>
    )
}
```

The content files can specify which component to use for rendering by setting the `component`
property in the front matter.

```markdown
---
component: Post

title: Most Memorable Moments of 2022
date: 2023-01-01
---

## Happy New Year!

Welcome back! New year, new beginnings...
```

The framework will look for a component named `Post` in the `components` directory and use it to
render the content.

Alternatively, if the content file doesn't specify a component, the framework will look for a
component with the same name as the content file in the `components` directory. So if the content
file is named `post.md`, the framework will look for a component named `post.tsx` in the
`components` directory.

### Static files

The framework will copy all files from the `static` directory to the `dist` directory. The directory
structure is preserved.


## API

`sst.tsx` exports the following symbols:

- ### build

  Entry point for the framework. Call this function to generate the site.

  ```typescript
  import { build } from "./ssg.tsx"

  await build()
  ```
  
  Accepts an optional object with the following properties:
  - `contentDirPath` - Path to the content directory. Defaults to `./content`.
  - `componentsDirPath` - Path to the components directory. Defaults to `./components`.
  - `staticDirPath` - Path to the static directory. Defaults to `./static`.
  - `outDirPath` - Path to the output directory. Defaults to `./dist`.

- ### BaseComponentProps

  An interface representing the props that are passed to the components when rendering content.
  Components being used to render content can use this interface to get type-safety for the common
  props passed by the framework.

  ```typescript
  import { React, BaseComponentProps } from "./ssg.tsx"

  export default function PostList(props: BaseComponentProps) {
      const { site } = props
      return (
          {site.children.posts.children.map((post) => (
              <Post {...post} />
          ))}
      )
  }
  ```

- ### React

  Re-export of `React`, useful for writing components without having to import React. It's
  recommended to use this instead of importing React directly to avoid version mismatch issues.
