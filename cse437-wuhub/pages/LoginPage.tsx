// import the Firebase app initialization function
import { init_firebase } from '@/firebase/firebase-config';

// import the Firebase authentication SDK functions
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// define the LoginPage functional component
export default function LoginPage() {

    // initialize Firebase using the init_firebase function
    const firebase = init_firebase();

    // get an instance of the Auth object from the Firebase authentication SDK
    const auth = getAuth();

    // initialize the user variable to null
    let user = null;

    // define the login function that gets called when the user clicks the "Login" button
    function login() {
        console.log("login initiatied")
        // get the user's email and password from the input fields
        let email = (document.getElementById("login-email")! as HTMLInputElement).value;
        let password = (document.getElementById("login-password")! as HTMLInputElement).value;
        console.log(email);
        console.log(password);

        // authenticate the user with Firebase using the signInWithEmailAndPassword function
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // if authentication is successful, update the user variable and display the user's authentication information in the DOM
                user = userCredential.user;
                console.log(user);
                document.getElementById("user-credential")!.innerHTML = JSON.stringify(user);
            }).catch((err) => {
                // if authentication fails, show an alert message depending on the error code returned by Firebase
                switch (err.code) {
                    case 'auth/invalid-email':
                        alert("Invalid email!")
                        break
                    case 'auth/user-not-found':
                        alert("Account does not exist. Please register")
                        break
                    case 'auth/wrong-password':
                        alert("Wrong Password!")
                        break
                }
                console.log(err.code);
                console.log(err.message);
            });
    }

    // render the login form and the temporary "User Info" section
    return (
        <>
            <div className="header">
                Login
            </div>
            <div className="login-dialog-box" id="login-window">
                <p> Email </p>
                <input type="text" id="login-email" className="text-box" />
                <br></br>
                <p> Password </p>
                <input type="password" id="login-password" className="text-box" />
                <br></br>
                <button onClick={() => login()} className="btn"> Login </button>
                <br></br>
            </div>

            <div className="temp-user-info">
                User Info (Temp)
                <p id="user-credential"> </p>
            </div>
        </>
    );
}
