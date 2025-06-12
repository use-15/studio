
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// IMPORTANT: REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your actual auth domain
  projectId: "YOUR_PROJECT_ID", // Replace with your actual project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your actual storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual messaging sender ID
  appId: "YOUR_APP_ID", // Replace with your actual app ID
  measurementId: "YOUR_MEASUREMENT_ID" // Optional: Replace with your actual measurement ID
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
