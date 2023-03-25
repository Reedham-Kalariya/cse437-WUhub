// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, getDoc, Timestamp, updateDoc, query, collection, deleteDoc } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import axios from 'axios';

const firestore = init_firebase_storage();

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    switch (method) {
        case "GET":
            return handleGet(req, res);
        case "PUT":
            return handlePut(req, res);
        case "DELETE":
            return handleDelete(req, res);
        default:
            return res.status(400).json({ error: "Invalid method" });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {

    const eid = req.query.id as string;

    // Get document by ID
    const docRef = doc(firestore, "events/" + eid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        data.id = docSnap.id;
        data.start = data.start.toDate().toLocaleString();
        data.end = data.end.toDate().toLocaleString();

        res.status(200).json(data);
    } else {
        res.status(404).end("error");
    }

}



async function handlePut(req: NextApiRequest, res: NextApiResponse) {
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

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {

    const eid = req.query.id as string;

    try {

        await deleteDoc(doc(firestore, "events", eid));


        try {
            // Trim RSVP branches
            let event_org: any[] = [];
            await axios.post("/api/hosts/find", {
                "conditions": [
                    {
                        "field": "eid",
                        "value": eid
                    }
                ]
            }).then((res) => {
                event_org = res.data();
            }).catch((err) => {
                res.status(404).json("Error trimming host branches")
            });

            const org_count = event_org.length;
            event_org?.forEach((rsvp) => {
                deleteDoc(doc(firestore, "_hosts", rsvp.id));
            })


            // Trim RSVP branches
            let event_rsvps: any[] = [];
            await axios.post("/api/rsvps/find", {
                "conditions": [
                    {
                        "field": "eid",
                        "value": eid
                    }
                ]
            }).then((res) => {
                event_rsvps = res.data();
            }).catch((err) => {
                res.status(404).json("Error trimming rsvp branches")
            })

            const rsvps_count = event_rsvps.length;
            event_rsvps?.forEach((rsvp) => {
                deleteDoc(doc(firestore, "_rsvps", rsvp.id));
            })



            // Trim tag branches
            let event_tags: any[] = [];
            await axios.post("/api/tags/graph", {
                "to": "_links",
                "conditions": [
                    {
                        "field": "eid",
                        "value": eid
                    }
                ]
            }).then((res) => {
                event_tags = res.data();
            }).catch((err) => {
                res.status(404).json("Error trimming branches")
            })

            const tags_count = event_tags.length;
            event_tags?.forEach((rsvp) => {
                deleteDoc(doc(firestore, "_links", rsvp.id));
            })
        }
        catch (err) {
            res.status(404).json({
                "message": "Success, but error while trimming",
            })
        }


        res.status(200).json({
            "success": true
        });
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}
