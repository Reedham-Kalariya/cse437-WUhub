import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticPaths, GetStaticProps, NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import axios from "axios";
import { Header } from "@/components/header"

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

import { Event } from "@/types"

// EventPage Object
const SingleEventPage = (): JSX.Element => {

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
        }
    }, [auth]);

    const router = useRouter();

    // Get event
    const [event, setEvent] = useState<Event>();
    useEffect(() => {
        axios.get("/api/events/" + id).then((res) => {
            setEvent(res.data);
        }).catch((err) => {
            console.error(err);
        });
    }, [user]);

    if (router.isFallback) {
        return <div>Loading...</div>
    }


    return (
        <>
            <Header user={user} back={null} />

            <div className={styles.mainContent} style={{flexDirection: 'column'}}>
                <h1>{event?.name}</h1>
                <p>{event?.location}</p>
                <p>{event?.isPrivate}</p>
                <p>{event?.description}</p>
                <p>{event?.start}</p>
                <p>{event?.end}</p>
            </div>

        </>
    );
};

export default SingleEventPage;
