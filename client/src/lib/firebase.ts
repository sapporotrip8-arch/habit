import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAn-_tpwI4z8Pr_ZldjHKRDq1TXoW3Z8Cg",
  authDomain: "goal-5087a.firebaseapp.com",
  projectId: "goal-5087a",
  storageBucket: "goal-5087a.firebasestorage.app",
  messagingSenderId: "425204606709",
  appId: "1:425204606709:web:8caff581ac2e390d6d07bc",
  measurementId: "G-VTQJFT4T43"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
