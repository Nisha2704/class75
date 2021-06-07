import firebase from '@firebase/app';
import '@firebase/util';
import '@firebase/logger';
import '@firebase/webchannel-wrapper';
require ('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBhAbotJNyXnHqWQLTbrpfFsHQlV8fSwLw",
    authDomain: "libraryapp-a3929.firebaseapp.com",
    projectId: "libraryapp-a3929",
    storageBucket: "libraryapp-a3929.appspot.com",
    messagingSenderId: "606437141021",
    appId: "1:606437141021:web:e442098ebb9fcadafb74f4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()