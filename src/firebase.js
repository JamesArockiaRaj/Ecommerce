import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9ctJjn0CCoge5Kv6pUxqlTH_GD2TuPbg",
  authDomain: "velankanni-ecommerce-6a41d.firebaseapp.com",
  projectId: "velankanni-ecommerce-6a41d",
  storageBucket: "velankanni-ecommerce-6a41d.appspot.com",
  messagingSenderId: "918842434878",
  appId: "1:918842434878:web:308d6cb152477a3df0f86f",
  measurementId: "G-HFR7QNK8QT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default app;