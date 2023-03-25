import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Header } from "@/components/header"
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';

import Button from "react-bootstrap/Button";
import styles from "@/styles/OrganizationsPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ButtonGroup, Card, Form } from "react-bootstrap";

import { Organization, Membership, User, Tag } from "@/types"

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
  
  const router = useRouter();
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [newOrgTags, setNewOrgTags] = useState([]);

  const handleAddOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create a new organization, attach the creator as a member
    await axios.post("/api/organizations/", {
      name: newOrgName,
      description: newOrgDescription,
      tags: newOrgTags,
      uid: user?.uid
    });

    router.push("/dashboard");
  };

  return (
    <>
      <Header user={user} />

      <div className={styles.mainContent}>
        <div className={styles.addOrgBox}>
          <h1>Start a New Organization</h1>
          <Form onSubmit={(e) => handleAddOrg(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newOrgName}
                onChange={(e) => {
                  console.log(e.target.value);
                  setNewOrgName(e.target.value)
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Short Description </Form.Label>
              <Form.Control
                value={newOrgDescription}
                onChange={(e) => setNewOrgDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Label>Organization Tags</Form.Label>
            <Multiselect
              options={tags} // Options to display in the dropdown
              onSelect={(e: any) => setNewOrgTags(e)} // Function will trigger on select event
              onRemove={(e: any) => setNewOrgTags(e)} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            />

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
