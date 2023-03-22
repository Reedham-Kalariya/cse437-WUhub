import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticPaths, GetStaticProps, NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Header } from "@/components/header"
import {
    collection,
    addDoc,
    getDoc,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    Timestamp
} from "firebase/firestore";

import Image from "next/image";
import wuhub_logo from "@/resources/wuhub_logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import styles from "@/styles/EventsPage.module.css";

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

import { Organization, Event } from "@/types"

let currentUser = auth.currentUser;

const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext<{ id: string }>
) => {
    const id = context.query.id as string;
    return { props: { id: id } };
};


// EventPage Object
const SingleOrgsPage = ({ id }): JSX.Element => {

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
        }
    }, [auth]);

    const router = useRouter();

    // Get organization
    const [org, setOrg] = useState<Organization>();
    useEffect(() => {
        axios.get("http://localhost:3000/api/organizations/" + id).then((res) => {
            setOrg(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [user]);


    // Get events
    const [events, setEvents] = useState<Event[]>([]);
    useEffect(() => {
        axios.post("http://localhost:3000/api/events/graph/", {
            "to": "_hosts",
            "field": "oid",
            "value": id,
        }).then((res) => {
            setEvents(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [user]);

    if (router.isFallback) {
        return <div>Loading...</div>
    };

    const handleViewEvent = (eid: string) => {
        router.push("/event/" + eid);
    }

    return (
        <>
            <Header user={user} back={"/events"} />

            <div className={styles.mainContent} style={{ flexDirection: 'column' }}>
                <h1>{org?.name}</h1>
                <p>{org?.description}</p>

                <br />
                <h3> Events </h3>
                <div className={styles.card_container} >
                    {events
                        .map((event) => {
                            return (
                                <Card
                                    key={event.eid}
                                    className={styles.event}
                                    style={{ width: "18rem" }}
                                >
                                    <Card.Body>
                                        <Card.Title>{event.name}</Card.Title>
                                        <Card.Text>
                                            {event.start} - {event.end}
                                        </Card.Text>
                                        <ButtonGroup aria-label="Basic example">
                                            <Button variant="secondary" onClick={() => handleViewEvent(event.eid)}>View</Button>
                                        </ButtonGroup>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                </div>
            </div>

        </>
    );
};

export default SingleOrgsPage;
