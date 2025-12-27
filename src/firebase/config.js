// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbW1VxjJOBDV_OndTMxCf3lJVb9IP-v3I",
  authDomain: "plow-me-dcef0.firebaseapp.com",
  projectId: "plow-me-dcef0",
  storageBucket: "plow-me-dcef0.firebasestorage.app",
  messagingSenderId: "337744818442",
  appId: "1:337744818442:web:add3f1ca36a57d32ca4af3",
  measurementId: "G-9470WP1PQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);