// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

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

    const id = req.query.id as string;

    // Get document by ID
    const docRef = doc(firestore, "events/" + id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        data.start = data.start.toDate().toLocaleString();
        data.end = data.end.toDate().toLocaleString();

        res.status(200).json(data);
    } else {
        res.status(404).end("error");
    }

}


async function handlePost(req: NextApiRequest, res: NextApiResponse) {

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


async function handlePatch(req: NextApiRequest, res: NextApiResponse) {

}



async function handleDelete(req: NextApiRequest, res: NextApiResponse) {

}
