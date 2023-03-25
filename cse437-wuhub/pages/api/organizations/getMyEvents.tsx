// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, where, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Event } from "@/types";
const firebase = require('firebase/app');
require('firebase/firestore');

// How-to:
// to: name of collection
// field: field to check
// value: the value of that field
// - returns a list of organizations
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();

    let { uid } = req.body;


    // Get document by ID
    try {


        // Convert user to org
        const exec_orgs_list: string[] = [];
        const q_graph = query(collection(firestore, "_memberships"), 
            where("uid", '==', uid),
            where("role", '==', "exec")
        );

        (await getDocs(q_graph)).forEach((doc) => {
            const data = doc.data();
            exec_orgs_list.push(data.oid);
        });

        // Convert org to event
        const filtered_list: string[] = [];
        const q_graph2 = query(collection(firestore, "_hosts"), 
            where("oid", 'in', exec_orgs_list)
        );

        (await getDocs(q_graph2)).forEach((doc) => {
            const data = doc.data();
            filtered_list.push(data.eid);
        });

        // Get events of the user's exec organizations
        const result: any[] = [];
        const q_events = await query(collection(firestore, "events"), 
            where('__name__', 'in', filtered_list)
        );
        (await getDocs(q_events)).forEach((doc) => {
            const data = doc.data();
            data.eid = doc.id;
            data.start = data.start.toDate().toLocaleString();
            data.end = data.end.toDate().toLocaleString();

            result.push(data);
        });

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
