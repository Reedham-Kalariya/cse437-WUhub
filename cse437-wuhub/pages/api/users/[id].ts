// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, getDoc, Timestamp, getDocs, query, collection, where, deleteDoc } from "firebase/firestore";
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
        default:
            return res.status(400).json({ error: "Invalid method" });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {

    const id = req.query.id as string;

    const docsRef = query(collection(firestore, "users"), where("uid", '==', id));
    
    const filtered_list: any[] = [];
    (await getDocs(docsRef)).forEach((doc) => {
        const data = doc.data();
        filtered_list.push(data);
        return;
    });

    if (filtered_list.length == 0) {
        res.status(404).json("No user found by the UID.");
    }

    res.status(200).json(filtered_list[0]);

}



