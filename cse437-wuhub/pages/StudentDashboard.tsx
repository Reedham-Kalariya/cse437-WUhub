import { initializeApp } from "firebase/app";
import { GetStaticProps, NextPage } from "next";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { init_firebase } from "@/firebase/firebase-config";
import { init_firebase_storage } from "../firebase/firebase-config";
import {
  getFirestore,
  collection,
  limit,
  query,
  Firestore,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";
import styles from "../styles/dashboard.module.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
import "bootstrap/dist/css/bootstrap.min.css";

import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

// Expected database schema
interface Organization {
  id: string;
  name: string;
}

// Expected database schema
interface Events {
  start: string;
  end: string;
  id: string;
  title: string;
}

interface Props {
  posts: Organization[];
  events: Events[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const postsCollection = await collection(firestore, "organizations");
  const postsQuerySnapshot = await getDocs(postsCollection);

  const postData: Organization[] = [];
  postsQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    if (postData.length < 3) {
      if (data.name !== "") {
        postData.push({
          id: doc.id,
          name: data.name,
        } as Organization);
      }
    }
  });

  const postsCollectionEvents = await collection(firestore, "events");
  const postsQuerySnapshotEvents = await getDocs(postsCollectionEvents);

  const postDataEvents: Events[] = [];
  postsQuerySnapshotEvents.forEach((doc) => {
    const data = doc.data();
    if (postDataEvents.length < 3) {
      if (data.title !== "") {
        postDataEvents.push({
          title: data.title,
        } as Events);
      }
    }
  });

  return {
    props: { posts: postData, events: postDataEvents },
  };
};

// define the Student Dashboard functional component
const StudentDashboard = ({ posts, events }: Props): JSX.Element => {
  // Initialize Firebase
  const firebase = init_firebase(); // initialize the Firebase app
  const auth = getAuth(); // get the authentication object

  //function to get the three closest events and display
  const displayOrgs = () => {
    //TODO: access the organizations in firebase, grab 3ish and put them in the span
  };

  //function to get three organizations and dispaly
  const displayEvents = () => {
    //TODO: access the events in firebase, grab 3ish and put them in the span
  };

  const router = useRouter();

  const logoutClick = () => {
    auth.signOut().then(
      function () {
        console.log("Signed Out");
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
    );
    router.push("/");
  };

  const profileClick = () => {
    console.log("profile click");
    router.push("/ProfilePage");
  };

  const FormsClick = () => {
    console.log("forms click");
    router.push("/FormsPage");
  };

  const resourcesClick = () => {
    console.log("register click");
    router.push("/ResourcesPage");
  };

  const organizationsClick = () => {
    console.log("organization click");
    router.push("/OrganizationsPage"); //check for the page name
  };

  const eventsClick = () => {
    console.log("events click");
    router.push("/EventsPage"); //check for the page name
  };

  const execClick = () => {
    console.log("exec click");
    router.push("/ExecPage"); //check for the page name
  };

  if (!posts) {
    return <div className="container">Loading Organizations....</div>;
  }

  // render the Student Dashboard page
  return (
    <>
      <div className="header">
        <div className="headerLeft">
          <Image src={wuhub_logo} alt="wuhub_logo" className="wuhubLogo" />
        </div>
        <div className="headerRight">
          <div id="profile-button">
            <ButtonGroup>
              <Button variant="secondary" id="logout_btn" onClick={logoutClick}>
                Log Out
              </Button>
              <Button
                variant="secondary"
                id="profile_btn"
                onClick={profileClick}
              >
                Profile
              </Button>
              <Button
                variant="secondary"
                id="res_and_pol_btn"
                onClick={resourcesClick}
              >
                Resources and Policies
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.orgs}>
          <h3> Recommended Organizations </h3>
          {posts
            .filter((post) => post.name !== "")
            .map((post) => {
              return (
                <Card
                  key={post.id}
                  className={styles.org}
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{post.name}</Card.Title>
                    <Button variant="secondary">Learn More</Button>
                  </Card.Body>
                </Card>
              );
            })}
          <Button
            variant="secondary"
            className={styles.btn}
            onClick={organizationsClick}
          >
            Show All Organizations
          </Button>
        </div>

        <div className={styles.events}>
          <h3> Recommended Events </h3>
          {events
            .filter((events) => events.title !== "")
            .map((event) => {
              return (
                <Card
                  key={event.id}
                  className={styles.event}
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>
                      {event.start} {event.end}
                    </Card.Text>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary">RSVP</Button>
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              );
            })}
          <Button
            variant="secondary"
            className={styles.btn}
            onClick={eventsClick}
          >
            Show All Events
          </Button>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
