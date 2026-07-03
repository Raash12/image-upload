import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <--- Ku dar halkan

const firebaseConfig = {
  apiKey: "AIzaSyCDUylaJ-HFN08lf2iqwr25DSEQXFt8Z_w",
  authDomain: "image-upload-e0408.firebaseapp.com",
  projectId: "image-upload-e0408",
  storageBucket: "image-upload-e0408.firebasestorage.app",
  messagingSenderId: "527982675402",
  appId: "1:527982675402:web:6fde5230b34c1e25b17b33",
  measurementId: "G-81MCM3PGT7"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const storage = getStorage(app); // <--- Hubi inaad katan dhoofiso (export)