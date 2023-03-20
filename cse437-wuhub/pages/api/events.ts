// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, query, limit, Timestamp } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();
    const { quantity } = req.body;

    // Get document by ID
    try {
        const postsCollection = await query(collection(firestore, "events"), limit(quantity));
        const postsQuerySnapshot = await getDocs(postsCollection);

        const postData = [];
        postsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.eid = doc.id;
            data.start = data.start.toDate().toLocaleString()
            data.end = data.end.toDate().toLocaleString()

            postData.push(data as Event);

        });

        res.status(200).json(postData);
    }
    catch (err) {
        res.status(404).json({
            "message": err
        });
    }

}
