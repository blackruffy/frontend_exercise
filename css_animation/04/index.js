
window.onload = () => {
  const object = document.getElementById('object');
  const button = document.getElementById('button');

  button.addEventListener('click', () => {
    object.style.transform = 'rotate(1080deg) translateX(0vw)';
  });
  
  object.addEventListener('transitionend', () => {
    object.style.transform = 'rotate(0deg)  translateX(-30vw)';
  });
};
