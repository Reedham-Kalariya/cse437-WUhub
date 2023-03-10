import { initializeApp } from "firebase/app";

// import the Firebase app initialization function
import { init_firebase } from "@/firebase/firebase-config";
import { init_firebase_storage } from "@/firebase/firebase-config";
import { useRouter } from "next/router";
import React from "react";
import * as ReactDOM from "react-dom";

// import the Firebase authentication SDK functions
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
  setPersistence,
  onAuthStateChanged,
  browserSessionPersistence
} from "firebase/auth";

// import the Firebase Firebase Storage SDK functions
import { ref, getDownloadURL } from "firebase/storage";

// Firestore
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

import styles from "../styles/LoginPage.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

import Image from "next/image";
import brookings_seal from "../resources/brookings-seal.png";
import wuhub_logo from "../resources/wuhub_logo.png";

// define the LoginPage functional component
export default function LoginPage() {
  // initialize Firebase using the init_firebase function
  const firebase = init_firebase();

  //initialize Firebase storage
  const storage = init_firebase_storage();

  // get an instance of the Auth object from the Firebase authentication SDK
  const auth = getAuth();

  const router = useRouter();

  // define the login function that gets called when the user clicks the "Login" button
  function login() {
    console.log("login initiatied");
    // get the user's email and password from the input fields
    let email = (document.getElementById("login-email")! as HTMLInputElement)
      .value;
    let password = (
      document.getElementById("login-password")! as HTMLInputElement
    ).value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Making sure user email is verified
        if (auth.currentUser?.emailVerified == false) {
          notVerifiedDialog(userCredential);
          auth.signOut();
        } else {
          // firebase.post('./sessionLogin', (req, res) => {

          // })
          router.push("/StudentDashboard");
        }
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
            alert("Invalid email!");
            break;
          case "auth/user-not-found":
            alert("Account does not exist. Please register");
            break;
          case "auth/wrong-password":
            alert("Wrong Password!");
            break;
        }
        console.log(err.code);
        console.log(err.message);
      });
  }

  const backClick = () => {
    console.log("profile click");
    router.push("/");
  };

  function notVerifiedDialog(userCredential: UserCredential) {
    const dialogBox = document.getElementById("dialogBox");
    ReactDOM.render(
      <>
        <Alert variant="danger">
          <p>
            The email address associated with your account has not been verified
            yet. Verifying your email is an important step in ensuring the
            security of your account and protecting your personal information.
          </p>
          <p>
            When you receive the verification email, please follow the
            instructions in the email to verify your account. If you have not
            received the email, click the button below to resend a verification
            link.
          </p>
          <p>Once you're done, please log in.</p>
        </Alert>
        <Button variant="secondary" onClick={() => verifyEmail(userCredential)}>
          Resend Verification Link
        </Button>
      </>,
      dialogBox
    );
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
          <p>Once you're done, please log in.</p>
        </Alert>
      </>,
      dialogBox
    );
  }

  return (
    <>
      <div className="header">
        <div className="headerLeft">
          <Image src={wuhub_logo} alt="wuhub_logo" className="wuhubLogo" />
        </div>
        <div className="headerRight">
          <div id="profile-button">Login for the full WU|Hub Experience!</div>
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={backClick}
        className={styles.backToLandingBtn}
      >
        <strong>&lt;</strong> Back to Home
      </Button>
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
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                id="login-email"
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
                id="login-password"
              />
            </Form.Group>
            <Button variant="success" onClick={() => login()}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
