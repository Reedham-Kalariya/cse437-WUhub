import { ReactDOM } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export default function Home() {

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
  const firebase = initializeApp(firebaseConfig);
  const auth = getAuth(firebase);

  let currentUser = auth.currentUser;

  if (currentUser == null) {
    console.log("No one signed in right now");
    // window.addEventListener('DOMContentLoaded', () => { document.getElementById("profile-button")!.innerHTML = "Please sign in"; })

  } else {
    console.log("Current user email: " + currentUser!.email);
    console.log("Current user display name: " + currentUser!.displayName);
  }

  const router = useRouter();

  const loginClick = () => {
    console.log("login click");
    router.push('/LoginPage')
  }

  const registerClick = () => {
    console.log("register click");
    router.push('/RegisterPage')
  }

  const updateProfileClick = () => {
    console.log("update profile click");
    router.push('/UpdateProfilePage')
  }

  return (
    <>
      <div className="index-header">
        Welcome to WUhub
        <div id="profile-button">
        </div>
      </div>

      <div className="index-body">
        <button className="btn" onClick={loginClick}> Login </button>
        <br></br>
        <button className="btn" onClick={registerClick}> Register </button>
        <br></br>
        <button className="btn" onClick={updateProfileClick}> Update Profile </button>

      </div>

    </>
  )
}
