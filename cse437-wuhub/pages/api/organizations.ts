// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Organization } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { quantity } = req.body;

    // Get document by ID
    try {
        const postsCollection = await query(collection(firestore, "organizations"), limit(quantity));
        const postsQuerySnapshot = await getDocs(postsCollection);

        const postData: Organization[] = [];
        postsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.oid = doc.id;

            postData.push(data as Organization);

        });

        res.status(200).json(postData);
    }
    catch {
        res.status(404).end("An error occured while fetching organizations.")
    }

}
