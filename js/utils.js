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

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth();

const userPhotoImg = document.getElementById("userPhoto"); // img o div donde mostrar la foto/icono

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario logeado
    if (user.photoURL) {
      // Tiene foto de perfil (Google o proveedor que envía foto)
      userPhotoImg.src = user.photoURL;
      userPhotoImg.alt = user.displayName || "User profile photo";
      userPhotoImg.style.borderRadius = "50%"; // opcional, para que sea circular
    } else {
      // No tiene foto (login por email/contraseña)
      userPhotoImg.src = "ruta/a/tu/icono-usuario.svg"; // ícono genérico
      userPhotoImg.alt = "User icon";
    }
  } else {
    // No logueado → mostrar algo por defecto o ocultar
    userPhotoImg.src = "ruta/a/tu/icono-default.svg";
    userPhotoImg.alt = "Default icon";
  }
});