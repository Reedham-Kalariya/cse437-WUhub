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

    let { conditions } = req.body;

    // Get document by ID
    try {

        let q_filter;

        if (conditions.length == 1) {
            q_filter = query(collection(firestore, "_rsvps"), where(conditions[0]["field"], '==', conditions[0]["value"]));
        }
        else if (conditions.length == 2) {
            q_filter = query(collection(firestore, "_rsvps"),
                where(conditions[0]["field"], '==', conditions[0]["value"]),
                where(conditions[1]["field"], '==', conditions[1]["value"])
            );
            
        }
        else {
            res.status(404).end("Too many conditions were provided.");
            return;
        }
        // Get events
        const result: any[] = [];
        (await getDocs(q_filter)).forEach((doc) => {
            result.push(doc.id);
        });

        res.status(200).json(result);

    }
    catch (err) {
        res.status(404).json({
            "message": "An error occured while finding rsvp files.",
            "error": err,
            "body": req.body
        })
    }

}
