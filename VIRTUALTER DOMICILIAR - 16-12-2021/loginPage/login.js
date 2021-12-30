import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB0nvap7srcgw5iA9PzBOabxJ-IPOo36Kg",
    authDomain: "virtualter-web.firebaseapp.com",
    projectId: "virtualter-web",
    storageBucket: "virtualter-web.appspot.com",
    messagingSenderId: "379856766015",
    appId: "1:379856766015:web:0d4a801714683cd8f1a48a",
    measurementId: "G-0BHD7LC4PN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        //const uid = user.uid;
        // ...
        document.getElementById('user-div').style.display = 'block';
        document.getElementById('login-div').style.display = 'none';
        //window.location = "../../gamePage/index.html";

        if(user != null){
            let emailId = user.email;
            document.getElementById('user-param').innerHTML = `Welcome user: ${emailId}`;
        }
    } else {
        // User is signed out
        // ...
        document.getElementById('user-div').style.display = 'none';
        document.getElementById('login-div').style.display = 'block';
    }
});

const Login = () => {
    let userEmail = document.getElementById('email_field').value;
    let userPass = document.getElementById('password_field').value;

    signInWithEmailAndPassword(auth, userEmail, userPass)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            window.alert(`Error: ${errorMessage}`);
        });   
}
    document.getElementById ("login-button").addEventListener ("click", Login);

const Logout = () => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            window.alert('Sign out successful');
        })
        .catch((error) => {
            // An error happened.
            window.alert(`Error: ${error.message}`);
        });
}
    document.getElementById ("logout-button").addEventListener ("click", Logout);