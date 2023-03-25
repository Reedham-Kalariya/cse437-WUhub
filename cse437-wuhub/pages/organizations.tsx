import React, { useState, useEffect, ReactElement } from "react";
import { GetStaticProps, NextPage } from "next";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import { init_firebase_storage } from "../firebase/firebase-config";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { Header } from "@/components/header"
import axios from "axios";
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
} from "firebase/firestore";

import Image from "next/image";
import wuhub_logo from "../resources/wuhub_logo.png";
import Button from "react-bootstrap/Button";
import styles from "../styles/OrganizationsPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ButtonGroup, Card, Form } from "react-bootstrap";

import { Organization, Membership, User } from "@/types"

const firestore = init_firebase_storage();

const OrganizationsPage = (): JSX.Element => {

  // Session Management
  //
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


  // Get Organizations
  //
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    axios.get('/api/organizations/').then((res) => {
      setOrganizations(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  const router = useRouter();
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);

  const backClick = () => {
    router.push("/dashboard");
  };

  const handleViewOrg = (oid: string) => {
    router.push('/organization/' + oid)
  };

  const handleCreate = () => {
    router.push('/organization/create');
  };

  return (
    <>
      <Header user={user} back={null} />
      
      <div className={styles.mainContent}>

        <div className={styles.currentOrgsBox}>

          {organizations.map((post) => {
            return (
              <>
                <Card
                  key={post.oid}
                  className={styles.org}
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{post.name}</Card.Title>
                    <Card.Text>{post.description}</Card.Text>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="primary" onClick={() => handleViewOrg(post.oid)}>View</Button>
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
          Create a New Organization
        </Button>
      </div>
    </>
  );
};

export default OrganizationsPage;
