// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";  // Import addDoc
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage"; 

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDdds_Oh563hP7QIkvH5NHwA43HfMqkykI",
  authDomain: "student-2b606.firebaseapp.com",
  projectId: "student-2b606",
  storageBucket: "student-2b606.appspot.com",
  messagingSenderId: "910110661018",
  appId: "1:910110661018:web:02b06320d3feac96e50223",
  measurementId: "G-W17960J3W6",
  databaseURL: "https://student-2b606-default-rtdb.firebaseio.com" // Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Realtime Database
const realtimedb = getDatabase(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export Firebase services
export { db, realtimedb, storage, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, };  // Now addDoc is exported
