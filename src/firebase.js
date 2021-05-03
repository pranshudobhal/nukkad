import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAMHTv2ibJ_pNIVs-24OE6xqiwqVmbaOhw',
  authDomain: 'neog-nukkad.firebaseapp.com',
  projectId: 'neog-nukkad',
  storageBucket: 'neog-nukkad.appspot.com',
  messagingSenderId: '379984576252',
  appId: '1:379984576252:web:93df4b5244245ce35f2179',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
