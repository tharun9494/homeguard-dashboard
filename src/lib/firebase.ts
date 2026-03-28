import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDf7NhQcWRA9NPdg3UCtiWUNxEdxqVv3rQ",
  authDomain: "iothomesecurity-620a9.firebaseapp.com",
  databaseURL: "https://iothomesecurity-620a9-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iothomesecurity-620a9",
  storageBucket: "iothomesecurity-620a9.firebasestorage.app",
  messagingSenderId: "243417989770",
  appId: "1:243417989770:web:ea244fa75af955ed64e373",
  measurementId: "G-502QF3K4PT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
