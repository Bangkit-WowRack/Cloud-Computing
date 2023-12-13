import firebaseAdmin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
    readFileSync("../firebase-credential-cicd-cloudraya-app.json"),
);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const token = await firebaseAdmin
    .auth()
    .createCustomToken("cjbjebibdkhshevddjncdh");

console.log(token);
