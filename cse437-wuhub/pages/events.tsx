import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import axios from "axios";
import { Header } from "@/components/header"
import { init_firebase_storage } from "../firebase/firebase-config";
import styles from "@/styles/EventsPage.module.css";
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
import { it } from "node:test";
import { Event, RSVP } from "@/types";

const firestore = init_firebase_storage();

// Props template
interface Props {
  events: Event[];
}

// EventPage Object
const EventsPage = (): JSX.Element => {

  // Session Management
  //
  const firebase = init_firebase();
  const auth = getAuth();

  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(auth.currentUser);
    }
  });

  // Get events
  //
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    axios.get("/api/events").then((res) => {
      setEvents(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  const router = useRouter();


  // Get organizations for which the user is an exec
  // const getOrgsOfUser = async (user: any) => {
  //   if (user.userCurrent == null) {
  //     return;
  //   }

  //   const uid = user.userCurrent.uid;
  //   const orgs = new Map<string, string>();
  //   const q = query(
  //     collection(firestore, "memberships"),
  //     where("uid", "==", uid),
  //     where("title", "==", "exec")
  //   );
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     orgs.set(doc.data().orgName, doc.data().oid);
  //   });
  //   return orgs;
  // };

  // async function rsvp(eventid: string) {
  //   const userid = currentUser?.uid;
  //   const rsvpCollection = collection(firestore, "rsvp");
  //   console.log(userid);
  //   let i = 0;
  //   rsvps.filter((rsvp: RSVP) => rsvp.eid === eventid).filter((rsvp: RSVP) => rsvp.uid === userid).map((rsvp: RSVP) => {
  //       i = i + 1;
  //       return;
  //     });
  //   console.log(
  //     "number of rsvps with same uid: " + i + " and userid: " + userid
  //   );

  //   if (i === 0) {
  //     if (typeof userid !== "undefined") {
  //       const r:RSVP = {
  //         uid: userid,
  //         eid: eventid,
  //       };
  //       await addDoc(rsvpCollection, r);
  //       setRsvps([...rsvps, r]);
  //       alert("You have successfully RSVPed");
  //     } else {
  //       alert("Please sign in to RSVP");
  //     }
  //   } else {
  //     alert("You have already RSVPed to this event");
  //   }
  // }

  // function checkOrgsValuesForSpecificID(oid: string): boolean {
  //   const iterator_object = orgs.values();
  //   let nextValue = iterator_object.next();

  //   while (!nextValue.done) {
  //     if (nextValue.value == oid) {
  //       return true;
  //     }
  //     nextValue = iterator_object.next();
  //   }
  //   return false;
  // }

  const handleViewEvent = (eid: string) => {
    router.push('/event/' + eid)
  };

  const handleEditEvent = (eid: string) => {
    router.push('/event/edit/' + eid)
  };

  const handleCreate = () => {
    router.push("/event/create/");
  }

  return (
    <>
      <Header user={user} back={"/dashboard"} />

      <div className={styles.mainContent}>

        <div className={styles.currentEventsBox}>
          {events.map((post) => {
            return (
              <>
                <Card
                  key={post.eid}
                  className={styles.org}
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{post.name}</Card.Title>
                    <Card.Text>{post.description}</Card.Text>
                    <Card.Text>{post.location}</Card.Text>
                    <Card.Text>{post.start}</Card.Text>
                    <Card.Text>{post.end}</Card.Text>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="primary" onClick={() => handleViewEvent(post.eid)}>View</Button>
                      <Button variant="primary" onClick={() => handleEditEvent(post.eid)}>Edit</Button>
                    </ButtonGroup>
                  </Card.Body>
                  
                </Card>
              </>
            );
          })}
        </div>

        <Button
          variant="primary"
          onClick={handleCreate}
        >
          Create a New Event
        </Button>

      </div>
    </>
  );
};

export default EventsPage;
