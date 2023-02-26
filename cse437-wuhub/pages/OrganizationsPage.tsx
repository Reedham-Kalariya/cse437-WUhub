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
interface Organization {
    id: string;
    name: string;
}


interface Props {
    posts: Organization[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {

    const postsCollection = await collection(firestore, 'organizations');
    const postsQuerySnapshot = await getDocs(postsCollection);

    const postData: Organization[] = [];
    postsQuerySnapshot.forEach((doc) => {
        const data = doc.data();

        postData.push({
            id: doc.id,
            name: data.name,
        } as Organization);
    });

    return {
        props: { posts: postData },
    };
};

export default function OrganizationsPage({ posts }: Props) {

    const router = useRouter();

    const [deletedPostId, setDeletedPostId] = useState<string | null>(null);

    const backClick = () => {
        router.push('/StudentDashboard');
    }

    const handleDeletePost = async (postId: string) => {
        await deleteDoc(doc(firestore, 'organizations', postId));
        setDeletedPostId(postId);
    };

    if (!posts) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <button onClick={backClick} className="btn"> Back to Dashboard </button>
            <h1>Organizations</h1>
            {
                posts.map((post) => {
                    return (
                        <div key={post.id}>
                            <h2>{post.name}</h2>
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                            {deletedPostId === post.id && <p>Post deleted!</p>}
                        </div>
                    )
                })
            }
        </>
    );
};
