import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, ReactElement } from "react";

import { init_firebase } from "@/firebase/firebase-config";

import styles from "../styles/Home.module.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "@/components/header";

import Image from "next/image";
import laptop_mockup from "../resources/laptop-mockup.png";
import wuhub_logo from "../resources/wuhub_logo.png";

const Home = (): JSX.Element => {

  // Session Management
  const firebase = init_firebase();
  const auth = getAuth();

  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(auth.currentUser);
      }
    });
    return () => {
      unsubscribe();
    }
  }, [auth]);

  const router = useRouter();

  const loginClick = () => {
    router.push("/login");
  };

  const registerClick = () => {
    router.push("/register");
  };

  const updateProfile = () => {
    router.push("/UpdateProfilePage");
  };

  const logoutClick = () => {
    auth.signOut();
  };

  return (
    <>
      <Header user={null} /> 

      <div className={styles.mainContent}>
        <div className={styles.mainContentLeft}>
          <h1> welcome to WU|Hub</h1>
          <h5>
            {" "}
            a user-driven daily homebase <br></br>for the WashU community{" "}
          </h5>
        </div>
        <div className={styles.mainContentRight}>
          <Image
            src={laptop_mockup}
            alt="laptop_mockup"
            className={styles.laptopMockupImage}
            width={420}
            height={420}
          />
          <div className={styles.buttons}>
            <Button variant="secondary" onClick={loginClick} className={styles.loginButton}>
              {" "}
              Login{" "}
            </Button>
            <Button onClick={logoutClick}>Logout</Button>
            <Button variant="secondary" onClick={registerClick}>
              {" "}
              Don't have an account? Join today!{" "}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;