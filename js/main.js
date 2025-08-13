import app from "./firebase.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const auth = getAuth(app);

const userPhotoImg = document.getElementById("userPhoto"); 

onAuthStateChanged(auth, (user) => {
  if (user) {
    
    if (user.photoURL) {
      
      userPhotoImg.src = user.photoURL;
      userPhotoImg.alt = user.displayName || "User profile photo";
      userPhotoImg.style.borderRadius = "50%"; 
    } else {
      
      userPhotoImg.src = "ruta/a/tu/icono-usuario.svg"; 
      userPhotoImg.alt = "User icon";
    }
  } else {
   
    userPhotoImg.src = "ruta/a/tu/icono-default.svg";
    userPhotoImg.alt = "Default icon";
  }
});