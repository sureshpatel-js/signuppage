import firebase from "firebase"
import "firebase/storage"

const app =  firebase.initializeApp({
    "projectId": "hammoqtask",
    "appId": "1:913064395825:web:46b94eaf5357115736c110",
    "storageBucket": "hammoqtask.appspot.com",
    "locationId": "us-central",
    "apiKey": "AIzaSyCiiWY27yAZSzc-FbtV9qavHfSHlaMIs58",
    "authDomain": "hammoqtask.firebaseapp.com",
    "messagingSenderId": "913064395825",
    "measurementId": "G-H7NRKTT1ES"
  });

  export default app;