// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, where, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import axios from "axios";
import { Event } from "@/types";
const firebase = require('firebase/app');
require('firebase/firestore');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();

    let { uid } = req.body;

    // Get document by ID
    try {

        const member_events: string[] = [];
        let q_graph = query(collection(firestore, "_rsvps"), where("uid", '==', uid));


        // Get events the user is a part of
        (await getDocs(q_graph)).forEach((doc) => {
            const data = doc.data();
            member_events.push(data.eid);
        });

        // Get all events
        let all_events: any[] = [];
        const postsCollection = query(collection(firestore, "events"));
        const postsQuerySnapshot = await getDocs(postsCollection);

        postsQuerySnapshot.forEach((doc) => {

            // Get Event
            const data = doc.data();
            data.eid = doc.id;
            data.start = data.start.toDate().toLocaleString();
            data.end = data.end.toDate().toLocaleString();

            all_events.push(data);

        });
        
        
        const result: any[] = [];
        all_events?.forEach((event) => {
            if (!member_events.includes(event.eid)) {
                result.push(event);
            }
        })

        res.status(200).json(result);

    }
    catch (err) {
        res.status(404).json({
            "message": "An error occured while fetching an graph to organizations.",
            "error": err,
            "body": req.body
        })
    }

}
