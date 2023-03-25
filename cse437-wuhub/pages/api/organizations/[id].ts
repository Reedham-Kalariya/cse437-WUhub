// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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

async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const oid = req.query.id as string;

    console.log(oid);
    const firestore = init_firebase_storage();

    // Get document by ID
    const docRef = doc(firestore, "organizations/" + oid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        res.status(200).json(data);
    } else {
        res.status(404).end("error");
    }

}

async function handlePut(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const oid = req.query.id as string;
        const { name, description } = req.body;

        // Get document by ID
        const docRef = doc(firestore, "organizations/" + oid);
        await updateDoc(docRef, {
            "name": name,
            "description": description,
        })

        res.status(200).json("success");
    }
    catch {
        res.status(404).end("error");
    }

}


async function handleDelete(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const oid = req.query.id as string;

        await deleteDoc(doc(firestore, "organizations", oid));


        // Trim memberships
        let q_memberships: any[] = [];
        axios.post("/api/organizations/graph/", {
            "to": "_memberships",
            "conditions": [
                {
                    "field": "oid",
                    "value": oid
                }
            ]
        }).then((res) => {
            q_memberships = res.data;
        }).catch((err) => {
            console.error(err);
        });

        const mem_count = q_memberships.length;
        q_memberships?.forEach((membership) => {
            deleteDoc(doc(firestore, "_memberships", membership.id));
        })



        // Trim link tags
        let q_tags: any[] = [];
        axios.post("/api/tags/graph/", {
            "to": "_links",
            "conditions": [
                {
                    "field": "item_id",
                    "value": oid
                }
            ]
        }).then((res) => {
            q_tags = res.data;
        }).catch((err) => {
            console.error(err);
        });

        const link_count = q_tags.length;
        q_tags?.forEach((tag) => {
            deleteDoc(doc(firestore, "_links", tag.id));
        })


        res.status(200).json({
            success: true,
            memberships_trimmed: mem_count,
            tag_links_trimmed: link_count
        });

    }
    catch {
        res.status(404).end("error");
    }

}
