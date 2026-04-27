// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRWA4E0an7yw-szGvlL4b1N3haue_gm40",
  authDomain: "ps-construction-inc.firebaseapp.com",
  projectId: "ps-construction-inc",
  storageBucket: "ps-construction-inc.firebasestorage.app",
  messagingSenderId: "327244073039",
  appId: "1:327244073039:web:b433592223c1441366823a",
  measurementId: "G-J8LYJ62L5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
