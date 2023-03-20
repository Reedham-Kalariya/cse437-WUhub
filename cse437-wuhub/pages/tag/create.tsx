import React, { useState, useEffect, ReactElement } from "react";
import { GetStaticProps, NextPage } from "next";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { Header } from "@/components/header"
import axios from "axios"

import Button from "react-bootstrap/Button";
import styles from "@/styles/OrganizationsPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ButtonGroup, Card, Form } from "react-bootstrap";

import { Organization, Membership, User } from "@/types"

const firestore = init_firebase_storage();



const CreateOrganization = (): JSX.Element => {

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
  const [newTagName, setNewTagName] = useState("");

  const handleAddOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create a new tag, no other steps
    axios.post("http://localhost:3000/api/tag/create/", {
      name: newTagName,
    });

    router.push("/dashboard");
  };

  return (
    <>
      <Header user={user} back={"/dashboard"} />

      <div className={styles.mainContent}>
        <div className={styles.addOrgBox}>
          <h1>Create a New Tag</h1>
          <Form onSubmit={(e) => handleAddOrg(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newTagName}
                onChange={(e) => {
                  console.log(e.target.value);
                  setNewTagName(e.target.value)
                }}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateOrganization;
