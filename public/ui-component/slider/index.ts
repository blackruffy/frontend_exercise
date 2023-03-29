const state = {
  knob: null as HTMLElement | null,
  frontBar: null as HTMLElement | null,
  backBar: null as HTMLElement | null,
  knobRadius: 13,
  color: `forestgreen`,
  pos: 50,
  isDragging: false,
  initialX: null as number | null,
};

function setStyle(
  self: HTMLElement,
  style: Partial<CSSStyleDeclaration>
): void {
  Object.keys(style).forEach((key) => (self.style[key] = style[key]));
}

function newContainer(): HTMLElement {
  const self = document.createElement("div");
  setStyle(self, {
    padding: `24px`,
    backgroundColor: `whitesmoke`,
  });
  self.append(
    newSlider({
      width: 300,
      height: 10,
    })
  );
  return self;
}

function newSlider({
  width,
  height,
}: Readonly<{ width: number; height: number }>): HTMLElement {
  const self = document.createElement("div");
  setStyle(self, {
    position: `relative`,
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${height}px`,
  });
  const radius = height / 2;
  self.append(
    newBackBar({ radius }),
    newFrontBar({ radius }),
    newKnob({ radius: state.knobRadius, barHeight: height })
  );
  return self;
}

function newBackBar({ radius }: Readonly<{ radius: number }>): HTMLElement {
  const self = document.createElement("div");
  state.backBar = self;
  setStyle(self, {
    position: `absolute`,
    top: `0px`,
    left: `0px`,
    width: `100%`,
    height: `100%`,
    borderRadius: `${radius}px`,
    backgroundColor: `gainsboro`,
    overflow: `hidden`,
  });
  return self;
}

function newFrontBar({ radius }: Readonly<{ radius: number }>): HTMLElement {
  const self = document.createElement("div");
  state.frontBar = self;
  setStyle(self, {
    position: `absolute`,
    top: `0px`,
    left: `0px`,
    width: `${state.pos}%`,
    height: `100%`,
    borderTopLeftRadius: `${radius}px`,
    borderBottomLeftRadius: `${radius}px`,
    backgroundColor: `${state.color}`,
  });
  return self;
}

function newKnob({
  radius,
  barHeight,
}: Readonly<{ radius: number; barHeight: number }>): HTMLElement {
  const self = document.createElement("div");
  state.knob = self;
  const offset = barHeight / 2 - radius;
  setStyle(self, {
    position: `absolute`,
    top: `${offset}px`,
    left: `calc(${state.pos}% - ${radius}px)`,
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: `${radius * 2}px`,
    backgroundColor: `${state.color}`,
    border: `1px solid ${state.color}`,
  });

  self.addEventListener("mousedown", (e) => {
    onDown(e.clientX);
  });

  self.addEventListener("touchstart", (e) => {
    onDown(e.touches[0].clientX);
  });

  return self;
}

function onDown(clientX: number) {
  state.isDragging = true;
  state.initialX = clientX;
}

function onMove(clientX: number) {
  if (state.isDragging) {
    const pos = getPos(clientX);
    setStyle(state.frontBar, {
      width: `${pos}%`,
    });
    setStyle(state.knob, {
      left: `calc(${pos}% - ${state.knobRadius}px)`,
    });
  }
}

function onUp(clientX: number) {
  state.isDragging = false;
  state.pos = getPos(clientX);
}

function getPos(clientX: number): number {
  const { width } = state.backBar.getBoundingClientRect();
  const diffX = clientX - state.initialX;
  const pos_ = state.pos + (diffX / width) * 100;
  return pos_ > 100 ? 100 : pos_ < 0 ? 0 : pos_;
}

window.onload = () => {
  const body = document.body;

  setStyle(body, {
    width: `100vw`,
    height: `100vh`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  });

  body.addEventListener("mousemove", (e) => {
    onMove(e.clientX);
  });

  body.addEventListener("touchmove", (e) => {
    onMove(e.touches[0].clientX);
  });

  body.addEventListener("mouseup", (e) => {
    onUp(e.clientX);
  });

  body.addEventListener("touchend", (e) => {
    onUp(e.touches[0].clientX);
  });

  body.appendChild(newContainer());
};
