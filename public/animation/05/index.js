'use strict';

window.onload = () => {
  const state = {
    dragIndex: null,
    interval: null,
    objects: [],
  };

  

  const body = document.body;
  const time = document.getElementById('time');
  const container = document.getElementById('container');

  const nballs = Math.floor(window.innerWidth * 20/1000)
  //const nballs = 21;
  
  time.innerText = `0ms`;
  
  for (let i=0; i<nballs; i++) {
    const self = document.createElement('div');
    const object = {
      self,
      y: null,
      ty: 0,
      cy: 0,
    };
    
    state.objects[i] = object;
    
    self.setAttribute('class', 'object');
    const radius = window.innerWidth / nballs * 0.9;
    
    self.style.width = `${radius}px`;
    self.style.height = `${radius}px`;
    self.style.borderRadius = `${radius/2}px`;
    container.appendChild(self);

    function start(e) {
      clearInterval(state.interval);
      for (let i=0; i<nballs; i++) {
	const object = state.objects[i];
	object.ty = 0;
      }
      
      state.dragIndex = i;
      object.y = e.clientY;
    }
    
    self.addEventListener('mousedown', start);
    self.addEventListener('touchstart', e => start(e.touches[0]));
        
  }

  function onMove(e) {
    const dragIndex = state.dragIndex;
    if (dragIndex !== null) {
      const object = state.objects[dragIndex];
      const self = object.self;
      const dy = e.clientY - object.y;
      const ty = object.ty + dy;
      self.style.transform = `translateY(${ty}px)`;
      object.cy = ty;

      for (let i=0; i<nballs; i++) {
	const object = state.objects[i];
	const self = object.self;
	if (i < dragIndex) {
	  const x1 = Math.abs(i - dragIndex);
	  //const x2 = Math.abs(0 - dragIndex);
	  //const r = 1 - x1/x2;
	  //const sy = ty * r * r;
	  const sy = ty / Math.pow(1.2, x1);
	  self.style.transform = `translateY(${sy}px)`;
	  object.cy = sy;
	} else if (i > dragIndex) {
	  const x1 = Math.abs(i - dragIndex);
	  //const x2 = Math.abs(nballs - dragIndex - 1);
	  //const r = 1 - x1/x2;
	  //const sy = ty * r * r;
	  const sy = ty / Math.pow(1.2, x1);
	  self.style.transform = `translateY(${sy}px)`;
	  object.cy = sy;
	}
      }
    }
  }

  function onEnd(e) {
    if (state.dragIndex !== null) {
      const framerate = 10;
      const period = 1000;
      const delay = 100;
      const decay = 0.2;
      const vang = 360 * 1000 / period;
      const idx = state.dragIndex;
      let t = 0;
      state.dragIndex = null;
      
      state.interval = setInterval(() => {
	time.innerText = `${t}ms`;
	let max = null;
	
	for (let i=0; i<nballs; i++) {
	  const object = state.objects[i];
	  const self = object.self;
	  const delay_ = Math.abs(i - idx) * delay;
	  const t_ = t - delay_;
	  
	  if (t_ > 0) {
	    const eff_ = 1 - decay * t_ / 1000;
	    const eff = eff_ < 0 ? 0 : eff_;
	    if (max === null || eff > max) max = eff;
	    const radius_ = object.cy * eff;
	    const radius = radius_ === 0 ? 0 : radius_;
	    const angle = 90 + vang * t_ / 1000;
	    const ty = radius * Math.sin(Math.PI * angle/180);
	    self.style.transform = `translateY(${ty}px)`;
	  }
	}
	
	if (max === 0) {
	  clearInterval(state.interval);
	  for (let i=0; i<nballs; i++) {
	    const object = state.objects[i];
	    object.ty = 0;
	  }
	}
	
	t += framerate;
      }, framerate);
    }
  }
  
  body.addEventListener('mousemove', onMove);
  body.addEventListener('touchmove', (e) => onMove(e.touches[0]));

  body.addEventListener('mouseup', onEnd);
  body.addEventListener('touchend', onEnd);

  
};
