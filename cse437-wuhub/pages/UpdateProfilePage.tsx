import { initializeApp } from 'firebase/app';
import { getAuth, updateProfile } from 'firebase/auth';
import { init_firebase } from '@/firebase/firebase-config';

export default function UpdateProfilePage() {

        // Initialize Firebase
        const firebase = init_firebase();
        const auth = getAuth();

    function updateProfile() {
        console.log("update profile initiaited");
        let displayName = (document.getElementById("display-name")! as HTMLInputElement).value;
        let profilePicURL = (document.getElementById("profile-pic-url")! as HTMLInputElement).value;
        console.log(displayName);
        console.log(profilePicURL);

        // updateProfile(auth.currentUser, {
        //     displayName: displayName, photoURL: profilePicURL
        // }).then(() => {
        //     // Profile updated!
        //     // ...
        // }).catch((error) => {
        //     // An error occurred
        //     // ...
        // });
    }

    return (
        <>
            <div className="header">
                Update Profile
            </div>

            <div className="update-profile-dialog-box">
                <p> Display Name </p>
                <input type="text" id="display-name" className="text-box" />
                <br></br>
                <p> Profile Pic URL </p>
                <input type="text" id="profile-pic-url" className="text-box" />
                <br></br>
                <button onClick={() => updateProfile()} className="btn"> Register </button>
                <br></br>
            </div>
        </>);
}