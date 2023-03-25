'use strict';


window.onload = () => {
  const state = {
    isMouseDown: false,
    x: null,
    y: null,
    tx: 0,
    ty: 0,
  };

  const body = document.body;
  const object = document.getElementById('object');

  object.addEventListener('mousedown', (e) => {
    state.isMouseDown = true;
    state.x = e.clientX;
    state.y = e.clientY;
  });

  body.addEventListener('mousemove', (e) => {
    if (state.isMouseDown) {
      const dx = e.clientX - state.x;
      const dy = e.clientY - state.y;
      object.style.transform = `translate(${state.tx + dx}px, ${state.ty + dy}px)`;
    }
  });

  object.addEventListener('mouseup', (e) => {
    state.isMouseDown = false;
    const dx = e.clientX - state.x;
    const dy = e.clientY - state.y;
    state.tx += dx;
    state.ty += dy;
  });
};
