import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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

// Session Details
let user;

function createNewUser() {
    
}

function login() {
    console.log("login initiatied")
    let username = (document.getElementById("login-username")! as HTMLInputElement).value;
    let password = (document.getElementById("login-password")! as HTMLInputElement).value;
    console.log(username);
    console.log(password);

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // signed in
            user = userCredential.user;
            console.log(user);
            document.getElementById("user-credential")!.innerHTML = JSON.stringify(user);
        }).catch((err) => {
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

function RegisterForm() {
    return (

        <div>
            test
        </div>

    )
}

export default function Login() {
    return (
        <>
            <div className="login-dialog-box" id="login-window">
                <button onClick={() => createNewUser()} className="btn"> Create Account </button>
                <p> Username </p>
                <input type="text" id="login-username" className="text-box" />
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
    )
}
