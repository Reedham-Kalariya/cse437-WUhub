// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, where, query, documentId } from "firebase/firestore";
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

    const { to, field, value, type, type_value } = req.body;

    // Get document by ID
    try {
        
        const filtered_list: string[] = [];
        let q_graph;

        if (type == null || type_value == null) {
            console.log("Single way...");
            q_graph = query(collection(firestore, to), where(field, '==', value));
        }
        else {
            q_graph = query(collection(firestore, to),
                where(field, "==", value),
                where(type, "==", type_value)
            );
            
        }

        // Get filtered list
        (await getDocs(q_graph)).forEach((doc) => {
            const data = doc.data();
            filtered_list.push(data.eid);
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
            data.start = data.start.toDate().toLocaleString();
            data.end = data.end.toDate().toLocaleString();

            result.push(data);
        });

        res.status(200).json(result);

    }
    catch (err) {
        res.status(404).end("An error occured while fetching an graph to events.")
    }

}
