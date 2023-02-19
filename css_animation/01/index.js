
window.onload = () => {
  const object = document.getElementById('object');
  const button = document.getElementById('button');

  button.addEventListener('click', () => {
    object.style.transform = `translateX(${window.innerWidth - 100}px)`;
  });

  object.addEventListener('transitionend', () => {
    object.style.transform = 'translateX(0px)';
  });
};
