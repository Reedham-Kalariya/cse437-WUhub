// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, where, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import axios from "axios";
import { Event } from "@/types";
const firebase = require('firebase/app');
require('firebase/firestore');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();

    let { uid } = req.body;

    // Get document by ID
    try {

        const member_orgs: string[] = [];
        let q_graph = query(collection(firestore, "_memberships"), where("uid", '==', uid));


        // Get groups the user is a part of
        (await getDocs(q_graph)).forEach((doc) => {
            const data = doc.data();
            member_orgs.push(data.oid);
        });

        // Get all orgs
        let all_orgs: any[] = [];
        const postsCollection = await query(collection(firestore, "organizations"));
        const postsQuerySnapshot = await getDocs(postsCollection);

        postsQuerySnapshot.forEach((doc) => {
            const data = doc.data();
            data.oid = doc.id;

            all_orgs.push(data);
        });
        
        
        const result: any[] = [];
        all_orgs?.forEach((org) => {
            if (!member_orgs.includes(org.oid)) {
                result.push(org);
            }
        })

        res.status(200).json(result);

    }
    catch (err) {
        res.status(404).json({
            "message": "An error occured while fetching an graph to organizations.",
            "error": err,
            "body": req.body
        })
    }

}
