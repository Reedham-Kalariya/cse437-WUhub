// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, where, query, documentId } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { name, description, tags, uid } = req.body;
    
    try {
        
        // Create new document in organizations
        const q_organizations = await collection(firestore, "organizations");
        const orgSnapshot = await addDoc(q_organizations, {
            "name": name,
            "description": description,
        })
        const oid = orgSnapshot.id;

        // Create new edge: user (creator) & organization
        const q_memberships = await collection(firestore, "_memberships");
        const mid = await addDoc(q_memberships, {
            "oid": oid,
            "uid": uid,
            "role": "exec"
        })

        // _ASSOCIATIONS: Create new edge for each added tag
        const q_asso = await collection(firestore, "_tag_associations");
        tags.forEach((tag: any) => {
            addDoc(q_asso, {
                "tid": tag.id,
                "eid": oid,
                "type": "organization"
            })
        })

        res.status(200).json({
            new_organization_at: oid,
            new_membership_at: mid
        });
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}
