var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function tag() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (typeof args[1] === "string" || args[1] instanceof Node) {
        var name_1 = args[0], children = args.slice(1);
        return tag2(name_1, children);
    }
    else {
        var name_2 = args[0], attrs = args[1], children = args.slice(2);
        return tag3(name_2, attrs, children);
    }
}
function tag2(name, children) {
    return tag3(name, {}, children);
}
function tag3(name, attrs, children) {
    var elem = document.createElement(name);
    Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        switch (k) {
            case "style": {
                var styles_1 = v;
                Object.keys(styles_1).forEach(function (name) {
                    var s = styles_1[name];
                    if (typeof s === "object") {
                        elem.style[name] = s["default"];
                        s.eval(function (value) {
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
                var e = v;
                elem.addEventListener(e.type, e.listener, e.options);
                break;
            }
            default: {
                var s = v;
                if (typeof s === "object") {
                    elem.setAttribute(k, s["default"]);
                    s.eval(function (value) {
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
    children.forEach(function (child) {
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
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tag.apply(void 0, __spreadArray([name], args, true));
    };
}
var h1 = defineTag("h1");
var h2 = defineTag("h2");
var h3 = defineTag("h3");
var div = defineTag("div");
var button = defineTag("button");
var State = /** @class */ (function () {
    function State(a) {
        this.value = a;
        this.listeners = [];
    }
    State.prototype.update = function (f) {
        var self = this;
        self.listeners.forEach(function (dispatch) {
            self.value = f(self.value);
            dispatch(self.value);
        });
    };
    State.prototype.bind = function (f) {
        var _this = this;
        return {
            eval: function (update) {
                _this.listeners.push(function (a) { return update(f(a)); });
            },
            "default": f(this.value)
        };
    };
    return State;
}());
function listen(type, listener, options) {
    if (options === void 0) { options = undefined; }
    return { type: type, listener: listener, options: options };
}
function accordion(title, items) {
    var state = new State(true);
    return div(div({
        style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start"
        }
    }, div({
        style: { padding: "4px", fontWeight: "bold" },
        on: listen("click", function () { return state.update(function (a) { return !a; }); })
    }, "+"), div(div({
        style: { padding: "4px", fontWeight: "bold" }
    }, title), div.apply(void 0, __spreadArray([{
            style: {
                display: state.bind(function (a) { return (a ? null : "none"); })
            }
        }], items, false)))));
}
window.addEventListener("load", function () {
    document.body.appendChild(div(h1("Accordion"), accordion("Title", [1, 2, 3, 4, 5].map(function (i) {
        return div({ style: { padding: "4px" } }, "Item".concat(i));
    }))));
});
