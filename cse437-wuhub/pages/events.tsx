import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
import { it } from "node:test";

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

let currentUser = auth.currentUser;
let currentUserUID = currentUser?.uid;
// Session Management
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = auth.currentUser;
    currentUserUID = currentUser?.uid;
  }
});

// Expected database schema
interface Event {
  id: string;
  title: string;
  location: string;
  private: boolean;
  description: string;
  start: string;
  end: string;
  associatedOrgName: string;
  associatedOrgID: string;
}

interface RSVP {
  uid: string;
  eid: string;
}

interface Props {
  posts: Event[];
  initrsvps: RSVP[];
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
      associatedOrgName: data.associatedOrgName,
      associatedOrgID: data.associatedOrgID,
    } as Event);
  });

  const postsCollectionRSVP = await collection(firestore, "rsvp");
  const postsQuerySnapshotRSVP = await getDocs(postsCollectionRSVP);

  const postDataRSVP: RSVP[] = [];
  postsQuerySnapshotRSVP.forEach((doc) => {
    const data = doc.data();

    postDataRSVP.push({
      uid: data.uid,
      eid: data.eid,
    } as RSVP);
  });

  return {
    props: { posts: postData, initrsvps: postDataRSVP },
  };
};

// EventPage Object
const EventsPage = ({ posts, initrsvps }: Props): JSX.Element => {
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
  const [newEventAssociatedOrgName, setNewEventAssociatedOrgName] =
    useState("");
  const [newEventAssociatedOrgID, setNewEventAssociatedOrgID] = useState("");

  // Edit variables
  const [editMode, setEditMode] = useState(false);

  // Define a state variable to hold the orgs
  const [orgs, setOrgs] = useState(new Map());

  const [rsvps, setRsvps] = useState(initrsvps);

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
    setNewEventAssociatedOrgName("");
    setNewEventAssociatedOrgID("");
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
        associatedOrgName: newEventAssociatedOrgName,
        setNewEventAssociatedOrgID: newEventAssociatedOrgID,
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
            associatedOrgName: newEventAssociatedOrgName,
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
      associatedOrgName: newEventAssociatedOrgName,
      associatedOrgID: newEventAssociatedOrgID,
    });

    const hostsCollection = collection(firestore, "hosts");
    const docRef2 = await addDoc(hostsCollection, {
      oid: newEventAssociatedOrgID,
      eid: docRef.id,
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
      associatedOrgName: newEventAssociatedOrgName,
      associatedOrgID: newEventAssociatedOrgID,
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
    setNewEventAssociatedOrgName(post.associatedOrgName);
    setNewEventAssociatedOrgID(post.associatedOrgID);
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id: string) => {
    deleteDoc(doc(firestore, "events", id));
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
  };

  // Handle deleting an event
  const handleViewEvent = async (id: string) => {
    router.push("/event/" + id);
  };

  // Get organizations for which the user is an exec
  const getOrgsOfUser = async (uid: string | undefined) => {
    const orgs = new Map<string, string>();
    const q = query(
      collection(firestore, "memberships"),
      where("uid", "==", uid),
      where("title", "==", "exec")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      orgs.set(doc.data().orgName, doc.data().oid);
    });
    return orgs;
  };

  async function rsvp(eventid: string) {
    const userid = currentUser?.uid;
    const rsvpCollection = collection(firestore, "rsvp");
    console.log(userid);
    let i = 0;
    rsvps.filter((rsvp: RSVP) => rsvp.eid === eventid).filter((rsvp: RSVP) => rsvp.uid === userid).map((rsvp: RSVP) => {
        i = i + 1;
        return;
      });
    console.log(
      "number of rsvps with same uid: " + i + " and userid: " + userid
    );

    if (i === 0) {
      if (typeof userid !== "undefined") {
        const r:RSVP = {
          uid: userid,
          eid: eventid,
        };
        await addDoc(rsvpCollection, r);
        setRsvps([...rsvps, r]);
        alert("You have successfully RSVPed");
      } else {
        alert("Please sign in to RSVP");
      }
    } else {
      alert("You have already RSVPed to this event");
    }
  }

  function checkOrgsValuesForSpecificID(oid: string): boolean {
    const iterator_object = orgs.values();
    let nextValue = iterator_object.next();
    
    while (!nextValue.done) {
       if (nextValue.value == oid) {
         return true;
       }
        nextValue = iterator_object.next();
     }
    return false;
  }

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
                    <br></br>
                    {post.associatedOrgName}
                  </Card.Text>
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleViewEvent(post.id)}
                    >
                      View
                    </Button>
                    <Button variant="secondary" onClick={() => rsvp(post.id)}>
                      RSVP
                    </Button>
                    {checkOrgsValuesForSpecificID(post.associatedOrgID) && (
                      <>
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
                        </Button>{" "}
                      </>
                    )}
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
              <Form.Select
                onChange={(e) => {
                  setNewEventAssociatedOrgName(e.target.value);
                  setNewEventAssociatedOrgID(orgs.get(e.target.value));
                }}
              >
                <option> Select One </option>
                {Array.from(orgs.entries()).map(([key, value]) => (
                  <option key={key}>{key}</option>
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
