import app from './firebase.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Email/Password Sign Up
function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Email/Password Sign In
function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Google Sign In (for both sign up and sign in)
function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

// Attach event listeners only if buttons exist on the page
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
        console.log('User logged in:', userCredential.user);
        window.location.href = 'dashboard.html';
      })
      .catch(error => alert(error.message));
  });
}

const btnGoogle = document.getElementById('google-button');
if (btnGoogle) {
  btnGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    signInWithGoogle()
      .then(result => {
        console.log('Google user logged in:', result.user);
        window.location.href = 'dashboard.html';
      })
      .catch(error => alert(error.message));
  });
}

// Listen for auth state changes if you want to handle automatic redirects or UI changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in:', user);
    // Optional: redirect if user is already logged in
    // window.location.href = 'dashboard.html';
  } else {
    console.log('No user logged in');
  }
});
