// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, addDoc, collection, getDocs, query, limit, Timestamp } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

const firestore = init_firebase_storage();

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    switch (method) {
        case "POST":
            return handlePost(req, res);
        case "GET":
            return handleGet(req, res);
        default:
            return res.status(400).json({ error: "Invalid method" });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {

    let quantity = 100;
    if (req.query.quantity != undefined) {
        quantity = parseInt(req.query.quantity as string)
    }

    // Get document by ID
    try {
        const postsCollection = await query(collection(firestore, "events"), limit(quantity));
        const postsQuerySnapshot = await getDocs(postsCollection);

        const postData : any= [];
        postsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.eid = doc.id;
            data.start = data.start.toDate().toLocaleString()
            data.end = data.end.toDate().toLocaleString()

            postData.push(data as Event);

        });

        res.status(200).json(postData);
    }
    catch (err) {
        res.status(404).json({
            "message": err
        });
    }

}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {

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
        tags.forEach((tag : any) => {
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



