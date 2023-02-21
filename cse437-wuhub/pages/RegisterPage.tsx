import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { init_firebase } from '@/firebase/firebase-config';
import { useRouter } from "next/router"

// define the RegisterPage functional component
export default function RegisterPage() {

    // Initialize Firebase
    const firebase = init_firebase(); // initialize the Firebase app
    const auth = getAuth(); // get the authentication object
    const router = useRouter(); // use routes

    function register() {
        console.log("register initiaited"); // log that registration is being initiated
        let email = (document.getElementById("register-email")! as HTMLInputElement).value; // get the email entered by the user
        let password = (document.getElementById("register-password")! as HTMLInputElement).value; // get the password entered by the user
        console.log(email); // log the email
        console.log(password); // log the password

        // Create User with Email and Password
        createUserWithEmailAndPassword(auth, email, password) // create a user with email and password using the Firebase authentication object
            .then(() => {
                alert("Successfully registered! Please log in."); // alert the user that registration was successful
                router.push('/LoginPage');
            })
            .catch((err) => {
                // Handle Errors here.
                console.log(err.code); // log the error code
                console.log(err.message); // log the error message

                switch (err.code) {
                    case 'auth/invalid-email':
                        alert("Invalid email!") // alert the user that the email is invalid
                        break
                    case 'auth/email-already-in-use':
                        alert("Email already in use!") // alert the user that the email is already in use
                        break
                }
            });
    }

    // render the register form
    return (
        <>
            <div className="header">
                Register
            </div>

            <div className="register-dialog-box">
                <p> Email </p>
                <input type="text" id="register-email" className="text-box" /> // input field for email
                <br></br>
                <p> Password </p>
                <input type="password" id="register-password" className="text-box" /> // input field for password
                <br></br>
                <button onClick={() => register()} className="btn"> Register </button> // button to trigger registration
                <br></br>
            </div>
        </>);
}
