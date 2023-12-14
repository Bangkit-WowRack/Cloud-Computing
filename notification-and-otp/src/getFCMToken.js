// import firebase from "./firebaseApp";
// import { getToken } from "firebase/messaging";

// const admin = firebase;
// const messaging = admin.auth().getMessaging();
// const token = getToken(messaging, {
//     vapidKey: "BCCBhlPQqkHgUqtfClnzmKlyBGiRQwVCgwUtdWXFanOiQkA",
// });

// console.log(token);

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCtQdCKUA91HOI2QRMhKMNrZAxOQcOXWXM",
    authDomain: "cicd-cloudraya-app.firebaseapp.com",
    projectId: "cicd-cloudraya-app",
    storageBucket: "cicd-cloudraya-app.appspot.com",
    messagingSenderId: "702578812917",
    appId: "1:702578812917:web:ff42056649153ada6fa2bc",
    measurementId: "G-CFYFWHXJBJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

const token = getToken(messaging, {
    vapidKey: "BCCBhlPQqkHgUqtfClnzmKlyBGiRQwVCgwUtdWXFanOiQkA",
});

console.log(token);
