(() => {
  const fps = 64;
  const rotateRange = 500;
  const stayRange = 1000;
  const scaleRange = 3000;
  const scaleRate = 0.01;
  const ballRange = stayRange + scaleRange;
  const interval = Math.round(1000 / fps);
  const maxTime = 4 * scaleRange + 4 * stayRange + 3 * rotateRange;

  type State = {
    time: number;
    reverse: boolean;
    screens: Array<
      Readonly<{
        main: HTMLElement;
        text: HTMLElement;
        balls: HTMLElement;
      }>
    >;
  };

  const state: State = {
    time: 0,
    reverse: false,
    screens: [],
  };

  function setStyle(
    self: HTMLElement,
    style: Partial<CSSStyleDeclaration>
  ): void {
    Object.keys(style).forEach(
      (key) => (self.style[key as any] = style[key as any] as string)
    );
  }

  function tag<K extends keyof HTMLElementTagNameMap>(name: K): HTMLElement {
    return document.createElement(name);
  }

  function div(): HTMLElement {
    return tag("div");
  }

  function text(value: string): Text {
    return document.createTextNode(value);
  }

  function newContainer() {
    const self = div();
    setStyle(self, {
      position: `fixed`,
      top: `0px`,
      left: `0px`,
      width: `100vw`,
      height: `100vh`,
    });

    self.append(
      newScreen({
        message: "JavaScript",
        ballColors: [`pink`, `orange`, `tomato`, `hotpink`, `violet`],
        backgroundColor: `orangered`,
      }),
      newScreen({
        message: "TypeScript",
        ballColors: [
          `darkseagreen`,
          `teal`,
          `darkgreen`,
          `palegreen`,
          `yellowgreen`,
        ],
        backgroundColor: `green`,
      }),
      newScreen({
        message: "CoffeeScript",
        ballColors: [`yellow`, `khaki`, `peru`, `wheat`, `gold`],
        backgroundColor: `orange`,
      }),
      newScreen({
        message: "LiveScript",
        ballColors: [
          `royalblue`,
          `lightskyblue`,
          `darkblue`,
          `lightblue`,
          `turquoise`,
        ],
        backgroundColor: `blue`,
      })
    );

    return self;
  }

  function newScreen({
    message,
    ballColors,
    backgroundColor,
  }: Readonly<{
    message: string;
    ballColors: string[];
    backgroundColor: string;
  }>) {
    const self = div();
    const angle = state.screens.length === 0 ? 0 : 90;
    setStyle(self, {
      position: `fixed`,
      top: `0px`,
      left: `0px`,
      width: `100vw`,
      height: `100vh`,
      backgroundColor,
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `center`,
      alignItems: `center`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: `bottom left`,
      overflow: `hidden`,
    });

    const text = newText(message);
    const balls = newBalls(ballColors);
    state.screens.push({
      main: self,
      balls,
      text,
    });
    self.append(balls, text);

    return self;
  }

  function newBalls(colors: string[]) {
    const self = div();
    setStyle(self, {
      position: "absolute",
      top: `0px`,
      left: `0px`,
    });
    self.append(...Array.from({ length: 100 }).map(() => newBall(colors)));
    return self;
  }

  function newBall(colors: string[]) {
    const self = div();
    const radius = Math.round(Math.random() * 60 + 15);
    const colorIndex = Math.round(Math.random() * colors.length);
    const left = Math.round(Math.random() * window.innerWidth);
    const top = Math.round(
      Math.random() *
        (window.innerHeight + stayRange + scaleRange + rotateRange)
    );
    setStyle(self, {
      position: `absolute`,
      left: `${left}px`,
      top: `${top}px`,
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      borderRadius: `${radius}px`,
      backgroundColor: `${colors[colorIndex]}`,
    });

    return self;
  }

  function newText(value: string) {
    const self = div();
    setStyle(self, {
      position: `relative`,
      fontSize: `3rem`,
      fontWeight: `bold`,
      color: `white`,
      transform: `scale(${scaleRange * scaleRate + 1})`,
    });

    self.append(text(value));

    return self;
  }

  function onFrame(index: number) {
    const time = state.time;
    const screen = state.screens[index];
    const startY =
      index === 0
        ? 0
        : index * (scaleRange + stayRange) + (index - 1) * rotateRange;

    if (screen !== null) {
      if (index > 0) {
        const angle =
          time < startY
            ? 90
            : time > startY + rotateRange
            ? 0
            : 90 - ((time - startY) * 90) / rotateRange;
        setStyle(screen.main, {
          transform: `rotate(${angle}deg)`,
        });
      }

      const ballY = time - startY - (index === 0 ? 0 : rotateRange);
      if (ballY > 0 && ballY < ballRange + rotateRange) {
        setStyle(screen.balls, {
          transform: `translateY(${-ballY}px)`,
        });
      }

      const scaleY = time - startY - (index === 0 ? 0 : rotateRange);
      if (scaleY > 0 && scaleY < scaleRange) {
        setStyle(screen.text, {
          transform: `scale(${(scaleRange - scaleY) * scaleRate + 1})`,
        });
      }
    }
  }

  window.onload = () => {
    setStyle(document.body, {
      position: `relative`,
    });

    window.setInterval(() => {
      state.screens.forEach((_, i) => onFrame(i));
      if (!state.reverse) state.time += interval;
      else state.time -= interval;
      if (state.time < 0) state.reverse = false;
      else if (state.time > maxTime) state.reverse = true;
    }, interval);

    document.body.append(newContainer());
  };
})();
