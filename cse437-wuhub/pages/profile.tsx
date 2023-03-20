import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { init_firebase } from "@/firebase/firebase-config";

import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import profile from "../resources/profile.webp";
import { GetStaticProps, NextPage } from "next";

import styles from "../styles/ProfilePage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { init_firebase_storage } from "../firebase/firebase-config";

import Button from "react-bootstrap/Button";
import {
  getFirestore,
  collection,
  Firestore,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string
}

interface Props {
  posts: User[];
}

const firestore = init_firebase_storage();

export const getStaticProps: GetStaticProps<Props> = async () => {
  const postsCollection = await collection(firestore, "users");
  const postsQuerySnapshot = await getDocs(postsCollection);

  const postData: User[] = [];
  postsQuerySnapshot.forEach((doc) => {
    const data = doc.data();

    postData.push({
      uid: data.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    } as User);
  });

  return {
    props: { posts: postData },
  };
};

// define the Student Dashboard functional component
const ProfilePage = ({ posts }: Props): JSX.Element => {
  // Initialize Firebase
  const firebase = init_firebase(); // initialize the Firebase app
  const auth = getAuth(); // get the authentication object

  //let currentUser = auth.currentUser;
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  // Session Management
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //currentUser = auth.currentUser;
      setCurrentUser(auth.currentUser);
    } 
  });

  console.log(currentUser);

  const router = useRouter();

  const backClick = () => {
    console.log("profile click");
    router.push("/StudentDashboard");
  };

  const updateClick = () => {
    console.log("update click");
    router.push("/UpdateProfilePage");
  };

  if (currentUser == null) {
    console.log("Loading...")
    return <div>Loading...</div>;
  }

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
          <Image
            src={profile}
            width={240}
            height={240}
            alt="profile"
            className={styles.profile}
          ></Image>
          <div>
            <p> Name: {posts.filter((post) => post.uid === currentUser?.uid).map((post) => {
              return (
                post.firstName + " " + post.lastName
              );
            })} </p>
            <p> Email: {currentUser?.email} </p>
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
  )};

export default ProfilePage;
