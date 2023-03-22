import { useRouter } from "next/router";
import { init_firebase_storage } from "../firebase/firebase-config";

// Bootstrap
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "@/styles/EventsPage.module.css";


// Images
import Image from "next/image";
import wuhub_logo from "@/resources/wuhub_logo.png";


export const Header = (user: any, back: string) => {

    const router = useRouter();

    const firestore = init_firebase_storage();

    const loginClick = () => {
        router.push("/login");
    }

    const execClick = () => {
        console.log("exec click");
        router.push("/ExecPage"); //check for the page name
    };

    const profileClick = () => {
        console.log("profile click");
        router.push("/profile");
    };

    const FormsClick = () => {
        console.log("forms click");
        router.push("/FormsPage");
    };

    const resourcesClick = () => {
        console.log("register click");
        router.push("/ResourcesPage");
    };

    const logoutClick = () => {
        router.push("/");
        // auth.signOut().then(
        //   function () {
        //     console.log("Signed Out");
        //     router.push("/");
        //   },
        //   function (error) {
        //     console.error("Sign Out Error", error);
        //   }
        // );
    };

    const handleBackClick = () => {
        router.push(back)
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
                            {user == null && (
                                <Button variant="secondary" id="logout_btn" onClick={loginClick}>
                                    Log In
                                </Button>
                            )}
                            {user != null && (
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

            {back != null && (
            <Button
                variant="secondary"
                onClick={handleBackClick}
                className={styles.backToLandingBtn}
            >
                <strong>&lt;</strong> Back to Home
            </Button>
            )}
        </>
    )
}