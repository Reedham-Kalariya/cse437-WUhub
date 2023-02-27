import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";

import { init_firebase } from "@/firebase/firebase-config";

import styles from "../styles/Home.module.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import Image from "next/image";
import laptop_mockup from "../resources/laptop-mockup.png";
import wuhub_logo from "../resources/wuhub_logo.png";

export default function Home() {
  // initialize Firebase using the init_firebase function
  const firebase = init_firebase();

  // get an instance of the Auth object from the Firebase authentication SDK
  const auth = getAuth();

  const router = useRouter();

  const loginClick = () => {
    router.push("/LoginPage");
  };

  const registerClick = () => {
    router.push("/RegisterPage");
  };

  const updateProfile = () => {
    router.push("/UpdateProfilePage");
  };

  return (
    <>
      <div className="header">
        <div className="headerLeft">
          <Image src={wuhub_logo} alt="wuhub_logo" className="wuhubLogo" />
        </div>
        <div className="headerRight">
          <div id="profile-button">
            <strong>Login for the full WU|Hub Experience!</strong>
          </div>
        </div>
      </div>

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
