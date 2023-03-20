// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, collection, updateDoc, getDocs, where, query, documentId, Timestamp } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { 
        eid,
        name, 
        location,
        isPrivate,
        description,
        start,
        end,
        oid,
        tags, 
        uid 
    } = req.body;
    
    try {
        
        const startTime = Timestamp.fromMillis(Date.parse(start));
        const endTime = Timestamp.fromMillis(Date.parse(end));

        // Update document in events
        const q_event = doc(firestore, 'events/' + eid);
        await updateDoc(q_event, {
            "name": name,
            "location": location,
            "isPrivate": isPrivate,
            "description": description,
            "start": startTime,
            "end": endTime,
        })

        res.status(200).json(req.body);
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}
