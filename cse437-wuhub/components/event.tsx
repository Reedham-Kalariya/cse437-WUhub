import { useRouter } from "next/router";
import React, { useState, useEffect, ReactElement } from "react";
import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import { Event } from "@/types";
import { init_firebase_storage } from "../firebase/firebase-config";


// Bootstrap
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";
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

// Images
import Image from "next/image";
import wuhub_logo from "@/resources/wuhub_logo.png";
import Card from "react-bootstrap/Card";
import styles from "../styles/EventsPage.module.css";

export const EventBlock = (props) => {

    const router = useRouter();
    const event = props.event;

    const firestore = init_firebase_storage();

    // Handle deleting an event
    const handleViewEvent = async (id: string) => {
        router.push("/event/" + id);
    };

    return (
        <Card
            key={event.id}
            className={styles.event}
            style={{ width: "18rem" }}
        >
            <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>
                    {event.start} to {event.end}
                    <br></br>
                    {event.associatedOrgName}
                </Card.Text>
                <ButtonGroup aria-label="Basic example">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleViewEvent(event.id)}
                    >
                        View
                    </Button>
                    {/* <Button variant="secondary" onClick={() => rsvp(event.id)}>
                        RSVP
                    </Button> */}
                    {/* <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDeleteEvent(event.id)}
                    >
                        Delete
                    </Button> */}
                </ButtonGroup>
            </Card.Body>
        </Card>
    )
}