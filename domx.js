// Simple library for single-page application creation.
// To use, just import domx into your file like:
// import { domx } from "path-to-domx.js-file"

export const domx = {}; // namespace

// Internals.

const COMMON_TAGS = [
    "canvas", "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "hr",
    "div", "span","select", "img", "video", "audio",
    "ul", "li", "section", "article", "details", "summary",
    "header", "main", "footer",
];

const SVG_TAGS = [
    "svg", "g", "path", "defs", "clipPath", "rect", "polygon"
];

const tagImpl = (tag, attribs, ...children) => {
    const append = (child) => {
        if (Array.isArray(child)) {
            child.forEach(append);
        } else if (typeof child === "string") {
            tag.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            tag.appendChild(child);
        }
    };

    children.forEach(append);

    if (attribs && typeof(attribs) === "object" && !("nodeType" in attribs)) {
        for (const [key, value] of Object.entries(attribs)) {
            tag.setAttribute(key, value);
        }
    }
    
    tag.click = (callback) => {
        tag.onclick = callback;
        return tag;
    };

    return tag;
}

const tagCommon = (name, attribs, ...children) => {
    const tag = document.createElement(name);
    return tagImpl(tag, attribs, ...children);
};

const tagSvg = (name, attribs, ...children) => {
    const tag = document.createElementNS("http://www.w3.org/2000/svg", name);
    return tagImpl(tag, attribs, ...children);
};

// Fill the namespace with externals.

for (const tagName of COMMON_TAGS) {
    domx[tagName] = (attribs, ...children) => tagCommon(tagName, attribs, ...children);
}

for (const tagName of SVG_TAGS) {
    domx[tagName] = (attribs, ...children) => tagSvg(tagName, attribs, ...children);
}

domx["getRouter"] = () => {
    return document.querySelector(".router");
};

domx["router"] = (routes) => {
    const result = domx.div({ class: "router" });

    const refresh = () => {
        let path = document.location.hash.split("#")[1] || "/";        
        if (!(path in routes)) {
            path = "/404";
            history.replaceState(null, "", "#/404");
        }
        
        result.replaceChildren(routes[path]());
    };

    window.addEventListener("hashchange", refresh);
    refresh();

    result.refresh = (path) => {
        refresh();
    };

    return result;
};
