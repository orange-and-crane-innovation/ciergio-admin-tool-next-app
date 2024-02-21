/* eslint-disable prettier/prettier */

import { initializeApp } from 'firebase/app';

import { getDatabase,  ref, set } from "firebase/database";

import serviceAccount from "./serviceAccountKey.json";

const firebaseConfig = {
    /* apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, */

    credential: serviceAccount,
    databaseURL: "https://mop-dev-ba75d-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

console.log("Firebase real-time database instantiated.")

/* class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }
    }

    database() {
        return app.database();
    }
}

export default Firebase; */
export { db, ref, set };