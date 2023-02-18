import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/router"
import { init_firebase } from '@/firebase/firebase-config';

// define the Student Dashboard functional component
export default function ProfilePage() {

    // Initialize Firebase
    const firebase = init_firebase(); // initialize the Firebase app
    const auth = getAuth(); // get the authentication object

    const router = useRouter();

    const backClick = () => {
        console.log("profile click");
        router.push('/StudentDashboard');
    }

    const updateClick = () => {
        console.log("update click");
        router.push('/UpdateProfilePage');
    }

    // render the Student Dashboard page
    return (
        <div>
            <button onClick={backClick} className="btn"> Back to Dashboard </button>
            <br></br>
            This is where we will display the user's profile.
            <br></br>
            <button onClick={updateClick} className="btn"> Update Profile </button>
        </div>
    );
}