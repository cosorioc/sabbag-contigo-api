import "dotenv/config";
import { configDotenv } from "dotenv";

configDotenv({
  path: "../../.env",
});

import { initializeApp, getApps, cert } from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";

const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DB_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const realtimeDb = getDatabase(firebaseApp);
const bucket = getStorage(firebaseApp).bucket();

console.log("Firebase conectado correctamente");
console.log("Storage:", bucket.name);

export { firebaseApp, auth, db, realtimeDb, bucket };
