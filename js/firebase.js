import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAS_9sxWGQ9alEBHJBCts3EjdJD-DNSzu4",
  authDomain: "smartcook-8bd4c.firebaseapp.com",
  projectId: "smartcook-8bd4c",
  storageBucket: "smartcook-8bd4c.firebasestorage.app",
  messagingSenderId: "1075085787983",
  appId: "1:1075085787983:web:a00470c14d5cf4fbcffb3a",
  measurementId: "G-22TV9V0E8T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
