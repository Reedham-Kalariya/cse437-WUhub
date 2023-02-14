import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterPage() {

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyDo1xAtUPq12Mfxc9KJyAafGLbH_o-Wyfk",
        authDomain: "cse437-wuhub.firebaseapp.com",
        projectId: "cse437-wuhub",
        storageBucket: "cse437-wuhub.appspot.com",
        messagingSenderId: "404778634504",
        appId: "1:404778634504:web:3d87268e15b68c3a4e30bd",
        measurementId: "G-ZPCL9Q4QED"
    };

    // Initialize Firebase
    const firebase = initializeApp(firebaseConfig);
    const auth = getAuth(firebase);

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