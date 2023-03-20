// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, collection, addDoc, updateDoc, getDocs, where, query, documentId } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { oid, name, description } = req.body;
    
    try {

        // Update document in events
        const q_event = doc(firestore, 'events/' + oid);
        await updateDoc(q_event, {
            "name": name,
            "description": description,
        })

        res.status(200).json(true);
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}
