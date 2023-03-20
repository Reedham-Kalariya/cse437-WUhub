// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, where, query, documentId } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { name } = req.body;
    
    try {
        
        // Create new document in organizations
        const q_organizations = await collection(firestore, "tags");
        const orgSnapshot = await addDoc(q_organizations, {
            "name": name,
        })
        const tid = orgSnapshot.id;

        res.status(200).json({
            new_tag_att: tid,
        });
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}
