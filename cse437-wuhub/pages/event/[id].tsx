import React, { useState, useEffect, ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { GetStaticPaths, GetStaticProps, NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
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

let currentUser = auth.currentUser;

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

interface EventProps {
    id: string;
    event: Event;
}

export const getServerSideProps: GetServerSideProps<EventProps, {id: string}> = async (
    context: GetServerSidePropsContext<{ id: string }>
) => {
    const id = context.query.id as string;

    // Fetch post data from API route
    const res = await fetch(`http://localhost:3000/api/event/${id}`);
    const post = res.ok ? await res.json() : undefined;

    return { props: { id: id, event: post as Event } };
};


// EventPage Object
const SingleEventPage = ({ id, event }: EventProps): JSX.Element => {

    const router = useRouter();

    console.log(event);

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const backClick = () => {
        router.push("/events");
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
                <strong>&lt;</strong> Back to Events
            </Button>

            <div className={styles.mainContent} style={{flexDirection: 'column'}}>
                <p>{id}</p>
                <p>{event.title}</p>
                <p>{event.location}</p>
                <p>{event.description}</p>
                <p>{event.start}</p>
                <p>{event.end}</p>
                <p>{event.private}</p>
            </div>

        </>
    );
};

export default SingleEventPage;
