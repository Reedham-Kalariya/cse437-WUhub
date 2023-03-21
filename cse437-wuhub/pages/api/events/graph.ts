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

    const { to, conditions } = req.body;

    // Get document by ID
    try {

        const filtered_list: string[] = [];
        let q_graph;

        if (conditions.length == 1) {
            q_graph = query(collection(firestore, to), where(conditions[0]["field"], '==', conditions[0]["value"]));
        }
        else if (conditions.length == 2) {
            q_graph = query(collection(firestore, to),
                where(conditions[0]["field"], "==", conditions[0]["value"]),
                where(conditions[1]["field"], "==", conditions[1]["value"])
            );
        }
        else {
            res.status(404).end("Too many conditions were provided.");
            return;
        }

        // Get filtered list
        (await getDocs(q_graph)).forEach((doc) => {
            const data = doc.data();
            filtered_list.push(data.oid);
        });

        if (filtered_list.length == 0) {
            res.status(200).json([]);
        }

        // Get events
        const result: any[] = [];
        const q_events = await query(collection(firestore, "events"), where('__name__', 'in', filtered_list));
        (await getDocs(q_events)).forEach((doc) => {
            const data = doc.data();
            data.eid = doc.id;
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
