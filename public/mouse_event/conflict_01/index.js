'use strict';

function distance(rect1, rect2) {
  const dx = rect1.x - rect2.x;
  const dy = rect1.y - rect2.y;
  return Math.sqrt(dx*dx + dy*dy);
}

window.onload = () => {
  const state = {
    isMouseDown: false,
    x: null,
    y: null,
    tx: 0,
    ty: 0,
  };

  const body = document.body;
  const object1 = document.getElementById('object1');
  const object2 = document.getElementById('object2');

  object1.addEventListener('mousedown', (e) => {
    state.isMouseDown = true;
    state.x = e.clientX;
    state.y = e.clientY;
  });

  body.addEventListener('mousemove', (e) => {
    if (state.isMouseDown) {
      const dx = e.clientX - state.x;
      const dy = e.clientY - state.y;
      object1.style.transform = `translate(${state.tx + dx}px, ${state.ty + dy}px)`;

      const rect1 = object1.getBoundingClientRect();
      const rect2 = object2.getBoundingClientRect();
      if (distance(rect1, rect2) < rect1.width) {
	object2.style.backgroundColor = 'red';
      } else {
	object2.style.backgroundColor = 'green';
      }
    }
  });

  object1.addEventListener('mouseup', (e) => {
    state.isMouseDown = false;
    const dx = e.clientX - state.x;
    const dy = e.clientY - state.y;
    state.tx += dx;
    state.ty += dy;
  });

  
};
