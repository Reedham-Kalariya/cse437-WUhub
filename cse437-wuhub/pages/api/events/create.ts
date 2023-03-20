// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, where, query, documentId, Timestamp } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { 
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
        
        // Create new document in events
        const q_events = await collection(firestore, "events");
        const eventSnapshot = await addDoc(q_events, {
            "name": name,
            "location": location,
            "isPrivate": isPrivate,
            "description": description,
            "start": startTime,
            "end": endTime,
        })
        const eid = eventSnapshot.id;


        // _HOSTED: Create new edge: event to the organization
        const q_hosts = await collection(firestore, "_hosts");
        await addDoc(q_hosts, {
            "oid": oid,
            "eid": eid,
        })

        // _RSVPS: Create new edge: the creator immidiately is signed up to attend the event
        const q_rsvps = await collection(firestore, "_rsvps");
        await addDoc(q_rsvps, {
            "oid": oid,
            "eid": eid,
        })

        // _ASSOCIATIONS: Create new edge for each added tag
        const q_asso = await collection(firestore, "_tag_associations");
        tags.forEach((tag) => {
            addDoc(q_asso, {
                "tid": tag.id,
                "eid": eid,
                "type": "event"
            })
        })

        res.status(200).json({
            "new_event_at": eid
        });
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}
