// import the Firebase app initialization function
import { init_firebase } from '@/firebase/firebase-config';
import { init_firebase_storage } from '@/firebase/firebase-storage-config';
import { useRouter } from "next/router"

// import the Firebase authentication SDK functions
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// import the Firebase Firebase Storage SDK functions
import { ref, getDownloadURL } from 'firebase/storage';

// Firestore
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

// define the LoginPage functional component
export default function LoginPage() {

    // initialize Firebase using the init_firebase function
    const firebase = init_firebase();

    //initialize Firebase storage
    const storage = init_firebase_storage();

    // get an instance of the Auth object from the Firebase authentication SDK
    const auth = getAuth();

    // initialize the user variable to null
    let user = null;

    const router = useRouter();

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
                router.push("/StudentDashboard")
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

    async function getImage() {
        // const citiesRef = collection(), "cities");
        const docRef = doc(storage, "events", "WILD");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(docRef)
            console.log(docSnap.data())
        } else {
            console.log("no document!");
        }



        // const pathRef = ref(storage, '/items_spritesheet.png');
        // getDownloadURL(pathRef)
        //     .then((url) => {
        //         console.log(url);
        //     })
        //     .catch((error) => {
        //         // A full list of error codes is available at
        //         // https://firebase.google.com/docs/storage/web/handle-errors
        //         switch (error.code) {
        //             case 'storage/object-not-found':
        //                 // File doesn't exist
        //                 break;
        //             case 'storage/unauthorized':
        //                 // User doesn't have permission to access the object
        //                 break;
        //             case 'storage/canceled':
        //                 // User canceled the upload
        //                 break;

        //             // ...

        //             case 'storage/unknown':
        //                 // Unknown error occurred, inspect the server response
        //                 break;
        //         }

        //     });
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
                <button className="btn" onClick={getImage}>testing firebase storage</button>

            </>
        );
    }
