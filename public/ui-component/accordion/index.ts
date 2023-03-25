type Updater = Readonly<{
  eval: (update: (value: string | undefined | null) => void) => void;
  default?: string;
}>;
type AttrValue = string | Updater;
type CSSUpdater = Readonly<{
  [key in keyof CSSStyleDeclaration]?: Updater;
}>;
type StyleProps = Readonly<Partial<CSSStyleDeclaration>> | CSSUpdater;
type OnEvent = Readonly<{
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}>;
type Attrs = Readonly<Record<string, AttrValue | StyleProps | OnEvent>>;
type Children = Array<Node | string>;

function tag(
  ...args: [string, Attrs, ...Children] | [string, ...Children]
): Node {
  if (typeof args[1] === "string" || args[1] instanceof Node) {
    const [name, ...children] = args;
    return tag2(name, children as Children);
  } else {
    const [name, attrs, ...children] = args;
    return tag3(name, attrs as Attrs, children);
  }
}

function tag2(name: string, children: Children): Node {
  return tag3(name, {} as Attrs, children);
}

function tag3(name: string, attrs: Attrs, children: Children) {
  const elem = document.createElement(name);

  Object.keys(attrs).forEach((k) => {
    const v = attrs[k];
    switch (k) {
      case "style": {
        const styles = v as StyleProps;
        Object.keys(styles).forEach((name) => {
          const s = styles[name] as string | Updater;
          if (typeof s === "object") {
            elem.style[name] = s.default;
            s.eval((value) => {
              console.log(name, value);
              elem.style[name] = value;
            });
          } else {
            elem.style[name] = s;
          }
        });
        break;
      }
      case "on": {
        const e = v as OnEvent;
        elem.addEventListener(e.type, e.listener, e.options);
        break;
      }
      default: {
        const s = v as string | Updater;
        if (typeof s === "object") {
          elem.setAttribute(k, s.default);
          s.eval((value) => {
            elem.style[name] = value;
          });
        } else {
          elem.setAttribute(k, s);
        }
        break;
      }
    }
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      elem.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      elem.appendChild(child);
    }
  });

  return elem;
}

function defineTag(
  name: string
): (...args: [Attrs, ...Children] | [...Children]) => Node {
  return (...args) => tag(...[name, ...args]);
}

const h1 = defineTag("h1");
const h2 = defineTag("h2");
const h3 = defineTag("h3");
const div = defineTag("div");
const button = defineTag("button");

class State<A> {
  private value: A;
  private listeners: Array<(a: A) => void>;
  constructor(a: A) {
    this.value = a;
    this.listeners = [];
  }

  update(f: (a: A) => A): void {
    const self = this;
    self.listeners.forEach((dispatch) => {
      self.value = f(self.value);
      dispatch(self.value);
    });
  }

  bind(f: (a: A) => string): Updater {
    return {
      eval: (update: (value: string | undefined | null) => void) => {
        this.listeners.push((a) => update(f(a)));
      },
      default: f(this.value),
    };
  }
}

function listen(
  type: string,
  listener: EventListenerOrEventListenerObject,
  options: boolean | AddEventListenerOptions | undefined = undefined
): OnEvent {
  return { type, listener, options };
}

function accordion(title: string, items: Children): Node {
  const state = new State<boolean>(true);

  return div(
    div(
      {
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        },
      },
      div(
        {
          style: { padding: "4px", fontWeight: "bold" },
          on: listen("click", () => state.update((a) => !a)),
        },
        "+"
      ),
      div(
        div(
          {
            style: { padding: "4px", fontWeight: "bold" },
          },
          title
        ),
        div(
          {
            style: {
              display: state.bind((a) => (a ? null : "none")),
            },
          },
          ...items
        )
      )
    )
  );
}

window.addEventListener("load", () => {
  document.body.appendChild(
    div(
      h1("Accordion"),
      accordion(
        "Title",
        [1, 2, 3, 4, 5].map((i) =>
          div({ style: { padding: "4px" } }, `Item${i}`)
        )
      )
    )
  );
});
