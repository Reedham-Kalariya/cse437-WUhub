import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticProps, NextPage } from "next";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import { init_firebase_storage } from "../firebase/firebase-config";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
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

import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import styles from "../styles/EventsPage.module.css";

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

let currentUser = auth.currentUser;

// Expected database schema
interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}

interface Props {
  posts: Event[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const postsCollection = await collection(firestore, "events");
  const postsQuerySnapshot = await getDocs(postsCollection);

  const postData: Event[] = [];
  postsQuerySnapshot.forEach((doc) => {
    const data = doc.data();

    postData.push({
      id: doc.id,
      title: data.title,
      start: data.start,
      end: data.end,
    } as Event);
  });

  return {
    props: { posts: postData },
  };
};

const EventsPage = ({ posts }: Props): JSX.Element => {
  const router = useRouter();
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");

  const backClick = () => {
    router.push("/StudentDashboard");
  };

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eventCollection = collection(firestore, "events");
    await addDoc(eventCollection, {
      title: newEventName,
      start: newEventStart,
      end: newEventEnd,
    });
    setNewEventName("");
    setNewEventStart("");
    setNewEventEnd("");
    router.push("/EventsPage");
  };

  const handleDeleteEvent = async (postId: string) => {
    await deleteDoc(doc(firestore, "events", postId));
    setDeletedPostId(postId);
    router.push("/EventsPage");
  };

  const handleEditEvent = async (postId: string) => {
    console.log(postId);
    await updateDoc(doc(firestore, "events", postId), {
      title: "changed name",
      start: "changed start",
      end: "changed end",
    });
  };

  const renderEditDialogBox = async (postId: string) => {
    const docRef = doc(firestore, "events", postId);
    const docSnap = await getDoc(docRef);
    const prev_event = docSnap.data();

    // const prev_event_div = document.getElementById(postId);
    // prev_event_div?.classList.add("selectedBorder")

    const addEventsBox = document.getElementById("addEventsBox");
    console.log(prev_event?.title);
    ReactDOM.render(
      <>
        <h1>Edit Event</h1>
        <Form onSubmit={() => handleEditEvent(postId)}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
            />
          </Form.Group>

          <Button variant="warning" type="submit">
            Edit Event
          </Button>
        </Form>
      </>,
      addEventsBox
    );
  };

  //   if (!posts) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <>
      <div className="header">
        <div className="headerLeft">
          <Image src={wuhub_logo} alt="wuhub_logo" className="wuhubLogo" />
        </div>
        <div className="headerRight">
          <div id="profile-button">{currentUser?.email}</div>
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
        <div className={styles.currentEventsBox}>
          {posts.map((post) => {
            return (
              <>
                <Card
                  key={post.id}
                  className={styles.event}
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                      {post.start} {post.end}
                    </Card.Text>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary">RSVP</Button>
                      <Button
                        variant="secondary"
                        onClick={() => renderEditDialogBox(post.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDeleteEvent(post.id)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              </>
            );
          })}
        </div>

        <div className={styles.addEventsBox} id="addEventsBox">
          <h1>Make a New Event</h1>
          <Form onSubmit={handleAddEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                value={newEventStart}
                onChange={(e) => setNewEventStart(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                value={newEventEnd}
                onChange={(e) => setNewEventEnd(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Event
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EventsPage;
