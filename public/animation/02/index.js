
window.onload = () => {
  const object = document.getElementById('object');
  const button = document.getElementById('button');

  button.addEventListener('click', () => {
    object.style.transform = 'rotate(360deg)';
  });

  object.addEventListener('transitionend', () => {
    object.style.transform = 'rotate(0deg)';
  });
};
