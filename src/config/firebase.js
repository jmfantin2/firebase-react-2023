import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbHziWfuSpeukMMayo53KZFlSL_XNIJQw",
  authDomain: "fir-react-2023.firebaseapp.com",
  projectId: "fir-react-2023",
  storageBucket: "fir-react-2023.appspot.com",
  messagingSenderId: "598866252399",
  appId: "1:598866252399:web:cd323da7858348087af39a",
  measurementId: "G-TX33SBGHL5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
