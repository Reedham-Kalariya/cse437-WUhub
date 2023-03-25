import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import axios from "axios";
import { Header } from "@/components/header"
import styles from "@/styles/EventsPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import { Event, RSVP } from "@/types";







// EventPage Object
const EventsPage = (): JSX.Element => {

  const router = useRouter();

  // Session Management
  const firebase = init_firebase();
  const auth = getAuth();

  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(auth.currentUser);
    }
  });

  // Get events
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    axios.get("/api/events").then((res) => {
      setEvents(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }, []);


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
      <Header user={user} />

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
