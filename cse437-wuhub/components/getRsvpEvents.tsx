import { useRouter } from "next/router";
import React, { useState, useEffect, ReactElement } from "react";
import axios from "axios";
import { GetStaticProps, NextPage } from "next";


// Bootstrap
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";

// Images
import Image from "next/image";
import wuhub_logo from "@/resources/wuhub_logo.png";

// Props
type Props = {
    auth: any;
    user: any;
}

export const GetRsvpEventsBlock = (props) => {

    const router = useRouter();
    const [events, setEvents] = useState();
    const uid = props.user.uid;


    if (uid == null) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="header">
                <div className="headerLeft">
                    <Image src={wuhub_logo} alt="wuhub_logo" className="wuhubLogo" />
                </div>
                <span>{user?.email}</span>
                <div className="headerRight">
                    <div id="profile-button">
                        <ButtonGroup>
                            {auth.currentUser == null && (
                                <Button variant="secondary" id="logout_btn" onClick={loginClick}>
                                    Log In
                                </Button>
                            )}
                            {auth.currentUser != null && (
                                <Button variant="secondary" id="logout_btn" onClick={logoutClick}>
                                    Log Out
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                id="profile_btn"
                                onClick={profileClick}
                            >
                                Profile
                            </Button>
                            <Button
                                variant="secondary"
                                id="res_and_pol_btn"
                                onClick={resourcesClick}
                            >
                                Resources and Policies
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </>
    )
}