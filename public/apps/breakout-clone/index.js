'use strict';

function newEnv(ctx) {
  const self = {};
  
  self.ctx = ctx;

  const font = {};
  font.fontSize = 64;
  font.family = 'Helvetica';
  font.fontColor = `white`;
  font.textAlign = `center`;
  font.textBaseline = `center`;
  self.font = font;

  const button = {};
  button.backgroundColor = `royalblue`;
  button.margin = 12;
  self.button = button;
  
  const frame = {}
  frame.rate = 62;
  frame.interval = 1000 / frame.rate;
  frame.intervalId = null;
  self.frame = frame;
  
  const stage = {};
  stage.marginX = 10;
  stage.marginY = 10;
  stage.x = stage.marginX;
  stage.y = stage.marginY;
  stage.width = window.innerWidth - stage.x * 2;
  stage.height = window.innerHeight - stage.y * 2;
  stage.ncols = 8;
  stage.nrows = 20;
  stage.color = `black`;
  stage.winColor = `black`;
  stage.looseColor = `rgba(150, 0, 0, 0.5)`;
  self.stage = stage;

  const ball = {}
  ball.color = `#88CCFF`;
  ball.radius = 10;
  self.ball = ball;

  const block = {};
  block.color = `tomato`;
  block.width = (window.innerWidth - stage.marginX * 2) / stage.ncols;
  block.height = (window.innerHeight - stage.marginY * 2) / stage.nrows;
  self.block = block;

  const disc = {};
  disc.width = block.width;
  disc.height = block.height / 3;
  disc.color = `#88EE88`;
  disc.speed = 15;
  self.disc = disc;
  
  return self;
};

function initState(self) {
  const state = {};
  state.blocks = Array.from({length: self.stage.ncols}).flatMap((_, i) => {
    return Array.from({length: self.stage.nrows/2}).map((_, j) => {
      return newBlock(
	self,
	self.stage.marginX + i * self.block.width,
	self.stage.marginY + j * self.block.height,
      );
    });
  });
  
  state.disc = newDisc(
    self,
    window.innerWidth/2,
    window.innerHeight - self.stage.marginY - self.disc.height
  );

  state.ball = newBall(
    self,
    window.innerWidth/2,
    state.disc.centerY - self.disc.height / 2 - self.ball.radius
  );

  state.started = false;
  state.isLost = false;

  state.buttons = {
    start: newButton(
      self,
      'Start',
      self.stage.width / 2,
      self.stage.height / 2 + 100,
      {
	onClick: () => {
	  start(self);
	}
      }
    ),
    tryAgain: newButton(
      self,
      `Try Again`,
      self.stage.width / 2,
      self.stage.height / 2 + 100,
      {
	onClick: () => {
	  self.state.started = true;
	  start(self);
	},
      }
    ),
  };
  
  self.state = state;  
}

function setStyle(self, style) {
  Object.entries(style).forEach(([k, v]) => self.style[k] = v);
}

function setAttrs(self, attrs) {
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

  self.addEventListener('keydown', (e) => {
    env.state.disc.move = e.keyCode === 39 ? 'right' : e.keyCode === 37 ? 'left' : null;
  });

  self.addEventListener('keyup', (e) => {
    env.state.disc.move = null;
  });

  self.addEventListener('click', (e) => {
    if (!env.state.started) {
      if (containRect(env.state.buttons.start, e.clientX, e.clientY)) {
	env.state.buttons.start.onClick?.();
      }
    } else if (env.state.isLost) {
      if (containRect(env.state.buttons.tryAgain, e.clientX, e.clientY)) {
	env.state.buttons.tryAgain.onClick?.();
      }
    }
  });

  const ctx = self.getContext('2d');
  const env = newEnv(ctx);
  initState(env);

  drawText(env, newText(
    env,
    `Breakout Clone`, 
    env.stage.width / 2,
    env.stage.height / 2,
    {
      fontSize: 48,
    }
  ));
  
  drawButton(env, env.state.buttons.start);
  
  return self;
}

function newText(env, text, centerX, centerY, options) {
  const {fontSize, fontColor} = options ?? {};
  return {
    text,
    centerX,
    centerY,
    fontSize: fontSize ?? env.font.fontSize,
    fontColor: fontColor ?? env.font.fontColor,
  };
}

function drawText(env, text) {
  const ctx = env.ctx;
  ctx.font = `${text.fontSize}px ${env.font.family}`;
  ctx.fillStyle = text.fontColor;
  ctx.textAlign = env.font.textAlign;
  ctx.textBaseline = env.font.textBaseline;
  ctx.fillText(
    text.text,
    text.centerX,
    text.centerY,
  );
}

function newButton(env, title, centerX, centerY, options) {
  const ctx = env.ctx;
  const {width, height, fontSize, fontColor, backgroundColor, margin, onClick} = options ?? {};
  const text = newText(env, title, centerX, centerY, options);
  ctx.font = `${text.fontSize}px ${env.font.family}`;
  const textMetrics = ctx.measureText(title);
  const buttonMargin = margin ?? env.button.margin;
  const buttonWidth = width ?? textMetrics.width + buttonMargin * 2;
  const buttonHeight = height ?? textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + buttonMargin * 2;
  return {
    ...text,
    x: text.centerX - buttonWidth / 2,
    y: text.centerY - textMetrics.actualBoundingBoxAscent - buttonMargin,
    width: buttonWidth,
    height: buttonHeight,
    backgroundColor: backgroundColor ?? env.button.backgroundColor,
    onClick,
  };
}

function drawButton(env, button) {
  const ctx = env.ctx;
  ctx.fillStyle = button.backgroundColor;
  ctx.fillRect(
    button.x,
    button.y,
    button.width,
    button.height,
  );
  drawText(env, button);
}

function fillStage(env) {
  const {stage, ctx} = env;
  ctx.fillStyle = stage.color;
  ctx.fillRect(stage.x, stage.y, stage.width, stage.height);
}

function newBlock(env, x, y) {
  const {width, height, color} = env.block;
  return {
    isBlock: true,
    x,
    y,
    width,
    height,
    color
  };
}

function fillBlock(env, block) {
  const {ctx} = env;
  ctx.fillStyle = block.color;
  ctx.fillRect(block.x, block.y, block.width, block.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(block.x, block.y, block.width, block.height);
}

function newBall(env, centerX, centerY) {
  const [minD, maxD] = Math.random() > 0.5 ? [30, 60] : [120, 150];
  const min = Math.PI * minD / 180;
  const max = Math.PI * maxD / 180;
  const angle = Math.random() * (max - min) + min
  const speed = 7;
  const speedX = speed * Math.cos(angle);
  const speedY = speed * Math.sin(angle);
  return {
    isBall: true,
    centerX,
    centerY,
    radius: env.ball.radius,
    color: env.ball.color,
    speedX,
    speedY,
  };
}

function fillBall(env, ball) {
  const ctx = env.ctx;
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.centerX, ball.centerY, ball.radius, 0, Math.PI * 2, true);
  ctx.fill();
}

function newDisc(env, centerX, centerY) {
  return {
    isDisc: true,
    centerX,
    centerY,
    width: env.disc.width,
    height: env.disc.height,
    color: env.disc.color,
    move: null,
  };
}

function fillDisc(env, disc) {
  const ctx = env.ctx;
  const {width, height, color} = env.disc;
  const x = disc.centerX - width / 2;
  const y = disc.centerY - height / 2;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawFrame(env) {
  
  fillStage(env);
  
  env.state.blocks.forEach(block => {
    fillBlock(env, block);
  });

  fillBall(env, env.state.ball);

  fillDisc(env, env.state.disc);
  
}

function collideRectHelper(ball, rect) {
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

function collideRect(ball, rect) {
  const c = collideRectHelper(ball, rect);
  if (c.left && c.right && c.top && c.bottom) {
    const prev = {
      ...ball,
      centerX: ball.centerX - ball.speedX,
      centerY: ball.centerY - ball.speedY,
    };
    const p = collideRectHelper(prev, rect);
    if (!p.left) return 'left';
    else if (!p.right) return 'right';
    else if (!p.top) return 'top';
    else if (!p.bottom) return 'bottom';
    else return 'none';
  } else return 'none';
}

function containRect(rect, x, y) {
  return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.width;
}

function collideBlock(ball, block) {
  return collideRect(ball, block);
}

function toRect(disc) {
  return {
    x: disc.centerX - disc.width / 2,
    y: disc.centerY - disc.height / 2,
    width: disc.width,
    height: disc.height,
  };
}

function collideDisc(ball, disc) {
  return collideRect(ball, toRect(disc));
}

function collideWall(env) {
  const ball = env.state.ball;
  const leftX = ball.centerX - ball.radius;
  const rightX = ball.centerX + ball.radius;
  const topY = ball.centerY - ball.radius;
  const bottomY = ball.centerY + ball.radius;
  
  const collideLeft = leftX < env.stage.x;
  const collideRight = rightX > env.stage.x + env.stage.width;
  const collideTop = topY < env.stage.y;
  const collideBottom = bottomY > env.stage.y + env.stage.height;
  
  if (collideLeft) return 'left';
  else if (collideRight) return 'right';
  else if (collideTop) return 'top';
  else if (collideBottom) return 'bottom';
  else return 'none';
}

function nextFrame(env) {
  env.state.ball.centerX += env.state.ball.speedX;
  env.state.ball.centerY += env.state.ball.speedY;
}

function updateSpeed(env, speedX, speedY) {
  env.state.ball.speedX = speedX;
  env.state.ball.speedY = speedY;
}

function reflectBall(env, reflectX, reflectY) {
  if (reflectX) env.state.ball.speedX = -env.state.ball.speedX;
  if (reflectY) env.state.ball.speedY = -env.state.ball.speedY;
}

function onCollideWall(env) {
  const ball = env.state.ball;
  switch (collideWall(env)) {
  case 'left':
    ball.centerX = env.stage.x + ball.radius + 1;
    reflectBall(env, true, false);
    break;
  case 'right':
    ball.centerX = env.stage.x + env.stage.width - ball.radius - 1;
    reflectBall(env, true, false);
    break;
  case 'top':
    ball.centerY = env.stage.y + ball.radius + 1;
    reflectBall(env, false, true);
    break;
  case 'bottom':
    env.state.isLost = true;
    ball.centerY = env.stage.y + env.stage.height - ball.radius - 1;
    updateSpeed(env, 0, 0);
    break;
  default:
    break;
  }
}

function onLoose(env) {
  if (env.state.isLost) {
    clearInterval(env.frame.intervalId);
    const {stage, ctx} = env;

    ctx.fillStyle = env.stage.looseColor;
    ctx.fillRect(stage.x, stage.y, stage.width, stage.height);
    
    const text = newText(
      env,
      `You Loose`, 
      env.stage.width / 2,
      env.stage.height / 2,
      {
	fontSize: 48,
      }
    );
    
    drawText(env, text);

    drawButton(env, env.state.buttons.tryAgain);
  }
}

function onCollideRect(env, rect) {
  const ball = env.state.ball;
  switch (collideRect(ball, rect)) {
  case 'left':
    ball.centerX = rect.x - ball.radius - 1;
    reflectBall(env, true, false);
    return true;
  case 'right':
    ball.centerX = rect.x + rect.width + ball.radius + 1;
    reflectBall(env, true, false);
    return true;
  case 'top':
    ball.centerY = rect.y - ball.radius - 1;
    reflectBall(env, false, true);
    return true;
  case 'bottom':
    ball.centerY = rect.y + rect.height + ball.radius + 1;
    reflectBall(env, false, true);
    return true;
  default:
    return false;
  }
}

function onCollideBlocks(env) {
  env.state.blocks = env.state.blocks.filter(block => {
    return !onCollideRect(env, block);
  });
}

function onWin(env) {
  if (env.state.blocks.length === 0) {
    const ctx = env.ctx;
    clearInterval(env.frame.intervalId);
    
    ctx.fillStyle = env.stage.winColor;
    ctx.fillRect(env.stage.x, env.stage.y, env.stage.width, env.stage.height);

    const text = newText(
      env,
      `You Win`, 
      env.stage.width / 2,
      env.stage.height / 2,
      {
	fontSize: 48,
      }
    );

    drawText(env, text);
    
    drawButton(env, env.state.buttons.tryAgain);
  }
}

function onCollideDisc(env) {
  onCollideRect(env, toRect(env.state.disc));
}

function moveDisc(env) {
  const disc = env.state.disc;
  const speed = env.disc.speed;
  switch (disc.move) {
  case 'left':
    disc.centerX -= speed;
    if (disc.centerX - disc.width / 2 < env.stage.x) disc.centerX = disc.width / 2 + env.stage.x;
    break;
  case 'right':
    disc.centerX += speed;
    if (disc.centerX + disc.width / 2 > env.stage.x + env.stage.width) disc.centerX = env.stage.x + env.stage.width - disc.width / 2;
    break;
  default:
    break;
  }
}

function start(env) {
  initState(env);
  env.frame.intervalId = window.setInterval(() => {

    drawFrame(env);
    nextFrame(env);

    onCollideWall(env);
    onCollideBlocks(env);
    onCollideDisc(env);
    moveDisc(env);
    onLoose(env);
    onWin(env);
    
  }, env.frame.interval);
}

window.onload = () => {
  
  document.body.appendChild(newContainer());
  
}
