// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore, doc, getDoc, collection, getDocs, where, query } from "firebase/firestore";
import { init_firebase, init_firebase_storage } from "@/firebase/firebase-config";
import { Event } from "@/types";
import axios from "axios";
const firebase = require('firebase/app');
require('firebase/firestore');


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const firestore = init_firebase_storage();

    let { to, mode, conditions } = req.body;

    if (mode == "discover") {
        mode = '!='
    }
    else {
        mode = '=='
    }

    try {

        // Initiate variables
        const filtered_list: string[] = [];
        let q_graph;

        
        if (conditions.length == 1) {
            q_graph = query(collection(firestore, to), where(conditions[0]["field"], mode, conditions[0]["value"]));
        }
        else if (conditions.length == 2) {
            q_graph = query(collection(firestore, to),
                where(conditions[0]["field"], mode, conditions[0]["value"]),
                where(conditions[1]["field"], mode, conditions[1]["value"])
            );
        }
        else {
            res.status(404).end("Too many conditions were provided.");
            return;
        }
        
        (await getDocs(q_graph)).forEach((doc) => {
            const data = doc.data();
            filtered_list.push(data.eid);
        });
        
        if (filtered_list.length == 0) {
            res.status(200).json([]);
        }

        const result: any[] = [];
        const q_events = await query(collection(firestore, "events"), 
            where('__name__', 'in', filtered_list)
        );
        (await getDocs(q_events)).forEach(async (doc) => {

            // Get data add
            const data = doc.data();
            data.eid = doc.id;
            data.start = data.start.toDate().toLocaleString();
            data.end = data.end.toDate().toLocaleString();

            result.push(data);
            // // Get organization
            // let org;
            // await axios.post("/api/events/getHost/", {
            //     "eid": data.eid
            // }).then((res) => {
            //     org = res.data;

            //     result.push({
            //         "event": data,
            //         "host": org
            //     });
            // })
            
        });

        res.status(200).json(result);

    }
    catch (err) {
        res.status(404).json({
            "message": "An error occured while fetching a graph to organizations.",
            "error": err,
            "body": req.body
        })
    }

}
