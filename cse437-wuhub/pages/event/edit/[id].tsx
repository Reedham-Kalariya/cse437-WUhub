import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import axios from "axios";
import { Header } from "@/components/header";
import { init_firebase_storage } from "@/firebase/firebase-config";
import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  GetStaticPaths,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import styles from "@/styles/EventsPage.module.css";
import { it } from "node:test";
import { Event, RSVP, Organization, Tag } from "@/types";
import Multiselect from "multiselect-react-dropdown";

import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const firestore = init_firebase_storage();

const EditEventPage = (): JSX.Element => {
  const router = useRouter();
  let id = router.query.id;

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
    };
  }, [auth]);


  // Initiate State Variables
  const [editEventID, setEditEventID] = useState("placeholder_for_database");
  const [editEventName, setEditEventName] = useState("");
  const [editEventLocation, setEditEventLocation] = useState("");
  const [editEventPrivate, setEditEventPrivate] = useState(false);
  const [editEventDescription, setEditEventDescription] = useState("");
  const [editEventStart, setEditEventStart] = useState("");
  const [editEventEnd, setEditEventEnd] = useState("");
  const [editEventTags, setEditEventTags] = useState([]);

  // Get event
  useEffect(() => {
    axios.get("/api/events/" + id).then((res) => {
      console.log(res.data);
      setEditEventName(res.data.name);
      setEditEventLocation(res.data.location);
      setEditEventPrivate(res.data.isPrivate);
      setEditEventDescription(res.data.description);
      setEditEventStart(res.data.start);
      setEditEventEnd(res.data.end);
    }).catch((err) => {
      console.error(err);
    });
  }, [user]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const backClick = () => {
    router.push("/organizations");
  };

  // Get tags
  //
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    if (user) {
      axios.post("/api/tags").then((res) => {
        setTags(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a new event, add organization as host, add user as rsvp, add tag associations
    axios.put("/api/events/" + id, {
      eid: id,
      name: editEventName,
      location: editEventLocation,
      isPrivate: editEventPrivate,
      description: editEventDescription,
      start: editEventStart,
      end: editEventEnd,
      tags: editEventTags,
      uid: user?.uid
    });

    router.push("/events");
  };

  return (
    <>
      <Header user={user} back={null} />

      <div className={styles.mainContent}>
        <div className={styles.addEventsBox} id="addEventsBox">
          <h1>{"Edit an Event"}</h1>
          <Form onSubmit={(e) => handleUpdateEvent(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={editEventName}
                onChange={(e) => setEditEventName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={editEventDescription}
                onChange={(e) => setEditEventDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={editEventLocation}
                onChange={(e) => setEditEventLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                label="Private Event?"
                type="checkbox"
                checked={editEventPrivate}
                onChange={(e) => {
                  console.log(e);
                  setEditEventPrivate(e.target.checked);
                }}
              />
            </Form.Group>

            <br />
            <DateTimePicker
              label="When?"
              value={dayjs(editEventStart)}
              onChange={(e) => {
                if (e == undefined) {
                  return;
                }
                setEditEventStart(e.format("M/D/YYYY, h:mm:ss A"));
              }}
            />
            <br />
            <br />

            <br />
            <DateTimePicker
              label="End At..."
              value={dayjs(editEventEnd)}
              onChange={(e) => {
                if (e == undefined) {
                  return;
                }
                setEditEventEnd(e.format("M/D/YYYY, h:mm:ss A"));
              }}
            />
            <br />
            <br />

            {/* <Form.Label>Event Tags</Form.Label>
            <Multiselect
              options={tags} // Options to display in the dropdown
              onSelect={(e) => setEditEventTags(e)} // Function will trigger on select event
              onRemove={(e) => setEditEventTags(e)} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            /> */}

            <Button variant="primary" type="submit">
              Edit Event
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
