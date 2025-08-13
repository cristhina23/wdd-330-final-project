const passwordContainer = document.querySelector('#password-container');
const passwordInput = document.querySelector('#password');
const eyeIcon = document.querySelector('.eye-icon');

eyeIcon.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.name = 'eye';

  } else {
    passwordInput.type = 'password';
    eyeIcon.name = 'eye-off';
  }
});

