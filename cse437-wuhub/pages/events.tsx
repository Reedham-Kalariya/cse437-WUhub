import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import { init_firebase_storage } from "../firebase/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
  where,
  QuerySnapshot,
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
let currentUserUID = currentUser?.uid;

// Expected database schema
interface Event {
  id: string;
  title: string;
  location: string;
  private: boolean;
  description: string;
  start: string;
  end: string;
}

interface Props {
  posts: Event[];
}

// Load existing events
export const getStaticProps: GetStaticProps<Props> = async () => {
  const postsCollection = await collection(firestore, "events");
  const postsQuerySnapshot = await getDocs(postsCollection);

  const postData: Event[] = [];
  postsQuerySnapshot.forEach((doc) => {
    const data = doc.data();

    postData.push({
      id: doc.id,
      title: data.title,
      location: data.location,
      private: data.private,
      description: data.description,
      start: data.start,
      end: data.end,
    } as Event);
  });

  return {
    props: { posts: postData },
  };
};

// EventPage Object
const EventsPage = ({ posts }: Props): JSX.Element => {
  // Back click
  const router = useRouter();

  const backClick = () => {
    router.push("/StudentDashboard");
  };

  const [events, setEvents] = useState(posts);

  // Variables for creating a new event
  const [newEventID, setNewEventID] = useState("placeholder_for_database");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventPrivate, setNewEventPrivate] = useState(false);
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [newEventAssociatedOrg, setNewEventAssociatedOrg] = useState("");

  // Edit variables
  const [editMode, setEditMode] = useState(false);

  // Define a state variable to hold the orgs
  const [orgs, setOrgs] = useState<string[][]>([]);

  // Use useEffect to fetch the orgs when the component mounts
  useEffect(() => {
    if (currentUserUID) {
      getOrgsOfUser(currentUserUID).then(setOrgs);
    }
  }, [currentUserUID]);

  const addNewEvent = (newEvent: Event): void => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const clearStagingArea = () => {
    setEditMode(false);
    setNewEventID("placeholder_for_database");
    setNewEventTitle("");
    setNewEventLocation("");
    setNewEventDescription("");
    setNewEventPrivate(false);
    setNewEventStart("");
    setNewEventEnd("");
  };

  // Handle the create/edit event area
  const handleStagedEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editMode) {
      console.log("The edit ID: " + newEventID);

      // Throw to local
      updateDoc(doc(firestore, "events", newEventID), {
        title: newEventTitle,
        location: newEventLocation,
        private: newEventPrivate,
        description: newEventDescription,
        start: newEventStart,
        end: newEventEnd,
      });

      // Throw to local
      setEvents((prevEvents) => {
        const index = prevEvents.findIndex((event) => event.id === newEventID);
        if (index !== -1) {
          const updatedEvents = [...prevEvents];
          updatedEvents[index] = {
            title: newEventTitle,
            location: newEventLocation,
            private: newEventPrivate,
            description: newEventDescription,
            start: newEventStart,
            end: newEventEnd,
          } as Event;
          return updatedEvents;
        }
        // if the event with the given ID is not found, return the original array
        return prevEvents;
      });

      clearStagingArea();

      return;
    }

    // Throw at server
    const eventCollection = collection(firestore, "events");
    const docRef = await addDoc(eventCollection, {
      title: newEventTitle,
      location: newEventLocation,
      private: newEventPrivate,
      description: newEventDescription,
      start: newEventStart,
      end: newEventEnd,
    });

    // Throw at local
    addNewEvent({
      id: docRef.id,
      title: newEventTitle,
      location: newEventLocation,
      private: newEventPrivate,
      description: newEventDescription,
      start: newEventStart,
      end: newEventEnd,
    } as Event);

    clearStagingArea();

    return;
  };

  const handleEditMode = (post: Event) => {
    console.log(post);

    if (post.id == "placeholder_for_database_do_not_edit") {
      return;
    }

    setEditMode(true);
    setNewEventID(post.id);
    setNewEventTitle(post.title);
    setNewEventLocation(post.location);
    setNewEventDescription(post.description);
    setNewEventPrivate(post.private);
    setNewEventStart(post.start);
    setNewEventEnd(post.end);
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id: string) => {
    deleteDoc(doc(firestore, "events", id));
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };

  // Handle deleting an event
  const handleViewEvent = async (id: string) => {
    router.push('/event/' + id)
  };

  // Get organizations for which the user is an exec
  const getOrgsOfUser = async (uid: string | undefined) => {
    let orgs: string[][] = [];
    const q = query(
      collection(firestore, "memberships"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      orgs.push([doc.data().oid, doc.data().orgName]);
    });
    console.log(orgs);
    return orgs;
  };

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
          {events.map((post) => {
            return (
              <Card
                key={post.id}
                className={styles.event}
                style={{ width: "18rem" }}
              >
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>
                    {post.start} to {post.end}
                  </Card.Text>
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleViewEvent(post.id)}
                    >
                      View
                    </Button>
                    <Button variant="secondary">RSVP</Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEditMode(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleDeleteEvent(post.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => getOrgsOfUser(currentUserUID)}
                    >
                      Get
                    </Button>
                  </ButtonGroup>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        <div className={styles.addEventsBox} id="addEventsBox">
          <h1>{editMode ? "Edit an Event" : "Make a New Event"}</h1>
          <Form onSubmit={(e) => handleStagedEvent(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                label="Private"
                type="checkbox"
                checked={newEventPrivate}
                onChange={(e) => setNewEventPrivate(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Associated Organization</Form.Label>
              <Form.Select onChange={(e) => setNewEventAssociatedOrg(e.target.value)}>
                {orgs.map((org) => (
                  <option> {org[1]} </option>
                ))}
              </Form.Select>
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

            <Button variant={editMode ? "warning" : "primary"} type="submit">
              {editMode ? "Edit Event" : "Add Event"}
            </Button>

            {editMode && (
              <Button variant="light" type="button" onClick={clearStagingArea}>
                Close Edit Mode
              </Button>
            )}
          </Form>
        </div>
      </div>
    </>
  );
};

export default EventsPage;
