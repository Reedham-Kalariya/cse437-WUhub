// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, where, query, documentId } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { oid, uid } = req.body;
    
    try {

        // Create new edge: user & organization
        const q_memberships = await collection(firestore, "memberships");
        const mid = await addDoc(q_memberships, {
            "oid": oid,
            "uid": uid,
            "role": "member"
        })

        res.status(200).json({
            new_membership_at: mid
        });
    }
    catch (err) {
        res.status(404).end("An error occured while creating an organization-user edge.")
    }

}
