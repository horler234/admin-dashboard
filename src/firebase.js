import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD4nAIQG4prMDSRU53RIbK7q6jT5-f0H9Y",
  authDomain: "bwsserver-a0e02.firebaseapp.com",
  databaseURL: "https://bwsserver-a0e02.firebaseio.com",
  projectId: "bwsserver-a0e02",
  storageBucket: "bwsserver-a0e02.appspot.com",
  messagingSenderId: "503550677556",
  appId: "1:503550677556:web:b6ec4b8ba3fb368519b061",
  measurementId: "G-JSQ3HTPYH0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// firebase.firestore();
// firebase.analytics();

// const firestore = firebase.firestore();
// const analytics = firebase.analytics();

export default firebase;
// export const auth = firebase.auth();
