"use strict";

function createScreen([value, backgroundColor, idx]) {
  const body = document.createElement('div');
  body.setAttribute('class', 'screen-body');
  body.style.backgroundColor = backgroundColor;
  body.style.transform = `rotate(${idx * (-90)}deg)`;
  
  const text = document.createElement('div');
  text.setAttribute('class', 'text');
  text.innerText = value;

  body.appendChild(text);
  
  return body;
}

window.onload = () => {
  const state = {
    count: 0,
  };

  const cont = document.getElementById('container');
  
  const xs = [
    ['JavaScript', 'blueviolet'],
    ['TypeScript', 'tomato'],
    ['PureScript', 'gold'],
    ['Scala', 'dodgerblue'],
  ].map((args, idx) => {
    const s = createScreen([...args, idx]);
    cont.appendChild(s);
    return s;
  })

  const button = document.getElementById('start-button');
  button.addEventListener('click', () => {
    xs.forEach((x, i) => {
      const ang = state.count * (-90) + ((i + 1) * (-90));
      x.style.transform = `rotate(${ang}deg)`;
      x.style.transition = `transform 300ms ease 0ms`;
    });
    state.count += 1;
  });
};
