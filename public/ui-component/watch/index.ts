function setStyle(
  self: HTMLElement,
  style: Partial<CSSStyleDeclaration>
): void {
  Object.keys(style).forEach((key) => (self.style[key] = style[key]));
}

function newDate(now: Date): HTMLElement {
  const self = document.createElement("div");
  setStyle(self, {
    fontSize: `2rem`,
    fontWeight: `bold`,
  });
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  self.append(document.createTextNode(`${year}年${month}月${day}日`));
  return self;
}

function newTime(now: Date): HTMLElement {
  const self = document.createElement("div");
  setStyle(self, {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  });
  self.append(newHourMin(now), newSec(now));
  return self;
}

function newHourMin(now: Date): HTMLElement {
  const self = document.createElement("div");
  setStyle(self, {
    fontSize: `3rem`,
    fontWeight: `bold`,
  });
  const hours = now.getHours().toString().padStart(2, "0");
  const mins = now.getMinutes().toString().padStart(2, "0");
  self.append(document.createTextNode(`${hours}時${mins}分`));
  return self;
}

function newSec(now: Date): HTMLElement {
  const self = document.createElement("div");
  setStyle(self, {
    fontSize: `2rem`,
    fontWeight: `bold`,
  });
  const sec = now.getSeconds().toString().padStart(2, "0");
  self.append(document.createTextNode(`${sec}秒`));
  return self;
}

function newContainer(): HTMLElement {
  const now = new Date();
  const self = document.createElement("div");
  self.append(newDate(now), newTime(now));
  return self;
}

window.onload = () => {
  const state = {
    cont: newContainer(),
  };

  const body = document.body;

  setStyle(body, {
    width: `100vw`,
    height: `100vh`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  });

  body.appendChild(state.cont);

  setInterval(() => {
    body.removeChild(state.cont);
    state.cont = newContainer();
    body.appendChild(state.cont);
  }, 1000);
};
