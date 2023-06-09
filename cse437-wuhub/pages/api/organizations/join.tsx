// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, doc, getDoc, deleteDoc, collection, addDoc, getDocs, where, query, documentId } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";

const firestore = init_firebase_storage();

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

    const { oid, uid, type } = req.body;

    if (type == "delete") {
        return handleDelete(req, res);
    }

    try {

        // Create new edge: user & organization
        const q_memberships = await collection(firestore, "_memberships");
        await addDoc(q_memberships, {
            "oid": oid,
            "uid": uid,
            "role": "member"
        })

        res.status(200).json("success");
    }
    catch (err) {
        res.status(404).end("An error occured while creating an organization-user edge.")
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {

    try {

        const { oid, uid } = req.body;

        const docsRef = await query(collection(firestore, "_memberships"), where("uid", '==', uid), where("oid", '==', oid));

        const filtered_list: any[] = [];
        (await getDocs(docsRef)).forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            filtered_list.push(data);
            return;
        });

        const the_id = filtered_list[0].id;

        await deleteDoc(doc(firestore, "_memberships" + the_id));

        res.status(200).json("success");
    }
    catch (err) {
        res.status(404).end("An error occured while deleting an rsvp.")
    }
}
