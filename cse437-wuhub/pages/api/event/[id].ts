// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id as string;
    
<<<<<<< HEAD
=======
    console.log(id);
>>>>>>> dev-branch
    const firestore = init_firebase_storage();

    // Get document by ID
    const docRef = doc(firestore, "events/" + id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        res.status(200).json(data);
    } else {
        res.status(404).end("error");
    }

}
