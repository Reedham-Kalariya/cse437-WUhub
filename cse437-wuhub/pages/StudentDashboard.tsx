import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/router"
import { init_firebase } from '@/firebase/firebase-config';
import styles from '../styles/dashboard.module.css';

// define the Student Dashboard functional component
export default function StudentDashboard() {

    // Initialize Firebase
    const firebase = init_firebase(); // initialize the Firebase app
    const auth = getAuth(); // get the authentication object

    //function to get the three closest events and display
    const displayOrgs = () => {
        //TODO: access the organizations in firebase, grab 3ish and put them in the span
    }

    //function to get three organizations and dispaly
    const displayEvents = () => {
        //TODO: access the events in firebase, grab 3ish and put them in the span
    }

    const router = useRouter();

    const logoutClick = () => {
        auth.signOut().then(function() {
            console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });
          router.push('/');
    }

    const profileClick = () => {
        console.log("profile click");
        router.push('/ProfilePage');
    }

    const FormsClick = () => {
        console.log("update profile click");
        router.push('/FormsPage')
    }

    const resourcesClick = () => {
        console.log("register click");
        router.push('/ResourcesPage')
    }

    const organizationsClick = () => {
        console.log("update profile click");
        router.push('/OrganizationsPage') //check for the page name
    }

    const eventsClick = () => {
        console.log("update profile click");
        router.push('/EventsPage') //check for the page name
    }

    // render the Student Dashboard page
    return (
        <div className="container">
            <div className={styles.header_bar}>
                <button id="logout_btn" className={styles.btn} onClick={logoutClick}>Log Out</button>
                <button id="profile_btn" className={styles.btn} onClick={profileClick}>Profile</button>
                <button id="forms_btn" className={styles.btn} onClick={FormsClick}>Forms</button>
                <button id="res_and_pol_btn" className={styles.btn} onClick={resourcesClick}>Resources and Policies</button>
                <hr></hr>
            </div>
            <div>
                <span id="someOrgs"></span>
                <button className={styles.btn} onClick={organizationsClick}>Show All Organizations</button>
            </div>
            <div>
            <span id="someEvents"></span>
                <button className={styles.btn} onClick={eventsClick}>Show All Events</button>
            </div>
            {/* <div className="container">
                Put Contact Info Here
            </div> */}
        </div>
        );
}