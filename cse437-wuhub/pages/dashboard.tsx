import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { init_firebase } from "@/firebase/firebase-config";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import { Header } from "@/components/header";

import { Event, Organization } from "@/types";


import styles from "../styles/dashboard.module.css";
import event_styles from "@/styles/EventsPage.module.css";


// StudentDashboard
const StudentDashboard = (): JSX.Element => {

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


  // Get events
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    if (user) {
      axios.get("/api/events", {
        "params": {
          "quantity": "3"
        }
      }).then((res) => {
        setEvents(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);


  // Get organization where the user is exec
  const [execOrgs, setExecOrgs] = useState<Organization[]>([]);
  const [hasExecOrgs, setHasExecOrgs] = useState(false);
  useEffect(() => {
    if (user) {
      axios.post("/api/organizations/graph/", {
        "to": "_memberships",
        "conditions": [
          {
            "field": "uid",
            "value": user?.uid
          },
          {
            "field": "role",
            "value": "exec"
          }
        ]
      }).then((res) => {
        setExecOrgs(res.data);
        if (res.data.length > 0) {
          setHasExecOrgs(true);
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);



  // Get organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    if (user) {
      axios.post("/api/organizations/prompt/", {
        "to": "_memberships",
        "field": "uid",
        "value": user?.uid,
      }).then((res) => {
        setOrganizations(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);

  const handleJoinOrg = (oid: string) => {
    axios.post("/api/organizations/join", {
      uid: user?.uid,
      oid: oid,
      role: "member"
    });
    router.push('/organizations');
  };


  const router = useRouter();

  const organizationsClick = () => {
    console.log("organization click");
    router.push("/organizations"); //check for the page name
  };

  const eventsClick = () => {
    console.log("events click");
    router.push("/events"); //check for the page name
  };

  const handleViewEvent = (eid: string) => {
    router.push("/event/" + eid);
  }

  const handleViewOrganization = (oid: string) => {
    router.push("/organization/" + oid);
  }

  const handleEditOrganization = (oid: string) => {
    router.push("/organization/edit/" + oid);
  }

  // render the Student Dashboard page
  return (
    <>

      <Header user={user} />

      <div className={styles.mainContent}>

        <div className={styles.orgs}>
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
          <Button
            variant="primary"
            className={styles.btn}
            onClick={eventsClick}
          >
            Show All
          </Button>

          {hasExecOrgs && (
            <>
              <br /><br />
              <h3> My Organizations </h3>
              <div className={styles.card_container}>
                {execOrgs
                  .map((post) => {
                    return (
                      <Card
                        key={post.oid}
                        className={styles.org}
                        style={{ width: "18rem" }}
                      >
                        <Card.Body>
                          <Card.Title>{post.name}</Card.Title>
                          <Card.Text>{post.description}</Card.Text>
                          <ButtonGroup aria-label="Basic example">
                            <Button variant="primary" onClick={() => handleEditOrganization(post.oid)}>Edit</Button>
                            <Button variant="secondary" onClick={() => handleViewOrganization(post.oid)}>View</Button>
                          </ButtonGroup>
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
              <br /><br /></>
          )}

          <h3> Join a New Organization </h3>
          <div className={styles.card_container}>
            {organizations
              .map((post) => {
                return (
                  <Card
                    key={post.oid}
                    className={styles.org}
                    style={{ width: "18rem" }}
                  >
                    <Card.Body>
                      <Card.Title>{post.name}</Card.Title>
                      <Card.Text>{post.description}</Card.Text>
                      <ButtonGroup aria-label="Basic example">
                        <Button variant="secondary" onClick={() => handleViewOrganization(post.oid)}>View</Button>
                        <Button variant="secondary" onClick={() => handleJoinOrg(post.oid)}>Join</Button>
                      </ButtonGroup>
                    </Card.Body>
                  </Card>
                );
              })}
          </div>

          <ButtonGroup>
            <Button
              variant="primary"
              className={styles.btn}
              onClick={organizationsClick}
            >
              Show All
            </Button>
            <Button
              variant="secondary"
              onClick={() => { router.push("/organization/create") }}
            >
              Create
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;