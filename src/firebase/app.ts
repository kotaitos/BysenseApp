import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAv1ThhbZo9GkjBNoKGfhHZalo0Uby-5Ew",
    authDomain: "bicycle-supporter.firebaseapp.com",
    projectId: "bicycle-supporter",
    storageBucket: "bicycle-supporter.appspot.com",
    messagingSenderId: "879836047331",
    appId: "1:879836047331:web:c9427267150ead733e22d6",
    measurementId: "G-W3VT1BKM6S"
};
  
try {
firebase.initializeApp(firebaseConfig);
} catch (error) {
console.log(error);
throw error;
}

export default firebase;
