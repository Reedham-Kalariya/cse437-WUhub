// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const app = initializeApp(firebaseConfig);

// Export function to iniitialize firebase
export const init_firebase = () => {
  return app;
}
