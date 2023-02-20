import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDo1xAtUPq12Mfxc9KJyAafGLbH_o-Wyfk",
    authDomain: "cse437-wuhub.firebaseapp.com",
    projectId: "cse437-wuhub",
    storageBucket: "cse437-wuhub.appspot.com",
    messagingSenderId: "404778634504",
    appId: "1:404778634504:web:3d87268e15b68c3a4e30bd",
    measurementId: "G-ZPCL9Q4QED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

const firestore = getFirestore(app);

// Export function to iniitialize firebase
export const init_firebase_storage = () => {
    return firestore;
  }