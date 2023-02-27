import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import { useRouter } from "next/router";

import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import profile from "../resources/profile.webp";
import React from "react";

import styles from "../styles/UpdateProfilePage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

export default function UpdateProfilePage() {
  // Initialize Firebase
  const firebase = init_firebase();
  const auth = getAuth();
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

  function updateProfile() {
    console.log("update profile initiaited");
    let displayName = (
      document.getElementById("display-name")! as HTMLInputElement
    ).value;
    let profilePicURL = (
      document.getElementById("profile-pic-url")! as HTMLInputElement
    ).value;
    console.log(displayName);
    console.log(profilePicURL);
  }

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
          <Image
            src={profile}
            width={240}
            height={240}
            alt="profile"
            className={styles.profile}
          ></Image>
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
            <p> Display Name </p>
            <input type="text" id="display-name" className="text-box" value={currentUser.displayName}/>
            <br></br>
            <p> Profile Pic URL </p>
            <input type="text" id="profile-pic-url" className="text-box" />
            <br></br>
            <button onClick={() => updateProfile()} className="btn">
              {" "}
              Register{" "}
            </button>
            <br></br>
          </div>
        </div>
      </div>
      <div className="update-profile-dialog-box"></div>
    </>
  );
}
