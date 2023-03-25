import { initializeApp } from "firebase/app";
import { GetStaticProps, NextPage } from "next";
import React, { useState, useEffect, ReactElement } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

import * as ReactDOM from "react-dom";
import { init_firebase } from "@/firebase/firebase-config";

import Image from "next/image";
import brookings_seal from "../resources/brookings-seal.png";
import wuhub_logo from "../resources/wuhub_logo.png";

import styles from "../styles/RegisterPage.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import { init_firebase_storage } from "../firebase/firebase-config";
import { useRouter } from "next/router";
import {
    getFirestore,
    collection,
    Firestore,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    doc,
    Timestamp,
    DocumentReference,
    updateDoc,
} from "firebase/firestore";


export default function Logout() {

    const router = useRouter();

    // Session Management
    //
    const firebase = init_firebase();
    const auth = getAuth();
    signOut(auth).then(() => {
        router.push('/');
    }).catch((error) => {
        // An error happened.
    });


    // render the register form
    return (
        <p>Loading...</p>
    )
}
