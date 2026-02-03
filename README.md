# Overview
This library makes development of web applications easier by mixing both html and js, so all your html is just a function call from js.

My personal website is written using domx: https://aliannoi.github.io

Example of page creation (some functions are local and not part of domx).
```js
const projectsPage = page(domx.div({ class: "content-projects" },
                       domx.section({}, domx.ul({}, ...projects.map((item) => {
                           const sm = domx.summary({}, domx.span({}, item.name));
                           if (item.link) {
                               const link = externLink({ href: item.link }, "Link");
                               sm.appendChild(link);
                           }
                           
                           const d = domx.details({}, sm,
                                                  domx.div({ class: "separator" }),
                                                  item.getContents(),
                                                  domx.div({ class: "separator" }));
                           
                           return domx.li({}, d);
                       })))));
```
