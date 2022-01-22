firebase.initializeApp({
    apiKey: "AIzaSyD8Kje7u2BzfBPtn7l7J6_5IcAuLvTTPnU",
    authDomain: "emoji-led.firebaseapp.com",
    projectId: "emoji-led",
    storageBucket: "emoji-led.appspot.com",
    messagingSenderId: "299910957994",
    appId: "1:299910957994:web:ee678c7016f47463aa79d3"
});

// Initialize Firebase
var db = firebase.firestore();
var dbRef = db.collection('emoji');



export { dbRef };
