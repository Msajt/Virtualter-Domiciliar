// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//! =================================================================================
//! ||                            CONFIG. DO FIREBASE                              ||
//! =================================================================================
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase();

//! =================================================================================
//! ||                              REGISTRAR USUÁRIO                              ||
//! =================================================================================

const Register = () => {
    //? Coletar o email, senha e tipo de usuário
    let userEmail = document.getElementById('register-email').value;
    let userPassword = document.getElementById('register-password').value;
    let userType = document.getElementById('register-userType').value;
    
    //? Registrar no autenticador
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            const dbUserID = userCredential.user.uid;
            const dbUserEmail = userCredential.user.email;
            const dbUserType = userType;

            //? Registrar no banco de dados
            InsertData(dbUserID, dbUserEmail, dbUserType);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(`Houve um problema ao cadastrar o usuário:\n${errorCode}\n\n${errorMessage}`);
        });
}

    //? =================================================================================
    //? ||                         INSERIR DADOS PARA REGISTRO                         ||
    //? =================================================================================

const InsertData = (userId, userEmail, userType) => {
    //? Pegando os dados da criação de usuário do 'auth' e adicionando no banco de dados
    set(ref(database, `users/${userId}`), {
        email: userEmail,
        userType: userType,
        games: [0],
        gamesPlayed: 0,
        totalPoints: 0,
        totalTime: 0,
        totalCoins: 0,
        totalCollisions: 0,
        totalPrecision: 0
    })
        .then(() => {
            alert(`${userEmail} foi cadastrado com sucesso`);

            //TODO Encaminhar para a página de 'Login'
            //? Limpando os dados
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            window.location = './index.html';
        })
        .catch((error)=> {
            const errorCode = error.code;
            const errorMessage = error.message;
            const delUser = auth.currentUser;

            alert(`Houve um problema ao cadastrar no banco de dados:\n${errorCode}\n\n${errorMessage}`);

            //? Deleta usuário caso houver um erro na criação do banco de dados
            deleteUser(delUser);
        });
}

    //? Verificando se a página é a 'register.html' (registro)
    //if(window.location.pathname == '/Virtualter-Domiciliar/register.html') document.getElementById('register-button').addEventListener ("click", Register);
    if(window.location.pathname == '/register.html') document.getElementById('register-button').addEventListener ("click", Register);

//! =================================================================================
//! ||                             LOGIN DO USUÁRIO                                ||
//! =================================================================================

const Login = () => {
    //? Coletar o email e senha
    let userEmail = document.getElementById('login-email').value;
    let userPassword = document.getElementById('login-password').value;

    //? Verificando no autenticador e encaminhar pra página do jogo/dados
    signInWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            //TODO Encaminhar para a página
            window.location = './gamePage/index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(`Houve um problema ao logar o usuário:\n${errorCode}\n\n${errorMessage}`);
        })
}

    //? Verificando se a página é a 'index.html' (login)
    //if(window.location.pathname == '/Virtualter-Domiciliar/index.html' || window.location.pathname == '/Virtualter-Domiciliar/') document.getElementById('login-button').addEventListener ("click", Login);
    if(window.location.pathname == '/index.html') document.getElementById('login-button').addEventListener ("click", Login);


