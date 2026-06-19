import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// তোমার ফায়ারবেস কনফিগারেশন (স্ক্রিনশট থেকে নেওয়া)
const firebaseConfig = {
  apiKey: "AIzaSyDgDn61M-tXca3_e6ta_U-HOn5-7mwx64U",
  authDomain: "modulus-math-hub.firebaseapp.com",
  projectId: "modulus-math-hub",
  storageBucket: "modulus-math-hub.firebasestorage.app",
  messagingSenderId: "573026793679",
  appId: "1:573026793679:web:f523b5b702ad118bea9fba",
  measurementId: "G-NMCB2W7CKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore Instance
export const db = getFirestore(app);