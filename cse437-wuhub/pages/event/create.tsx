import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import axios from "axios";
import { Header } from "@/components/header"
import { init_firebase_storage } from "@/firebase/firebase-config";
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
import styles from "@/styles/EventsPage.module.css";
import { it } from "node:test";
import { Event, RSVP, Organization, Tag } from "@/types";
import Multiselect from 'multiselect-react-dropdown';

import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const firestore = init_firebase_storage();


const CreateEvent = (): JSX.Element => {

  // Session Management
  const firebase = init_firebase();
  const auth = getAuth();

  let notFindingUserGate = false;
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        setUser(auth.currentUser);
        notFindingUserGate = false;
        axios.post("/api/organizations/graph/", {
          "to": "_memberships",
          "conditions": [
            {
              "field": "uid",
              "value": user?.uid
            },
            {
              "field": "role",
              "value": "exec"
            }
          ]
        }).then((res) => {
          setOrganizations(res.data);
          if (res.data.length == 0) {
            router.push('/unauthorized');
          }
        }).catch((err) => {
          console.error(err);
        });
        return;
      }

      // Protected Page, must be signed in
      if (notFindingUserGate) {
        router.push('/unauthorized');
      }
      notFindingUserGate = true;
    });
    return () => {
      unsubscribe();
    }
  }, [auth]);



  // Get tags
  //
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    if (user) {
      axios.get("/api/tags").then((res) => {
        setTags(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);


  // Initiate State Variables
  const [newEventID, setNewEventID] = useState("placeholder_for_database");
  const [newEventName, setNewEventName] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventPrivate, setNewEventPrivate] = useState(false);
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [newEventOID, setNewEventOID] = useState("");
  const [newEventTags, setNewEventTags] = useState([]);

  // Back click
  const router = useRouter();

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a new event, add organization as host, add user as rsvp, add tag associations
    await axios.post("/api/events/", {
      name: newEventName,
      location: newEventLocation,
      isPrivate: newEventPrivate,
      description: newEventDescription,
      start: newEventStart,
      end: newEventEnd,
      oid: newEventOID,
      tags: newEventTags,
      uid: user?.uid
      uid: user?.uid
    });

    router.push("/dashboard");
  };

  return (
    <>
      <Header user={user} back={null} />

      <div className={styles.mainContent}>
        <div className={styles.addEventsBox} id="addEventsBox">
          <h1>{"Make a New Event"}</h1>
          <Form onSubmit={(e) => handleAddEvent(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
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
              <Form.Label>Associated Organization</Form.Label>
              <Form.Select
                onChange={(e) => {
                  console.log(e.target.value);
                  setNewEventOID(e.target.value);
                }}
              >
                <option> Select One </option>
                {organizations.map((org) => (
                  <option key={org.oid} value={org.oid}>{org.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Label>Event Tags</Form.Label>
            <Multiselect
              options={tags} // Options to display in the dropdown
              onSelect={(e: any) => setNewEventTags(e)} // Function will trigger on select event
              onRemove={(e: any) => setNewEventTags(e)} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            />

            <br />
            <DateTimePicker
              label="When?"
              value={dayjs(newEventStart)}
              onChange={(e) => {
                if (e == undefined) {
                  return
                }
                const newStart = e?.toDate();
                const newEnd = new Date(newStart?.getTime() + 60 * 60 * 1000); // add 1 hour
                setNewEventEnd(dayjs(newEnd).format('M/D/YYYY, h:mm:ss A'));
                setNewEventStart(e?.format('M/D/YYYY, h:mm:ss A'));
              }}
            />
            <br /><br />

            <br />
            <DateTimePicker
              label="End At..."
              value={dayjs(newEventEnd)}
              onChange={(e) => { setNewEventEnd(e?.format('M/D/YYYY, h:mm:ss A') as string) }}
            />
            <br /><br />

            <Button
              variant="primary"
              type="submit"
            >
              Create Event
            </Button>

          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
