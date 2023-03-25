export interface Event {
    eid: string;
    name: string;
    location: string;
    isPrivate: boolean;
    description: string;
    start: string;
    end: string;
    oid: string;
    host_name: string;
    tags: any;
}

export interface RSVP {
    uid: string;
    eid: string;
}

// Expected database schema
export interface Organization {
    oid: string;
    name: string;
    description: string;
    tags: any;
}

// Expected database schema
export interface Membership {
    oid: string;
    uid: string;
    title: string;
    orgName: string;
}

// Expected database schema
export interface User {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
}

// Expected database schema
export interface Tag {
    id: string;
    name: string;
}