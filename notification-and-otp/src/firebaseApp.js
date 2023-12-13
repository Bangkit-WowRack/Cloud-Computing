// firebaseApp.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
    readFileSync(
        process.env.NODE_ENV !== "production"
            ? "./firebase-credential-cicd-cloudraya-app.json"
            : "/secret/app/firebase-credential-cicd-cloudraya-app.json",
    ),
);

const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "cicd-cloudraya-app",
});

export default firebase;
