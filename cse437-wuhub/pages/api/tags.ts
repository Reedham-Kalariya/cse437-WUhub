// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, limit, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Tag } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();

    // Get document by ID
    try {
        const postsCollection = await collection(firestore, "tags");
        const postsQuerySnapshot = await getDocs(postsCollection);

        const postData: Tag[] = [];
        postsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;

            postData.push(data as Tag);

        });

        res.status(200).json(postData);
    }
    catch {
        res.status(404).end("An error occured while fetching tags.")
    }

}
