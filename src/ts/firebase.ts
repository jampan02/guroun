import firebase from "firebase";
import "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messageingSenderId",
  appId: "appId",
  measurementId: "measurementId",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const storage = firebase.storage();
