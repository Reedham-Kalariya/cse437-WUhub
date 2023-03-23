import { initializeApp } from "firebase/app";
import { GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";

import Image from "next/image";
import brookings_seal from "../resources/brookings-seal.png";
import wuhub_logo from "../resources/wuhub_logo.png";

import styles from "../styles/RegisterPage.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import { init_firebase_storage } from "../firebase/firebase-config";
import { useRouter } from "next/router";
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
import { Header } from "@/components/header";

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  posts: User[];
}

// define the RegisterPage functional component
export default function RegisterPage() {
  const firebase = init_firebase(); // initialize the Firebase app
  const firestore = init_firebase_storage();
  const auth = getAuth(); // get the authentication object

  // Session Management
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const router = useRouter();

  async function addUser(
    uid: string,
    firstName: string,
    lastName: string,
    email: string | null
  ) {
    const eventCollection = collection(firestore, "users");
    await addDoc(eventCollection, {
      uid: uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });
  }

  async function register() {
    console.log("register initiaited"); // log that registration is being initiated
    let firstName = (
      document.getElementById("register-firstName")! as HTMLInputElement
    ).value;
    let lastName = (
      document.getElementById("register-lastName")! as HTMLInputElement
    ).value;
    let email = (document.getElementById("register-email")! as HTMLInputElement)
      .value; // get the email entered by the user
    let password = (
      document.getElementById("register-password")! as HTMLInputElement
    ).value; // get the password entered by the user

    // Create User with Email and Password
    createUserWithEmailAndPassword(auth, email, password) // create a user with email and password using the Firebase authentication object
      .then((userCredential) => {
        verifyEmail(userCredential).then(() => {
          addUser(
            userCredential.user.uid,
            firstName,
            lastName,
            userCredential.user.email
          );
        });
      })
      .catch((err) => {
        // Handle Errors here.
        console.log(err.code); // log the error code
        console.log(err.message); // log the error message

        switch (err.code) {
          case "auth/invalid-email":
            alert("Invalid email!"); // alert the user that the email is invalid
            break;
          case "auth/email-already-in-use":
            alert("Email already in use!"); // alert the user that the email is already in use
            break;
        }
      });
  }

  async function verifyEmail(userCredential: UserCredential) {
    // verifying email
    await sendEmailVerification(userCredential.user).then(() => {
      console.log("email sent");
      showVerifyEmailDialog();
      auth.signOut();
    });
  }

  function showVerifyEmailDialog() {
    const dialogBox = document.getElementById("dialogBox");
    ReactDOM.render(
      <>
        <Alert variant="success">
          <p>
            We have sent a verification link to your email address associated
            with your account.
          </p>
          <p>
            To complete the verification process and ensure the security of your
            account, please check your email inbox and follow the instructions
            in the email to verify your account.
          </p>
          <p>
            If you have not received the email within a few minutes, please
            check your spam or junk folder as it may have been filtered there.
          </p>
          <p>Once you're done, please <a href="./login"> log in. </a></p>
        </Alert>
        <Button variant="secondary" onClick={loginClick}></Button>
      </>,
      dialogBox
    );
  }

  const loginClick = () => {
    console.log("profile click");
    router.push("/login");
  };

  // render the register form
  return (
    <>
      <Header user={user} />

      <div className={styles.mainContent}>
        <Image
          src={brookings_seal}
          alt="brookings_seal"
          className={styles.laptopMockupImage}
          width={250}
          height={250}
        />
        <div className={styles.dialogBox} id="dialogBox">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="string"
                placeholder="First Name"
                id="register-firstName"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="string"
                placeholder="Last Name"
                id="register-lastName"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                id="register-email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                id="register-password"
              />
            </Form.Group>
            <Button variant="success" onClick={() => register()}>
              Submit
            </Button>
            <br></br>
            <p> Already have an account? <a href="./login"> Log in </a></p>
          </Form>
          <br></br>

          <Alert variant="danger" className={styles.passwordAlert}>
            {" "}
            Password Requirements
            <ul>
              <li> At least 6 characters long </li>
            </ul>
          </Alert>
        </div>
      </div>
    </>
  );
}
