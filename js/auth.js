import app from './firebase.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import Alert from './alert.js';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();


function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}


function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}


function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}


const btnSignUp = document.getElementById('btn-signup');
if (btnSignUp) {
  btnSignUp.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    signUp(email, password)
      .then(userCredential => {
        console.log('User registered:', userCredential.user);
        window.location.href = 'dashboard.html';
      })
      .catch(error => alert(error.message));
  });
}

const btnSignIn = document.getElementById('btn-signin');
if (btnSignIn) {
  btnSignIn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    signIn(email, password)
      .then(userCredential => {
        Alert("User logged in successfully.", "success");
        console.log('User logged in:', userCredential.user);
        window.location.href = 'dashboard.html';
      })
      .catch(error => Alert(error.message, "error"));
  });
}

const btnGoogle = document.getElementById('google-button');
if (btnGoogle) {
  btnGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    signInWithGoogle()
      .then(result => {
        Alert("User logged in successfully.", "success");
        console.log('Google user logged in:', result.user);
        window.location.href = 'dashboard.html';
      })
      .catch(error => Alert(error.message, "error"));
  });
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in:', user);
    
  } else {
    console.log('No user logged in');
  }
});
