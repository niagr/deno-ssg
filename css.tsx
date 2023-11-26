import postcss from "https://deno.land/x/postcss@8.4.16/mod.js"
import type { Declaration } from "https://deno.land/x/postcss@8.4.16/lib/postcss.js"

import React, {
    type ComponentType,
    type CSSProperties,
    type HTMLAttributes,
} from "https://esm.sh/react@18.2.0"

const Elem = {
    a: (props: HTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
    abbr: (props: HTMLAttributes<HTMLElement>) => <abbr {...props} />,
    address: (props: HTMLAttributes<HTMLElement>) => <address {...props} />,
    area: (props: HTMLAttributes<HTMLAreaElement>) => <area {...props} />,
    article: (props: HTMLAttributes<HTMLElement>) => <article {...props} />,
    aside: (props: HTMLAttributes<HTMLElement>) => <aside {...props} />,
    audio: (props: HTMLAttributes<HTMLAudioElement>) => <audio {...props} />,
    b: (props: HTMLAttributes<HTMLElement>) => <b {...props} />,
    base: (props: HTMLAttributes<HTMLBaseElement>) => <base {...props} />,
    bdi: (props: HTMLAttributes<HTMLElement>) => <bdi {...props} />,
    bdo: (props: HTMLAttributes<HTMLElement>) => <bdo {...props} />,
    big: (props: HTMLAttributes<HTMLElement>) => <big {...props} />,
    blockquote: (props: HTMLAttributes<HTMLElement>) => <blockquote {...props} />,
    body: (props: HTMLAttributes<HTMLBodyElement>) => <body {...props} />,
    br: (props: HTMLAttributes<HTMLBRElement>) => <br {...props} />,
    button: (props: HTMLAttributes<HTMLButtonElement>) => <button {...props} />,
    canvas: (props: HTMLAttributes<HTMLCanvasElement>) => <canvas {...props} />,
    caption: (props: HTMLAttributes<HTMLElement>) => <caption {...props} />,
    cite: (props: HTMLAttributes<HTMLElement>) => <cite {...props} />,
    code: (props: HTMLAttributes<HTMLElement>) => <code {...props} />,
    col: (props: HTMLAttributes<HTMLTableColElement>) => <col {...props} />,
    colgroup: (props: HTMLAttributes<HTMLTableColElement>) => <colgroup {...props} />,
    data: (props: HTMLAttributes<HTMLElement>) => <data {...props} />,
    datalist: (props: HTMLAttributes<HTMLDataListElement>) => <datalist {...props} />,
    dd: (props: HTMLAttributes<HTMLElement>) => <dd {...props} />,
    del: (props: HTMLAttributes<HTMLElement>) => <del {...props} />,
    details: (props: HTMLAttributes<HTMLElement>) => <details {...props} />,
    dfn: (props: HTMLAttributes<HTMLElement>) => <dfn {...props} />,
    dialog: (props: HTMLAttributes<HTMLDialogElement>) => <dialog {...props} />,
    div: (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    dl: (props: HTMLAttributes<HTMLDListElement>) => <dl {...props} />,
    dt: (props: HTMLAttributes<HTMLElement>) => <dt {...props} />,
    em: (props: HTMLAttributes<HTMLElement>) => <em {...props} />,
    embed: (props: HTMLAttributes<HTMLEmbedElement>) => <embed {...props} />,
    fieldset: (props: HTMLAttributes<HTMLFieldSetElement>) => <fieldset {...props} />,
    figcaption: (props: HTMLAttributes<HTMLElement>) => <figcaption {...props} />,
    figure: (props: HTMLAttributes<HTMLElement>) => <figure {...props} />,
    footer: (props: HTMLAttributes<HTMLElement>) => <footer {...props} />,
    form: (props: HTMLAttributes<HTMLFormElement>) => <form {...props} />,
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} />,
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />,
    h4: (props: HTMLAttributes<HTMLHeadingElement>) => <h4 {...props} />,
    h5: (props: HTMLAttributes<HTMLHeadingElement>) => <h5 {...props} />,
    h6: (props: HTMLAttributes<HTMLHeadingElement>) => <h6 {...props} />,
    head: (props: HTMLAttributes<HTMLHeadElement>) => <head {...props} />,
    header: (props: HTMLAttributes<HTMLElement>) => <header {...props} />,
    hgroup: (props: HTMLAttributes<HTMLElement>) => <hgroup {...props} />,
    hr: (props: HTMLAttributes<HTMLHRElement>) => <hr {...props} />,
    html: (props: HTMLAttributes<HTMLHtmlElement>) => <html {...props} />,
    i: (props: HTMLAttributes<HTMLElement>) => <i {...props} />,
    iframe: (props: HTMLAttributes<HTMLIFrameElement>) => <iframe {...props} />,
    img: (props: HTMLAttributes<HTMLImageElement>) => <img {...props} />,
    input: (props: HTMLAttributes<HTMLInputElement>) => <input {...props} />,
    ins: (props: HTMLAttributes<HTMLModElement>) => <ins {...props} />,
    kbd: (props: HTMLAttributes<HTMLElement>) => <kbd {...props} />,
    keygen: (props: HTMLAttributes<HTMLElement>) => <keygen {...props} />,
    label: (props: HTMLAttributes<HTMLLabelElement>) => <label {...props} />,
    legend: (props: HTMLAttributes<HTMLLegendElement>) => <legend {...props} />,
    li: (props: HTMLAttributes<HTMLLIElement>) => <li {...props} />,
    link: (props: HTMLAttributes<HTMLLinkElement>) => <link {...props} />,
    main: (props: HTMLAttributes<HTMLElement>) => <main {...props} />,
    map: (props: HTMLAttributes<HTMLMapElement>) => <map {...props} />,
    mark: (props: HTMLAttributes<HTMLElement>) => <mark {...props} />,
    menu: (props: HTMLAttributes<HTMLElement>) => <menu {...props} />,
    menuitem: (props: HTMLAttributes<HTMLElement>) => <menuitem {...props} />,
    meta: (props: HTMLAttributes<HTMLMetaElement>) => <meta {...props} />,
    meter: (props: HTMLAttributes<HTMLElement>) => <meter {...props} />,
    nav: (props: HTMLAttributes<HTMLElement>) => <nav {...props} />,
    noscript: (props: HTMLAttributes<HTMLElement>) => <noscript {...props} />,
    object: (props: HTMLAttributes<HTMLObjectElement>) => <object {...props} />,
    ol: (props: HTMLAttributes<HTMLOListElement>) => <ol {...props} />,
    optgroup: (props: HTMLAttributes<HTMLOptGroupElement>) => <optgroup {...props} />,
    option: (props: HTMLAttributes<HTMLOptionElement>) => <option {...props} />,
    output: (props: HTMLAttributes<HTMLElement>) => <output {...props} />,
    p: (props: HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,
    param: (props: HTMLAttributes<HTMLParamElement>) => <param {...props} />,
    picture: (props: HTMLAttributes<HTMLElement>) => <picture {...props} />,
    pre: (props: HTMLAttributes<HTMLPreElement>) => <pre {...props} />,
    progress: (props: HTMLAttributes<HTMLProgressElement>) => <progress {...props} />,
    q: (props: HTMLAttributes<HTMLQuoteElement>) => <q {...props} />,
    rp: (props: HTMLAttributes<HTMLElement>) => <rp {...props} />,
    rt: (props: HTMLAttributes<HTMLElement>) => <rt {...props} />,
    ruby: (props: HTMLAttributes<HTMLElement>) => <ruby {...props} />,
    s: (props: HTMLAttributes<HTMLElement>) => <s {...props} />,
    samp: (props: HTMLAttributes<HTMLElement>) => <samp {...props} />,
    script: (props: HTMLAttributes<HTMLScriptElement>) => <script {...props} />,
    section: (props: HTMLAttributes<HTMLElement>) => <section {...props} />,
    select: (props: HTMLAttributes<HTMLSelectElement>) => <select {...props} />,
    small: (props: HTMLAttributes<HTMLElement>) => <small {...props} />,
    source: (props: HTMLAttributes<HTMLSourceElement>) => <source {...props} />,
    span: (props: HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
    strong: (props: HTMLAttributes<HTMLElement>) => <strong {...props} />,
    style: (props: HTMLAttributes<HTMLStyleElement>) => <style {...props} />,
    sub: (props: HTMLAttributes<HTMLElement>) => <sub {...props} />,
    summary: (props: HTMLAttributes<HTMLElement>) => <summary {...props} />,
    sup: (props: HTMLAttributes<HTMLElement>) => <sup {...props} />,
    table: (props: HTMLAttributes<HTMLTableElement>) => <table {...props} />,
    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
    td: (props: HTMLAttributes<HTMLTableDataCellElement>) => <td {...props} />,
    textarea: (props: HTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
    tfoot: (props: HTMLAttributes<HTMLTableSectionElement>) => <tfoot {...props} />,
    th: (props: HTMLAttributes<HTMLTableHeaderCellElement>) => <th {...props} />,
    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />,
    time: (props: HTMLAttributes<HTMLElement>) => <time {...props} />,
    title: (props: HTMLAttributes<HTMLTitleElement>) => <title {...props} />,
    tr: (props: HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
    track: (props: HTMLAttributes<HTMLTrackElement>) => <track {...props} />,
    u: (props: HTMLAttributes<HTMLElement>) => <u {...props} />,
    ul: (props: HTMLAttributes<HTMLUListElement>) => <ul {...props} />,
    var: (props: HTMLAttributes<HTMLElement>) => <var {...props} />,
    video: (props: HTMLAttributes<HTMLVideoElement>) => <video {...props} />,
    wbr: (props: HTMLAttributes<HTMLElement>) => <wbr {...props} />,
    webview: (props: HTMLAttributes<HTMLWebViewElement>) => <webview {...props} />,
} as const

type NoStyleAttrs<E extends HTMLElement> = Omit<HTMLAttributes<E>, "style">

function withStyle<E extends HTMLElement>(
    Comp: ComponentType<HTMLAttributes<E>>,
    style: CSSProperties,
): ComponentType<NoStyleAttrs<E>> {
    return (props: NoStyleAttrs<E>) => <Comp {...props} style={style} />
}

function parseCssString(css: string) {
    return postcss.parse(css)
}

function parseDecls(decls: string): Declaration[] {
    const root = parseCssString(decls)
    for (const node of root.nodes) {
        if (node.type !== "decl") {
            throw new Error(`Expected decl: ${node.toString()}`)
        }
    }
    return root.nodes as Declaration[]
}

function toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function toReactCssProperties(str: string): CSSProperties {
    const decls = parseDecls(str)
    const css: Record<string, unknown> = {}
    for (const decl of decls) {
        const key = toCamelCase(decl.prop)
        css[key] = decl.value
    }
    return css
}

function styledComponent<E extends HTMLElement>(
    Comp: ComponentType<HTMLAttributes<E>>,
): (strings: TemplateStringsArray) => ComponentType<NoStyleAttrs<E>> {
    return (strings: TemplateStringsArray) => {
        if (strings.length != 1) {
            throw new Error("Expected exactly one string")
        }
        const style = toReactCssProperties(strings[0])
        return withStyle(Comp, style)
    }
}

type Styled = {
    [K in keyof typeof Elem]: ReturnType<typeof styledComponent<typeof Elem[K]>>
}

const styled: Styled = Object.fromEntries(
    Object.entries(Elem).map(([key, value]) => [key, styledComponent(value)]),
) as Record<string, unknown> as Styled

function joinTplStringPartsWithArgs(strings: TemplateStringsArray, args: string[]) {
    let str = ""
    if (strings.length > 1) {
        for (let i = 0; i < strings.length; i++) {
            str += strings[i]
            if (i < args.length) {
                str += args[i]
            }
        }
    } else {
        str = strings[0]
    }
    return str
}

const css = (strings: TemplateStringsArray, ...args: string[]) => {
    const cssStr = joinTplStringPartsWithArgs(strings, args)
    parseCssString(cssStr) // will throw if parse fails
    return () => <style dangerouslySetInnerHTML={{ __html: cssStr }} />
}

const cls = (className: string) => {
    return `${className}_${crypto.randomUUID().slice(0, 8)}`
}

export { cls, css, styled }
export default styled
