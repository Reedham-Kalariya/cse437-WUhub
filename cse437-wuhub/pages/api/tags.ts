// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, addDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Tag } from "@/types";

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
        const postsCollection = await collection(firestore, "tags");
        const postsQuerySnapshot = await getDocs(postsCollection);

        const postData: any[] = [];
        postsQuerySnapshot.forEach((tag) => {
            const data = tag.data();
            data.id = tag.id;

            postData.push(data as Tag);
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

    const { name } = req.body;
    
    try {

        // Create new document in tags
        const q_tags = await collection(firestore, "tags");
        const eventSnapshot = await addDoc(q_tags, {
            "name": name
        })
        const id = eventSnapshot.id;

        res.status(200).json({
            "new_tag_at": id
        });
    }
    catch (err) {
        res.status(404).end(req.body)
    }

}



