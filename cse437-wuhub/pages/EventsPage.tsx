import React, { useState, useEffect, ReactElement } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { initializeApp } from 'firebase/app';
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { init_firebase } from '@/firebase/firebase-config';
import { init_firebase_storage } from '../firebase/firebase-config';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, Firestore, addDoc, getDoc, getDocs, deleteDoc, doc, Timestamp, DocumentReference } from 'firebase/firestore';


const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firebase_storage();

// Expected database schema
interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
}


interface Props {
    posts: Event[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {

    const postsCollection = await collection(firestore, 'events');
    const postsQuerySnapshot = await getDocs(postsCollection);

    const postData: Event[] = [];
    postsQuerySnapshot.forEach((doc) => {
        const data = doc.data();

        postData.push({
            id: doc.id,
            title: data.title,
            start: data.start,
            end: data.end,
        } as Event);
    });

    return {
        props: { posts: postData },
    };
};

const EventsPage = ({ posts }: Props): JSX.Element => {

    const router = useRouter();
    const [deletedPostId, setDeletedPostId] = useState<string | null>(null);
    const [newEventName, setNewEventName] = useState('');
    const [newEventStart, setNewEventStart] = useState('');
    const [newEventEnd, setNewEventEnd] = useState('');

    const backClick = () => {
        router.push('/StudentDashboard');
    }

    const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const eventCollection = collection(firestore, 'events');
        await addDoc(eventCollection, {
            title: newEventName,
            start: newEventStart,
            end: newEventEnd
        });
        setNewEventName('');
        setNewEventStart('');
        setNewEventEnd('');
        router.push('/EventsPage');
    };

    const handleDeleteEvent = async (postId: string) => {
        await deleteDoc(doc(firestore, 'events', postId));
        setDeletedPostId(postId);
        router.push('/EventsPage');
    };


    if (!posts) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <button onClick={backClick} className="btn"> Back to Dashboard </button>
            <h1>Events</h1>
            <form onSubmit={handleAddEvent}>
                <label>
                    New Event Title:
                    <input
                        type="text"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                    />
                </label>
                <label>
                    New Event Start Time:
                    <input
                        type="text"
                        value={newEventStart}
                        onChange={(e) => setNewEventStart(e.target.value)}
                    />
                </label>
                <label>
                    New Event End Time:
                    <input
                        type="text"
                        value={newEventEnd}
                        onChange={(e) => setNewEventEnd(e.target.value)}
                    />
                </label>
                <button type="submit">Add Event</button>
            </form>
            {
                posts.map((post) => {
                    return (
                        <div key={post.id}>
                            <h2>{post.title}</h2>
                            <button onClick={() => handleDeleteEvent(post.id)}>Delete</button>
                            {deletedPostId === post.id && <p>Post deleted!</p>}
                        </div>
                    )
                })
            }
        </>
    );
};

export default EventsPage;
