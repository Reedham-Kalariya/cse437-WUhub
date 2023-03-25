// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, addDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Organization } from "@/types";

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


    // Get document by ID
    try {
        const postsCollection = await query(collection(firestore, "organizations"));
        const postsQuerySnapshot = await getDocs(postsCollection);

        const postData: any[] = [];
        postsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.oid = doc.id;

            postData.push(data as Organization);
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

    const firestore = init_firebase_storage();
    const { name, description, tags, uid } = req.body;

    // Get document by ID
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
        const q_asso = await collection(firestore, "_links");
        tags.forEach((tag: any) => {
            addDoc(q_asso, {
                "tag_id": tag.id,
                "item_id": oid,
                "type": "organization"
            })
        })

        res.status(200).json({
            new_organization_at: oid,
            new_membership_at: mid
        });

    }
    catch {
        res.status(404).end("An error occured while creating an organization.")
    }

}
