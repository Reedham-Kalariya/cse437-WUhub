import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { init_firebase } from "@/firebase/firebase-config";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import { Header } from "@/components/header";

import { Event, Organization, User } from "@/types";


import styles from "../styles/dashboard.module.css";
import event_styles from "@/styles/EventsPage.module.css";



const StudentDashboard = (): JSX.Element => {

  // Router must be initialized first
  const router = useRouter();

  // Auth & Session Management
  const firebase = init_firebase();
  const auth = getAuth();

  let notFindingUserGate = false;
  const [user, setUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      // Finding & setting the user
      if (user) {
        setUser(auth.currentUser);
        notFindingUserGate = false;
        axios.get("/api/users/" + user?.uid).then((res) => {
          setProfile(res.data);
        }).catch((err) => {
          console.error(err);
        });
        return;
      }

      // Protected Page, must be signed in
      if (notFindingUserGate) {
        router.push('/unauthorized');
      }
      notFindingUserGate = true;


    });
    return () => {
      unsubscribe();
    }
  }, [auth]);
  // END OF Auth & Session Management


  // Get events
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    if (user) {
      axios.post("/api/events/notJoined/", {
        "uid": user?.uid
      }).then((res) => {
        setEvents(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [user]);



  // Get organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    if (user) {
      axios.post("/api/organizations/notJoined/", {
        "uid": user?.uid
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
    router.push('/dashboard');
  };


  const handleRSVP = (eid: string) => {
    axios.post("/api/events/rsvp", {
      uid: user?.uid,
      eid: eid
    });
    router.push('/dashboard');
  }

  const organizationsClick = () => {
    console.log("organization click");
    router.push("/organizations"); //check for the page name
  };

  const eventsClick = () => {
    console.log("events click");
    router.push("/events"); //check for the page name
  };

  // Event handlers
  const handleViewEvent = (eid: string) => {
    router.push("/event/" + eid);
  }
  const handleEditEvent = (eid: string) => {
    router.push("/event/edit/" + eid);
  }
  const handleDeleteEvent = (eid: string) => {
    axios.delete("/api/events/" + eid)
      .then((res) => {
        router.reload();
      })
      .catch((err) => {
        alert("Failed to delete the event.");
      })
  }
  const handleRSVPEvent = (eid: string) => {
    axios.post("/api/events/rsvp/", {
      "eid": eid,
      "uid": user?.uid
    })
      .then((res) => {
        router.push("/dashboard");
      })
      .catch((err) => {
        alert("Failed to delete the organization.");
      })
  }
  const handleUnRSVPEvent = (eid: string) => {
    axios.post("/api/events/rsvp/", {
      "eid": eid,
      "uid": user?.uid,
      "type": "delete"
    })
      .then((res) => {
        router.reload();
      })
      .catch((err) => {
        alert("Failed to delete the organization.");
      })
  }


  // Organization handles
  const handleViewOrganization = (oid: string) => {
    router.push("/organization/" + oid);
  }
  const handleEditOrganization = (oid: string) => {
    router.push("/organization/edit/" + oid);
  }
  const handleDeleteOrganization = (oid: string) => {
    axios.delete("/api/organizations/" + oid)
      .then((res) => {
        router.reload();
      })
      .catch((err) => {
        alert("Failed to delete the organization.");
      })
  }

  // render the Student Dashboard page
  return (
    <>

      <Header user={user} />

      <div className={styles.mainContent}>

        <h1>Discover</h1>

        <div className={styles.orgs}>

          {events.length != 0 && (
            <>
              <h3> More Events you may like...</h3>
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
                            <Button variant="primary" onClick={() => handleViewEvent(event.eid)}>View</Button>
                            <Button variant="secondary" onClick={() => handleRSVPEvent(event.eid)}>RSVP</Button>
                          </ButtonGroup>
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </>
          )}



          {organizations.length != 0 && (
            <>
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
                            <Button variant="primary" onClick={() => handleViewOrganization(post.oid)}>View</Button>
                            <Button variant="secondary" onClick={() => handleJoinOrg(post.oid)}>Join</Button>
                          </ButtonGroup>
                        </Card.Body>
                      </Card>
                    );
                  })}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default StudentDashboard;