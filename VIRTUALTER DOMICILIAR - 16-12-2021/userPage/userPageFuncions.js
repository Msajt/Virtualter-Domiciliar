import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, child, get} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase();

const databaseRef = ref(database);

window.onload = () => {

    onAuthStateChanged(auth, (user) => {
        if(user){
            let userData = {};

            //? Coletar dados do usuário
            get(child(databaseRef, `users/${user.uid}`))
                .then((snapshot) => {
                    if(snapshot.exists()) {
                        //? Coletando dados atuais do usuário
                        userData = snapshot.val();
                        //? Exibindo o avatar do usuário
                        document.getElementById('user-image').src = `https://robohash.org/${user.email}`;
                        //? Exibindo dados 'escritos'
                        document.getElementById('user-email').innerHTML = userData.email;
                        document.getElementById('user-email-card').innerHTML = userData.email;
                        document.getElementById('user-userType').innerHTML = userData.userType.toUpperCase();
                        //? Exibindo dados 'numéricos'
                        document.getElementById('user-timesPlayed').innerHTML = `Vezes jogadas: ${userData.gamesPlayed}`;
                        document.getElementById('user-totalCoins').innerHTML = `Moedas coletadas: ${userData.totalCoins}`;
                        document.getElementById('user-totalCollisions').innerHTML = `Colisões realizadas: ${userData.totalCollisions}`;
                        document.getElementById('user-totalPoints').innerHTML = `Pontuação total: ${userData.totalPoints}`;
                        document.getElementById('user-totalPrecision').innerHTML = `Precisão total: ${(userData.totalPrecision*100).toFixed(5)}%`;
                        document.getElementById('user-totalTime').innerHTML = `Tempo jogado: ${(userData.totalTime/60).toFixed(3)} min`;

                        if(userData.userType === 'terapeuta'){
                            console.log('Esse usuário pode acessar a página dos pacientes');
                            //? Função que faz essa janela ser vísivel
                        }
                    }
                    else console.log('Erro ao coletar dados');
                });
            
            //! === REDIRECIONANDO DE PÁGINAS
                //? Deslogar usuário
            document.getElementById('user-logout').addEventListener ("click", Logout);
                //? Página do jogo
            document.getElementById('user-game').addEventListener ("click", () => window.location = '/gamePage/index.html');
                //? Lista de pacientes
                //? Trocar email e/ou senha
            document.getElementById('user-changeLogin').addEventListener ("click", ChangeLoginData);

        }else{
            console.log('Usuário não logado');
            window.location = '/index.html';
        }

        
    });

}

const Logout = () => {
    auth.signOut()
        .then(() => {
			console.log('Usuário deslogado')
            window.location = '/index.html';
        })
        .catch((error) => {

        });
}

const ChangeLoginData = () => {
    //? Coletar o email e/ou senha
    //? Trocar o email e/ou senha
        //! Verificar caso o 'value' é nulo
        //* Dar update no email do usuário
        //* Recarregar a página
}