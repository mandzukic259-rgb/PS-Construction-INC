// Firebase Configuration
// Replace these values with your actual Firebase credentials from Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyD_abc123def456ghi789",
  authDomain: "construction-firm-website.firebaseapp.com",
  projectId: "construction-firm-website",
  storageBucket: "construction-firm-website.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:xyz789abc456def123"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { db, auth, firebase };
}
