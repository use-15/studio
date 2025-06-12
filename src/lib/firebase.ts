// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // REPLACE ME
  authDomain: "YOUR_AUTH_DOMAIN", // REPLACE ME
  projectId: "YOUR_PROJECT_ID", // REPLACE ME
  storageBucket: "YOUR_STORAGE_BUCKET", // REPLACE ME
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // REPLACE ME
  appId: "YOUR_APP_ID", // REPLACE ME
  measurementId: "YOUR_MEASUREMENT_ID" // REPLACE ME (Optional)
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

// Initialize Analytics only if supported (to prevent errors in environments where it's not)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
