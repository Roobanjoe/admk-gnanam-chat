import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCRDuevGrIHuTqSDl29vJW63stfaNudFSU",
  authDomain: "authphonechataiadmk.firebaseapp.com",
  projectId: "authphonechataiadmk",
  storageBucket: "authphonechataiadmk.firebasestorage.app",
  messagingSenderId: "1043683458978",
  appId: "1:1043683458978:web:5c5acc2af6be0f542d3cfb",
  measurementId: "G-1VJBNN4GC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;