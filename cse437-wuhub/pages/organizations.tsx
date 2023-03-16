import React, { useState, useEffect, ReactElement } from "react";
import { GetStaticProps, NextPage } from "next";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { init_firebase } from "@/firebase/firebase-config";
import { init_firebase_storage } from "../firebase/firebase-config";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
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

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

let currentUser = auth.currentUser;

// Expected database schema
interface Organization {
  id: string;
  name: string;
  desc: string;
  route: string;
}

// Expected database schema
interface Membership {
  oid: string;
  uid: string;
  title: string;
  orgName: string;
}

// Expected database schema
interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  posts: Organization[];
  memberships: Membership[];
  users: User[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const postsCollection = await collection(firestore, "organizations");
  const postsQuerySnapshot = await getDocs(postsCollection);

  const postData: Organization[] = [];
  postsQuerySnapshot.forEach((doc) => {
    const data = doc.data();

    postData.push({
      id: doc.id,
      name: data.name,
      desc: data.desc,
    } as Organization);
  });

  const membershipCollection = await collection(firestore, "memberships");
  const membershipQuerySnapshot = await getDocs(membershipCollection);

  const membershipsData: Membership[] = [];
  membershipQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    membershipsData.push({
      oid: data.oid,
      uid: data.uid,
      title: data.title,
      orgName: data.orgName,
    } as Membership);
  });

  const userCollection = await collection(firestore, "users");
  const userQuerySnapshot = await getDocs(userCollection);

  const usersData: User[] = [];
  userQuerySnapshot.forEach((doc) => {
    const data = doc.data();
    usersData.push({
      uid: data.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    } as User);
  });

  return {
    props: { posts: postData, memberships: membershipsData, users: usersData },
  };
};

const OrganizationsPage = ({
  posts,
  memberships,
  users,
}: Props): JSX.Element => {
  const router = useRouter();
  const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const [newOrgOID, setNewOrgOID] = useState("");

  const backClick = () => {
    router.push("/StudentDashboard");
  };

  const handleAddOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orgCollection = collection(firestore, "organizations");
    const docRef = await addDoc(orgCollection, {
      name: newOrgName,
      desc: newOrgDesc,
      route: null,
    });
    const userid = currentUser?.uid;
    console.log(userid);
    if(typeof(userid) !== "undefined"){
      const membershipCollection = collection(firestore, "memberships");
      console.log(docRef.id);
      await addDoc(membershipCollection, {
        uid: currentUser?.uid,
        title: "exec",
        oid: docRef.id,
        orgName: newOrgName
      });
    }
    else{
      alert("Please sign in to make an organization");
    }
    

    setNewOrgName("");
    setNewOrgDesc("");
    router.push("/organizations");
  };

  async function joinOrg(oid: string, name: string){
    const membershipCollection = collection(firestore, "memberships");
    const userid = currentUser?.uid;
    let i = 0;
    memberships.filter((membership: Membership) => membership.oid === oid).filter((membership: Membership) => membership.uid === userid).map((membership: Membership) => {
      i = i + 1;
      return;
    });
    console.log("number of members with same uid: " + i + " and userid: " + userid);
    
    //TODO: We need some way to refresh the page so that the membership table updates every time a new member joins!!!!!!!!!!!!!!!!!!!!

    if(i === 0){
      if(typeof(userid) !== "undefined"){
        await addDoc(membershipCollection, {
          uid: userid,
          title: "member",
          oid: oid,
          orgName: name
        });
        alert("You have successfully joined " + name);
      } 
    }
    else{
      alert("You are already part of this organization");
    }
  }

  const handleDeleteOrg = async (postId: string) => {
    await deleteDoc(doc(firestore, "organizations", postId));
    setDeletedPostId(postId);
  };

  if (!posts) {
    return <div>Loading...</div>;
  }

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
        <strong>&lt;</strong> Back to Home
      </Button>
      <div className={styles.mainContent}>
        <div className={styles.currentOrgsBox}>
          {posts.map((post) => {
            return (
              <>
                <Card
                  key={post.id}
                  className={styles.org}
                  style={{ width: "18rem" }}
                >
                  <Card.Body>
                    <Card.Title>{post.name}</Card.Title>
                    <Card.Text>{post.desc}</Card.Text>
                    <Card.Text>
                      {memberships
                        .filter(
                          (membership: Membership) => post.id === membership.oid
                        )
                        .map((membership: Membership) => {
                          return users
                            .filter((user: User) => membership.uid === user.uid)
                            .map((user: User) => {
                              if(membership.title === "exec"){
                                return user.firstName + " " + user.lastName;
                              }
                            });
                        })}
                    </Card.Text>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary" onClick={() => joinOrg(post.id, post.name)}>Join</Button>
                    </ButtonGroup>
                  </Card.Body>
                </Card>
              </>
            );
          })}
        </div>
        <div className={styles.addOrgBox}>
          <h1>Start a New Organization</h1>
          <Form onSubmit={handleAddOrg}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Short Description </Form.Label>
              <Form.Control
                value={newOrgDesc}
                onChange={(e) => setNewOrgDesc(e.target.value)}
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

export default OrganizationsPage;
