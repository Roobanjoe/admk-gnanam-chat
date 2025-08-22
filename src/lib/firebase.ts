import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTiQfhW9xOBzgUKGLlNXjxlLQvZqsb0gE",
  authDomain: "aiadmk-platform.firebaseapp.com",
  projectId: "aiadmk-platform",
  storageBucket: "aiadmk-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;