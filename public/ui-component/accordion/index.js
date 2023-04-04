"use strict";
function tag(...args) {
    if (typeof args[1] === "string" || args[1] instanceof Node) {
        const [name, ...children] = args;
        return tag2(name, children);
    }
    else {
        const [name, attrs, ...children] = args;
        return tag3(name, attrs, children);
    }
}
function tag2(name, children) {
    return tag3(name, {}, children);
}
function tag3(name, attrs, children) {
    const elem = document.createElement(name);
    Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        switch (k) {
            case "style": {
                const styles = v;
                Object.keys(styles).forEach((name) => {
                    const s = styles[name];
                    if (typeof s === "object") {
                        elem.style[name] = s.default;
                        s.eval((value) => {
                            console.log(name, value);
                            elem.style[name] = value;
                        });
                    }
                    else {
                        elem.style[name] = s;
                    }
                });
                break;
            }
            case "on": {
                const e = v;
                elem.addEventListener(e.type, e.listener, e.options);
                break;
            }
            default: {
                const s = v;
                if (typeof s === "object") {
                    elem.setAttribute(k, s.default);
                    s.eval((value) => {
                        elem.style[name] = value;
                    });
                }
                else {
                    elem.setAttribute(k, s);
                }
                break;
            }
        }
    });
    children.forEach((child) => {
        if (typeof child === "string") {
            elem.appendChild(document.createTextNode(child));
        }
        else if (child instanceof Node) {
            elem.appendChild(child);
        }
    });
    return elem;
}
function defineTag(name) {
    return (...args) => tag(...[name, ...args]);
}
const h1 = defineTag("h1");
const h2 = defineTag("h2");
const h3 = defineTag("h3");
const div = defineTag("div");
const button = defineTag("button");
class State {
    constructor(a) {
        this.value = a;
        this.listeners = [];
    }
    update(f) {
        const self = this;
        self.listeners.forEach((dispatch) => {
            self.value = f(self.value);
            dispatch(self.value);
        });
    }
    bind(f) {
        return {
            eval: (update) => {
                this.listeners.push((a) => update(f(a)));
            },
            default: f(this.value),
        };
    }
}
function listen(type, listener, options = undefined) {
    return { type, listener, options };
}
function accordion(title, items) {
    const state = new State(true);
    return div(div({
        style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
        },
    }, div({
        style: { padding: "4px", fontWeight: "bold" },
        on: listen("click", () => state.update((a) => !a)),
    }, "+"), div(div({
        style: { padding: "4px", fontWeight: "bold" },
    }, title), div({
        style: {
            display: state.bind((a) => (a ? null : "none")),
        },
    }, ...items))));
}
window.addEventListener("load", () => {
    document.body.appendChild(div(h1("Accordion"), accordion("Title", [1, 2, 3, 4, 5].map((i) => div({ style: { padding: "4px" } }, `Item${i}`)))));
});
