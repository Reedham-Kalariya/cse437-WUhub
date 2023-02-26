import React, { useState, useEffect, ReactElement } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { initializeApp } from 'firebase/app';
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { init_firebase } from '@/firebase/firebase-config';
import { init_firestore } from '../firebase/firebase-config';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, Firestore, getDoc, getDocs, deleteDoc, doc, Timestamp, DocumentReference } from 'firebase/firestore';

const firebase = init_firebase(); // initialize the Firebase app
const auth = getAuth(); // get the authentication object
const firestore = init_firestore();

// Expected database schema
interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    organization: string;
}

interface Organization {
    name: string;
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
            start: data.start.toDate().toISOString(),
            end: data.end.toDate().toISOString(),
            organization: data.organization,
        } as Event);
    });

    return {
        props: { posts: postData },
    };
};

export default function EventsPage({ posts }: Props) {

    const router = useRouter();

    const backClick = () => {
        router.push('/StudentDashboard');
    }

    const [deletedPostId, setDeletedPostId] = useState<string | null>(null);

    const handleDeletePost = async (postId: string) => {
        await deleteDoc(doc(firestore, 'events', postId));
        setDeletedPostId(postId);
    };

    if (!posts) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <button onClick={backClick} className="btn"> Back to Dashboard </button>
            <h1>Events</h1>
            {
                posts.map((post) => {
                    return (
                        <div key={post.id}>
                            {console.log(post)}
                            <h2>{post.title}</h2>
                            <p>{post.start}</p>
                            <p>{post.end}</p>
                            <p>{post.organization}</p>
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                            {deletedPostId === post.id && <p>Post deleted!</p>}
                        </div>
                    )
                })
            }
        </>
    );
};
