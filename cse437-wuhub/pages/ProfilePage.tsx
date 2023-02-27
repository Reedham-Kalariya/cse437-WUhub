import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { init_firebase } from "@/firebase/firebase-config";

import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import profile from "../resources/profile.webp";

import styles from "../styles/ProfilePage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Button from "react-bootstrap/Button";

// define the Student Dashboard functional component
export default function ProfilePage() {
  // Initialize Firebase
  const firebase = init_firebase(); // initialize the Firebase app
  const auth = getAuth(); // get the authentication object

  let currentUser = auth.currentUser;

  const router = useRouter();

  const backClick = () => {
    console.log("profile click");
    router.push("/StudentDashboard");
  };

  const updateClick = () => {
    console.log("update click");
    router.push("/UpdateProfilePage");
  };

  // render the Student Dashboard page
  return (
    <>
      <div className="header">
        <div className="headerLeft">
          <Image src={wuhub_logo} alt="wuhub_logo" className="wuhubLogo" />
        </div>
        <div className="headerRight">
          <div id="profile-button"> {currentUser?.email} </div>
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={backClick}
        className={styles.backToDashBtn}
      >
        <strong>&lt;</strong> Back to Dashboard
      </Button>

      <div className={styles.mainContent}>
        <div className={styles.mainContentCenter}>
          <Image src={profile} width={240} height={240} alt="profile" className={styles.profile}></Image>
          <div>
            <p> Email: {currentUser?.email} </p>
            <p> Display Name: {currentUser?.displayName} </p>
            <p> Phone Number: {currentUser?.phoneNumber} </p>
            <p> Unique UID: {currentUser?.uid} </p>
            <br></br>
            <Button onClick={updateClick} className="btn">
              {" "}
              Update Profile{" "}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
