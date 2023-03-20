import React, { useState, useEffect, ReactElement } from "react";
import { GetStaticProps, NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { Header } from "@/components/header"
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';

import Button from "react-bootstrap/Button";
import styles from "@/styles/OrganizationsPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ButtonGroup, Card, Form } from "react-bootstrap";

import { Organization, Membership, User, Tag } from "@/types"

const firestore = init_firebase_storage();

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext<{ id: string }>
  ) => {
    const id = context.query.id as string;
    return { props: { id: id } };
  };



const EditOrganization = ({ id }): JSX.Element => {

  // Session Management
  const firebase = init_firebase();
  const auth = getAuth();

  const router = useRouter();
  
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

  const [editOrgName, setEditOrgName] = useState("");
  const [editOrgDescription, setEditOrgDescription] = useState("");

  // Get organization
  useEffect(() => {
    axios.get("http://localhost:3000/api/organizations/" + id).then((res) => {
      setEditOrgName(res.data.name);
      setEditOrgDescription(res.data.description);
    }).catch((err) => {
      console.error(err);
    });
  }, [user]);

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const backClick = () => {
    router.push("/organizations");
  };


  // Get tags
  //
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    if (user) {
      axios.post("http://localhost:3000/api/tags").then((res) => {
        setTags(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);


  const handleEditOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create a new organization, attach the creator as a member
    axios.post("http://localhost:3000/api/organizations/create/", {
      oid: id,
      name: editOrgName,
      description: editOrgDescription,
    });

    router.push("/organizations");
  };

  return (
    <>
      <Header user={user} back={"/organizations"} />

      <div className={styles.mainContent}>
        <div className={styles.addOrgBox}>
          <h1>Edit Organization</h1>
          <Form onSubmit={(e) => handleEditOrg(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={editOrgName}
                onChange={(e) => {
                  setEditOrgName(e.target.value)
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Short Description </Form.Label>
              <Form.Control
                value={editOrgDescription}
                onChange={(e) => setEditOrgDescription(e.target.value)}
              />
            </Form.Group>

            {/* <Form.Label>Organization Tags</Form.Label>
            <Multiselect
              options={tags} // Options to display in the dropdown
              onSelect={(e) => setEditOrgTags(e)} // Function will trigger on select event
              onRemove={(e) => setEditOrgTags(e)} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            /> */}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default EditOrganization;
