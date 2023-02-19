
window.onload = () => {
  const object = document.getElementById('object');
  const button = document.getElementById('button');

  button.addEventListener('click', () => {
    object.style.animation = 'spin 1s linear 0s infinite';
  });
};
