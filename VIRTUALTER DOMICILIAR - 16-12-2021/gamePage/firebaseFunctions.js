// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB0nvap7srcgw5iA9PzBOabxJ-IPOo36Kg",
    authDomain: "virtualter-web.firebaseapp.com",
    databaseURL: "https://virtualter-web-default-rtdb.firebaseio.com",
    projectId: "virtualter-web",
    storageBucket: "virtualter-web.appspot.com",
    messagingSenderId: "379856766015",
    appId: "1:379856766015:web:0d4a801714683cd8f1a48a",
    measurementId: "G-0BHD7LC4PN"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const database = firebase.database();

// const userDataRefTest = database.ref().child('users').child('gxb1vXqVpdU7uiFnSKOI8yO3byJ2').get()
//     userDataRefTest
//         .then((snapshot) => {
//             if(snapshot.exists()){
//                 console.log(snapshot.val());
//             }
//             else{
//                 console.log('No data')
//             }
//         })
