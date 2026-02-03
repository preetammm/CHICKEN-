import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAGwxUmKkTk3wFg1zG4XArZm8AdRzxAhhw",
    authDomain: "chicken-shop-2c7ab.firebaseapp.com",
    projectId: "chicken-shop-2c7ab",
    storageBucket: "chicken-shop-2c7ab.firebasestorage.app",
    messagingSenderId: "338151349056",
    appId: "1:338151349056:web:dae2028d9f9f2ee7f8f8a5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
