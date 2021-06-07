import firebase from '@firebase/app';
require ('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyBmEACDTJN0pAoYkyoiDxIUyY4E1epROrA",
  authDomain: "libraryapp-6b70c.firebaseapp.com",
  projectId: "libraryapp-6b70c",
  storageBucket: "libraryapp-6b70c.appspot.com",
  messagingSenderId: "728312990109",
  appId: "1:728312990109:web:32f2583f039078e62e8774"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()