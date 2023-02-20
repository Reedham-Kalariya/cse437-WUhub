import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/router"
import { init_firebase } from '@/firebase/firebase-config';

// define the Student Dashboard functional component
export default function MakeEventPage() {

    // Initialize Firebase
    const firebase = init_firebase(); // initialize the Firebase app
    const auth = getAuth(); // get the authentication object

    const router = useRouter();

    const backClick = () => {
        router.push('/StudentDashboard');
    }    

    // render the Student Dashboard page
    return (
        <div>
            <button onClick={backClick} className="btn"> Back to Dashboard </button>
            <br></br>
        </div>
    );
}