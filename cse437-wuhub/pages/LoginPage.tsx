// import { initializeApp } from 'firebase/app';
import { init_firebase } from '@/firebase/firebase-config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {

    // Initialize Firebase
    const firebase = init_firebase();
    const auth = getAuth();

    // Session Details
    let user = null;

    function login() {
        console.log("login initiatied")
        let email = (document.getElementById("login-email")! as HTMLInputElement).value;
        let password = (document.getElementById("login-password")! as HTMLInputElement).value;
        console.log(email);
        console.log(password);

        signInWithEmailAndPassword(auth, email, password)
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
        </>);
}