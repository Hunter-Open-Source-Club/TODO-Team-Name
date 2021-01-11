import admin from "firebase-admin";

// Initialize on GCP
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://syllabase-42.firebaseio.com",
});

export const db = admin.firestore();
