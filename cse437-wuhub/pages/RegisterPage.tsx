import { initializeApp } from "firebase/app";
import React from "react";
import * as ReactDOM from "react-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
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
import { useRouter } from "next/router";

// define the RegisterPage functional component
export default function RegisterPage() {
  // Initialize Firebase
  const firebase = init_firebase(); // initialize the Firebase app
  const auth = getAuth(); // get the authentication object

  const router = useRouter();

  async function register() {
    console.log("register initiaited"); // log that registration is being initiated
    let email = (document.getElementById("register-email")! as HTMLInputElement)
      .value; // get the email entered by the user
    let password = (
      document.getElementById("register-password")! as HTMLInputElement
    ).value; // get the password entered by the user

    // Create User with Email and Password
    createUserWithEmailAndPassword(auth, email, password) // create a user with email and password using the Firebase authentication object
      .then((userCredential) => {
        verifyEmail(userCredential).then(() => {
          // router.push("./UpdateProfilePage");
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
          <p>Once you're done, please log in.</p>
        </Alert>
      </>,
      dialogBox
    );
  }

  const backClick = () => {
    console.log("profile click");
    router.push("/");
  };

  // render the register form
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
