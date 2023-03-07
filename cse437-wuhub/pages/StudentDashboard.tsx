import { initializeApp } from 'firebase/app';
import { GetStaticProps, NextPage } from 'next';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/router"
import { init_firebase } from '@/firebase/firebase-config';
import { init_firebase_storage } from '../firebase/firebase-storage-config';
import { getFirestore, collection, limit, query, Firestore, addDoc, getDoc, getDocs, deleteDoc, doc, Timestamp, DocumentReference } from 'firebase/firestore';
import styles from '../styles/dashboard.module.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

// Expected database schema
interface Organization {
    id: string;
    name: string;
}


// Expected database schema
interface Events {
    id: string;
    title: string;
}

interface Props {
    posts: Organization[];
    events: Events[];
}



export const getStaticProps: GetStaticProps<Props> = async () => {

    const postsCollection = await collection(firestore, 'organizations');
    const postsQuerySnapshot = await getDocs(postsCollection);

    const postData: Organization[] = [];
    postsQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        if(postData.length < 3){
            if(data.name !== ""){
                postData.push({
                    id: doc.id,
                    name: data.name,
                } as Organization);
            }
            
        }        
    });

    const postsCollectionEvents = await collection(firestore, 'events');
    const postsQuerySnapshotEvents = await getDocs(postsCollectionEvents);

    const postDataEvents: Events[] = [];
    postsQuerySnapshotEvents.forEach((doc) => {
        const data = doc.data();
        if(postDataEvents.length < 3){
            if(data.title !== ""){
                postDataEvents.push({
                    title: data.title
                } as Events);
            }
            
        }        
    });



    return {
        props: { posts: postData, events: postDataEvents },
    };
};

// define the Student Dashboard functional component
const StudentDashboard = ({ posts, events }: Props): JSX.Element => {

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
        console.log("forms click");
        router.push('/FormsPage')
    }

    const resourcesClick = () => {
        console.log("register click");
        router.push('/ResourcesPage')
    }

    const organizationsClick = () => {
        console.log("organization click");
        router.push('/OrganizationsPage') //check for the page name
    }

    const eventsClick = () => {
        console.log("events click");
        router.push('/EventsPage') //check for the page name
    }

    const execClick = () => {
        console.log("exec click");
        router.push('/ExecPage') //check for the page name
    }

    if (!posts) {
        return (
            <div className="container">
                Loading Organizations....
            </div>
            );
    }


    // render the Student Dashboard page
    return (
        <div className="container">
            <div className={styles.header_bar}>
                <button id="logout_btn" className={styles.btn} onClick={logoutClick}>Log Out</button>
                <button id="profile_btn" className={styles.btn} onClick={profileClick}>Profile</button>
                <button id="forms_btn" className={styles.btn} onClick={FormsClick}>Forms</button>
                <button id="res_and_pol_btn" className={styles.btn} onClick={resourcesClick}>Resources and Policies</button>
                <button id="exec_btn" className={styles.btn} onClick={execClick}>Switch to Exec View</button>
                <hr></hr>
            </div>
            <br></br>
            <br></br>
            <div className={styles.orgs}>
                {
                    posts.filter(post => post.name !== "").map((post) => {
                        return (
                            <div key={post.id} className={styles.col}>
                            <h2>{post.name}</h2>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.orgs}>
                {
                    events.filter(events => events.title !== "").map((events) => {
                        return (
                            <div className={styles.col}>
                            <h2>{events.title}</h2>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <button className={styles.btn} onClick={organizationsClick}>Show All Organizations</button>
            </div>
            <div>
            <br></br>
            <br></br>
            <span id="someEvents"></span>
                <button className={styles.btn} onClick={eventsClick}>Show All Events</button>
            </div>
            {/* <div className="container">
                Put Contact Info Here
            </div> */}
            
        </div>
        );
}

export default StudentDashboard;