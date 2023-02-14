import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { init_firebase } from '@/firebase/firebase-config';

export default function RegisterPage() {

    // Initialize Firebase
    const firebase = init_firebase();
    const auth = getAuth();

    function register() {
        console.log("register initiaited");
        let email = (document.getElementById("register-email")! as HTMLInputElement).value;
        let password = (document.getElementById("register-password")! as HTMLInputElement).value;
        console.log(email);
        console.log(password);

        //Create User with Email and Password
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Successfully registered! Please log in.")
            })
            .catch((err) => {
                // Handle Errors here.
                console.log(err.code);
                console.log(err.message);

                switch (err.code) {
                    case 'auth/invalid-email':
                        alert("Invalid email!")
                        break
                    case 'auth/email-already-in-use':
                        alert("Email already in use!")
                        break
                }
            });
    }

    return (
        <>
            <div className="header">
                Register
            </div>

            <div className="register-dialog-box">
                <p> Email </p>
                <input type="text" id="register-email" className="text-box" />
                <br></br>
                <p> Password </p>
                <input type="password" id="register-password" className="text-box" />
                <br></br>
                <button onClick={() => register()} className="btn"> Register </button>
                <br></br>
            </div>
        </>);
}