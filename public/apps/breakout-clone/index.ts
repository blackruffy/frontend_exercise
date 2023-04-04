(() => {
  type Settings = Readonly<{
    frame: Readonly<{
      rate: number;
      interval: number;
    }>;

    font: Readonly<{
      fontSize: number;
      family: string;
      fontColor: string;
      textAlign: CanvasTextAlign;
      textBaseline: CanvasTextBaseline | "center";
    }>;

    button: Readonly<{
      backgroundColor: string;
      margin: number;
      borderRadius: number;
    }>;

    stage: Readonly<{
      marginX: number;
      marginY: number;
      x: number;
      y: number;
      width: number;
      height: number;
      ncols: number;
      nrows: number;
      color: string;
      winColor: string;
      looseColor: string;
    }>;

    ball: Readonly<{
      color: string;
      radius: number;
      speed: number;
    }>;

    block: Readonly<{
      colors: Array<string>;
      width: number;
      height: number;
      lineColors: Array<string>;
    }>;

    disc: Readonly<{
      width: number;
      height: number;
      color: string;
      speed: number;
    }>;
  }>;

  const settings: Settings = (() => {
    const frameRate = 62;
    const stageMarginX = 10;
    const stageMarginY = 10;
    const stageX = stageMarginX;
    const stageY = stageMarginY;
    const stageNcols = 8;
    const stageNrows = 20;
    const blockWidth = (window.innerWidth - stageMarginX * 2) / stageNcols;

    return {
      frame: {
        rate: frameRate,
        interval: 1000 / frameRate,
      },

      font: {
        fontSize: 32,
        family: `Helvetica`,
        fontColor: `white`,
        textAlign: `center`,
        textBaseline: `center`,
      },

      button: {
        backgroundColor: `dodgerblue`,
        margin: 18,
        borderRadius: 12,
      },

      stage: {
        marginX: stageMarginX,
        marginY: stageMarginY,
        x: stageX,
        y: stageY,
        width: window.innerWidth - stageX * 2,
        height: window.innerHeight - stageY * 2,
        ncols: stageNcols,
        nrows: stageNrows,
        color: `#333333`,
        winColor: `#333333`,
        looseColor: `rgba(150, 150, 150, 0.5)`,
      },

      ball: {
        color: `white`,
        radius: 10,
        speed: 7,
      },

      block: {
        colors: [`royalblue`],
        width: blockWidth,
        height: (window.innerHeight - stageMarginY * 2) / stageNrows,
        lineColors: [`skyblue`],
      },

      disc: {
        width: blockWidth,
        height: 10, // block.height / 3,
        color: `silver`,
        speed: 15,
      },
    };
  })();

  type State = {
    started: boolean;
    isLost: boolean;
    canvas: {
      current: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
    };
    frame: {
      intervalId: undefined | number;
    };
    blocks: Array<Block>;
    disc: Disc;
    ball: Ball;
    buttons: {
      start: Button;
      tryAgain: Button;
    };
  };

  function newState(canvas: HTMLCanvasElement): State {
    const ctx = canvas.getContext("2d");
    if (ctx === null) throw Error(`Failed to get a canvas context`);

    const disc = newDisc(
      window.innerWidth / 2,
      window.innerHeight - settings.stage.marginY - settings.disc.height
    );
    const self = {
      started: false,
      isLost: false,

      canvas: {
        current: canvas,
        ctx,
      },

      frame: {
        intervalId: undefined,
      },

      blocks: Array.from({ length: settings.stage.ncols }).flatMap((_, i) => {
        return Array.from({ length: settings.stage.nrows / 2 }).map((_, j) => {
          return newBlock(
            settings.stage.marginX + i * settings.block.width,
            settings.stage.marginY + j * settings.block.height
          );
        });
      }),

      disc,

      ball: newBall(
        window.innerWidth / 2,
        disc.centerY - settings.disc.height / 2 - settings.ball.radius
      ),

      buttons: {
        start: newButton(
          ctx,
          "Press the enter key to start",
          settings.stage.width / 2,
          settings.stage.height / 2 + 100,
          {
            onClick: () => {
              start(self);
            },
          }
        ),
        tryAgain: newButton(
          ctx,
          `Press the enter key to start over`,
          settings.stage.width / 2,
          settings.stage.height / 2 + 100,
          {
            onClick: () => {
              initState(self);
              start(self);
            },
          }
        ),
      },
    };

    return self;
  }

  function initState(self: State): void {
    const a = newState(self.canvas.current);
    self.started = false;
    self.isLost = false;
    self.ball = a.ball;
    self.disc = a.disc;
    self.blocks = a.blocks;
  }

  function setStyle(self: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    Object.entries(style).forEach(
      ([k, v]) => (self.style[k as any] = v as any)
    );
  }

  function setAttrs(self: HTMLElement, attrs: Record<string, string>) {
    Object.entries(attrs).forEach(([k, v]) => self.setAttribute(k, v));
  }

  function newContainer() {
    const self = document.createElement(`div`);
    setStyle(self, {
      margin: `0px`,
      padding: `0px`,
      border: `0px solid black`,
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
      overflow: `hidden`,
    });

    self.appendChild(newCanvas());

    return self;
  }

  function newCanvas() {
    const self = document.createElement(`canvas`);
    setAttrs(self, {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
      tabindex: `1`,
    });
    setStyle(self, {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
      backgroundColor: `#444444`,
    });

    const state = newState(self);

    self.addEventListener("keydown", (e) => {
      if (state.started) {
        state.disc.move =
          e.code === `ArrowRight`
            ? "right"
            : e.code === `ArrowLeft`
            ? "left"
            : null;
      }
    });

    self.addEventListener("keyup", () => {
      if (state.started) {
        state.disc.move = null;
      }
    });

    self.addEventListener("keypress", () => {
      if (!state.started) {
        state.buttons.start.onClick?.();
      }

      if (state.isLost) {
        state.buttons.tryAgain.onClick?.();
      }
    });

    self.addEventListener("click", (e) => {
      if (!state.started) {
        if (containRect(state.buttons.start, e.clientX, e.clientY)) {
          state.buttons.start.onClick?.();
        }
      }

      if (state.isLost) {
        if (containRect(state.buttons.tryAgain, e.clientX, e.clientY)) {
          state.buttons.tryAgain.onClick?.();
        }
      }
    });

    drawText(
      state,
      newText(
        `Breakout Clone`,
        settings.stage.width / 2,
        settings.stage.height / 2,
        {
          fontSize: 48,
        }
      )
    );

    drawButton(state, state.buttons.start);

    return self;
  }

  type Text = Readonly<{
    text: string;
    centerX: number;
    centerY: number;
    fontSize: number;
    fontColor: string;
  }>;

  function newText(
    text: string,
    centerX: number,
    centerY: number,
    options: Readonly<{
      fontSize?: number;
      fontColor?: string;
    }> = {}
  ): Text {
    const { fontSize, fontColor } = options ?? {};
    return {
      text,
      centerX,
      centerY,
      fontSize: fontSize ?? settings.font.fontSize,
      fontColor: fontColor ?? settings.font.fontColor,
    };
  }

  function drawText(state: State, text: Text): void {
    const ctx = state.canvas.ctx;
    ctx.font = `${text.fontSize}px ${settings.font.family}`;
    ctx.fillStyle = text.fontColor;
    ctx.textAlign = settings.font.textAlign;
    ctx.textBaseline = settings.font.textBaseline as CanvasTextBaseline;
    ctx.fillText(text.text, text.centerX, text.centerY);
  }

  function fillRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
  }

  type Button = Text &
    Readonly<{
      x: number;
      y: number;
      width: number;
      height: number;
      backgroundColor: string;
      onClick?: () => void;
    }>;

  function newButton(
    ctx: CanvasRenderingContext2D,
    title: string,
    centerX: number,
    centerY: number,
    options: Readonly<{
      width?: number;
      height?: number;
      fontSize?: number;
      fontColor?: string;
      backgroundColor?: string;
      margin?: number;
      onClick?: () => void;
    }> = {}
  ): Button {
    const {
      width,
      height,
      // fontSize,
      // fontColor,
      backgroundColor,
      margin,
      onClick,
    } = options ?? {};
    const text = newText(title, centerX, centerY, options);
    ctx.font = `${text.fontSize}px ${settings.font.family}`;
    const textMetrics = ctx.measureText(title);
    const buttonMargin = margin ?? settings.button.margin;
    const buttonWidth = width ?? textMetrics.width + buttonMargin * 2;
    const buttonHeight =
      height ??
      textMetrics.actualBoundingBoxAscent +
        textMetrics.actualBoundingBoxDescent +
        buttonMargin * 2;
    return {
      ...text,
      x: text.centerX - buttonWidth / 2,
      y: text.centerY - textMetrics.actualBoundingBoxAscent - buttonMargin,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: backgroundColor ?? settings.button.backgroundColor,
      onClick,
    };
  }

  function drawButton(state: State, button: Button): void {
    const ctx = state.canvas.ctx;
    ctx.fillStyle = button.backgroundColor;
    fillRoundedRect(
      ctx,
      button.x,
      button.y,
      button.width,
      button.height,
      settings.button.borderRadius
    );
    //ctx.fillRect(button.x, button.y, button.width, button.height);
    drawText(state, button);
  }

  function fillStage(state: State): void {
    const ctx = state.canvas.ctx;
    ctx.fillStyle = settings.stage.color;
    ctx.fillRect(
      settings.stage.x,
      settings.stage.y,
      settings.stage.width,
      settings.stage.height
    );
  }

  function strokeStage(state: State): void {
    const ctx = state.canvas.ctx;
    ctx.strokeStyle = settings.stage.color;
    ctx.strokeRect(
      settings.stage.x,
      settings.stage.y,
      settings.stage.width,
      settings.stage.height
    );
  }

  type Block = Readonly<{
    isBlock: true;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    lineColor: string;
  }>;

  function newBlock(x: number, y: number): Block {
    const ncolors = settings.block.colors.length;
    const colorIndex = Math.round(Math.random() * (ncolors - 1));
    const color = settings.block.colors[colorIndex];
    const lineColor = settings.block.lineColors[colorIndex];
    const { width, height } = settings.block;
    return {
      isBlock: true,
      x,
      y,
      width,
      height,
      color,
      lineColor,
    };
  }

  function fillBlock(state: State, block: Block): void {
    const { ctx } = state.canvas;
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
    ctx.strokeStyle = block.lineColor;
    ctx.strokeRect(block.x, block.y, block.width, block.height);
  }

  type Ball = {
    isBall: true;
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
    speedX: number;
    speedY: number;
  };

  function newBall(centerX: number, centerY: number): Ball {
    const [minD, maxD] = Math.random() > 0.5 ? [30, 60] : [120, 150];
    const min = (Math.PI * minD) / 180;
    const max = (Math.PI * maxD) / 180;
    const angle = Math.random() * (max - min) + min;
    const speed = settings.ball.speed;
    const speedX = speed * Math.cos(angle);
    const speedY = speed * Math.sin(angle);
    return {
      isBall: true,
      centerX,
      centerY,
      radius: settings.ball.radius,
      color: settings.ball.color,
      speedX,
      speedY,
    };
  }

  function fillBall(state: State, ball: Ball): void {
    const ctx = state.canvas.ctx;
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.centerX, ball.centerY, ball.radius, 0, Math.PI * 2, true);
    ctx.fill();
  }

  type Disc = {
    isDisc: true;
    centerX: number;
    centerY: number;
    width: number;
    height: number;
    color: string;
    move: null | "left" | "right";
  };

  function newDisc(centerX: number, centerY: number): Disc {
    return {
      isDisc: true,
      centerX,
      centerY,
      width: settings.disc.width,
      height: settings.disc.height,
      color: settings.disc.color,
      move: null,
    };
  }

  function fillDisc(state: State, disc: Disc): void {
    const ctx = state.canvas.ctx;
    const { width, height, color } = settings.disc;
    const x = disc.centerX - width / 2;
    const y = disc.centerY - height / 2;
    ctx.fillStyle = color;
    fillRoundedRect(ctx, x, y, width, height, height / 2);
  }

  function drawFrame(state: State): void {
    fillStage(state);

    state.blocks.forEach((block) => {
      fillBlock(state, block);
    });

    fillBall(state, state.ball);

    fillDisc(state, state.disc);

    strokeStage(state);
  }

  type Rect = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;

  type Sides = Readonly<{
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  }>;

  type Collide = "none" | keyof Sides;

  function collideRectHelper(ball: Ball, rect: Rect): Sides {
    const leftX = ball.centerX - ball.radius;
    const rightX = ball.centerX + ball.radius;
    const topY = ball.centerY - ball.radius;
    const bottomY = ball.centerY + ball.radius;
    return {
      left: rightX > rect.x,
      right: leftX < rect.x + rect.width,
      top: bottomY > rect.y,
      bottom: topY < rect.y + rect.height,
    };
  }

  function collideRect(ball: Ball, rect: Rect): Collide {
    const c = collideRectHelper(ball, rect);
    if (c.left && c.right && c.top && c.bottom) {
      const prev = {
        ...ball,
        centerX: ball.centerX - ball.speedX,
        centerY: ball.centerY - ball.speedY,
      };
      const p = collideRectHelper(prev, rect);
      if (!p.left) return "left";
      else if (!p.right) return "right";
      else if (!p.top) return "top";
      else if (!p.bottom) return "bottom";
      else return "none";
    } else return "none";
  }

  function containRect(rect: Rect, x: number, y: number): boolean {
    return (
      x > rect.x &&
      x < rect.x + rect.width &&
      y > rect.y &&
      y < rect.y + rect.height
    );
  }

  function toRect(disc: Disc): Rect {
    return {
      x: disc.centerX - disc.width / 2,
      y: disc.centerY - disc.height / 2,
      width: disc.width,
      height: disc.height,
    };
  }

  function collideWall(state: State): Collide {
    const ball = state.ball;
    const leftX = ball.centerX - ball.radius;
    const rightX = ball.centerX + ball.radius;
    const topY = ball.centerY - ball.radius;
    const bottomY = ball.centerY + ball.radius;

    const collideLeft = leftX < settings.stage.x;
    const collideRight = rightX > settings.stage.x + settings.stage.width;
    const collideTop = topY < settings.stage.y;
    const collideBottom = bottomY > settings.stage.y + settings.stage.height;

    if (collideLeft) return "left";
    else if (collideRight) return "right";
    else if (collideTop) return "top";
    else if (collideBottom) return "bottom";
    else return "none";
  }

  function nextFrame(state: State): void {
    state.ball.centerX += state.ball.speedX;
    state.ball.centerY += state.ball.speedY;
  }

  function updateSpeed(state: State, speedX: number, speedY: number): void {
    state.ball.speedX = speedX;
    state.ball.speedY = speedY;
  }

  function reflectBall(
    state: State,
    reflectX: boolean,
    reflectY: boolean
  ): void {
    if (reflectX) state.ball.speedX = -state.ball.speedX;
    if (reflectY) state.ball.speedY = -state.ball.speedY;
  }

  function onCollideWall(state: State): void {
    const ball = state.ball;
    switch (collideWall(state)) {
      case "left":
        ball.centerX = settings.stage.x + ball.radius + 1;
        reflectBall(state, true, false);
        break;
      case "right":
        ball.centerX =
          settings.stage.x + settings.stage.width - ball.radius - 1;
        reflectBall(state, true, false);
        break;
      case "top":
        ball.centerY = settings.stage.y + ball.radius + 1;
        reflectBall(state, false, true);
        break;
      case "bottom":
        state.isLost = true;
        ball.centerY =
          settings.stage.y + settings.stage.height - ball.radius - 1;
        updateSpeed(state, 0, 0);
        break;
      default:
        break;
    }
  }

  function onLoose(state: State) {
    if (state.isLost) {
      clearInterval(state.frame.intervalId);
      const { ctx } = state.canvas;
      const stage = settings.stage;

      ctx.fillStyle = stage.looseColor;
      ctx.fillRect(stage.x, stage.y, stage.width, stage.height);

      const text = newText(`You Loose`, stage.width / 2, stage.height / 2, {
        fontSize: 48,
      });

      drawText(state, text);

      drawButton(state, state.buttons.tryAgain);
    }
  }

  function onCollideRect(state: State, rect: Rect): boolean {
    const ball = state.ball;
    switch (collideRect(ball, rect)) {
      case "left":
        ball.centerX = rect.x - ball.radius - 1;
        reflectBall(state, true, false);
        return true;
      case "right":
        ball.centerX = rect.x + rect.width + ball.radius + 1;
        reflectBall(state, true, false);
        return true;
      case "top":
        ball.centerY = rect.y - ball.radius - 1;
        reflectBall(state, false, true);
        return true;
      case "bottom":
        ball.centerY = rect.y + rect.height + ball.radius + 1;
        reflectBall(state, false, true);
        return true;
      default:
        return false;
    }
  }

  function onCollideBlocks(state: State): void {
    state.blocks = state.blocks.filter((block) => {
      return !onCollideRect(state, block);
    });
  }

  function onWin(state: State): void {
    if (state.blocks.length === 0) {
      const stage = settings.stage;
      const ctx = state.canvas.ctx;
      clearInterval(state.frame.intervalId);

      ctx.fillStyle = stage.winColor;
      ctx.fillRect(stage.x, stage.y, stage.width, stage.height);

      const text = newText(`You Win`, stage.width / 2, stage.height / 2, {
        fontSize: 48,
      });

      drawText(state, text);

      drawButton(state, state.buttons.tryAgain);
    }
  }

  function onCollideDisc(state: State) {
    onCollideRect(state, toRect(state.disc));
  }

  function moveDisc(state: State): void {
    const disc = state.disc;
    const speed = settings.disc.speed;
    const stage = settings.stage;
    switch (disc.move) {
      case "left":
        disc.centerX -= speed;
        if (disc.centerX - disc.width / 2 < stage.x)
          disc.centerX = disc.width / 2 + stage.x;
        break;
      case "right":
        disc.centerX += speed;
        if (disc.centerX + disc.width / 2 > stage.x + stage.width)
          disc.centerX = stage.x + stage.width - disc.width / 2;
        break;
      default:
        break;
    }
  }

  function start(state: State): void {
    state.started = true;
    state.frame.intervalId = window.setInterval(() => {
      drawFrame(state);
      nextFrame(state);

      onCollideWall(state);
      onCollideBlocks(state);
      onCollideDisc(state);
      moveDisc(state);
      onLoose(state);
      onWin(state);
    }, settings.frame.interval);
  }

  window.onload = () => {
    document.body.appendChild(newContainer());
  };
})();
