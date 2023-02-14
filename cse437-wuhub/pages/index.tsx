import Link from "next/link"
import { useRouter } from "next/router"
import { getAuth } from 'firebase/auth';

import { init_firebase } from '@/firebase/firebase-config';

export default function Home() {

  // initialize Firebase using the init_firebase function
  const firebase = init_firebase();

  // get an instance of the Auth object from the Firebase authentication SDK
  const auth = getAuth();

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
