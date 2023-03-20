import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/router"
import styles from "../styles/ResourcesPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { init_firebase } from '@/firebase/firebase-config';
import Button from "react-bootstrap/Button";
import ListGroup from 'react-bootstrap/ListGroup';
import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import { useState } from 'react';
// define the Student Dashboard functional component
export default function ResourcesPage() {

    // Initialize Firebase
    const firebase = init_firebase(); // initialize the Firebase app
    const auth = getAuth(); // get the authentication object

    const router = useRouter();

  //let currentUser = auth.currentUser;
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  // Session Management
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //currentUser = auth.currentUser;
      setCurrentUser(auth.currentUser);
    } 
  });

    const backClick = () => {
        router.push('/dashboard');
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
            <ListGroup className={styles.list_group}>
                <ListGroup.Item><a href='https://students.wustl.edu/campus-life/'>Campus Life</a></ListGroup.Item>
                <ListGroup.Item><a href='https://students.wustl.edu/student-group-handbook/'>Undergraduate Student Group Handbook</a></ListGroup.Item>
                <ListGroup.Item><a href='https://prograds.wustl.edu/university-wide-graduate-student-group-handbook/'>Graduate Student Group Handbook</a></ListGroup.Item>
                {/* <ListGroup.Item><a href='https://su.wustl.edu/'>Student Union</a></ListGroup.Item> this link does not work; it is broken on wugo too*/}
                <ListGroup.Item><a href='https://gradcenter.wustl.edu/'>Graduate Center</a></ListGroup.Item>
                <ListGroup.Item><a href='https://trello.com/b/hLXvhUCI/su-finance-bearings-2022-2023'>SUFinance BEARings</a></ListGroup.Item>
                <ListGroup.Item><a href='https://trello.com/b/5dbExaXs/student-group-starting-point'>Student Group Starting Point</a></ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </>
    );
}