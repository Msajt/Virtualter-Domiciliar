import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, child, get, update} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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

const databaseRef = ref(database);

//! Verificando se a página já carregou totalmente
window.onload = () => {
    //? Verificando se o usuário está realmente online
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

                        //? Função que faz essa janela ser vísivel
                        if(userData.userType === 'terapeuta'){
                            console.log('Esse usuário pode acessar a página dos pacientes');
                            //document.getElementById('user-pacientsList').addEventListener ("click", () => window.location = '/Virtualter-Domiciliar/pacientsPage/pacients.html');
                            document.getElementById('user-pacientsList').addEventListener ("click", () => window.location = '/pacientsPage/pacients.html');
                            document.getElementById('user-pacientsList').style.display = 'block';
                        } else document.getElementById('user-pacientsList').style.display = 'none'
                    }
                    else console.log('Erro ao coletar dados');
                });
            
            //! === REDIRECIONANDO DE PÁGINAS
                //? Deslogar usuário
            document.getElementById('user-logout').addEventListener ("click", Logout);
                //? Página do jogo
            //document.getElementById('user-game').addEventListener ("click", () => window.location = '/Virtualter-Domiciliar/gamePage/index.html');
            document.getElementById('user-game').addEventListener ("click", () => window.location = '/gamePage/index.html');
                //? Trocar email e/ou senha
            document.getElementById('user-changeLogin').addEventListener ("click", () => {
                ChangeLoginData(user.uid);
            });

        }else{
            //! Caso o usuário não esteja logado, ele volta para a página inicial
            console.log('Usuário não logado');
            //window.location = '/Virtualter-Domiciliar/index.html';
            window.location = '/index.html';
        } 
    });

}

//! =================================================================================
//! ||                              LOGOUT DO USUÁRIO                              ||
//! =================================================================================
const Logout = () => {
    auth.signOut()
        .then(() => {
			console.log('Usuário deslogado')
            //window.location = '/Virtualter-Domiciliar/index.html';
            window.location = '/index.html';
        })
        .catch((error) => {

        });
}

//! =================================================================================
//! ||                             UPDATE DE USUÁRIO                               ||
//! =================================================================================
const ChangeLoginData = (userId) => {
    //? Coletar os novos email e/ou senha
    let updatedUserEmail = document.getElementById('user-changeEmail').value;
    let oldPassword = document.getElementById('user-oldPassword').value;
    let updatedUserPassword = document.getElementById('user-newPassword').value;
    
    const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);

    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
    //? Trocar o email e/ou senha
        if(updatedUserPassword !== '' && updatedUserEmail !== ''){
            //! Atualiza o email e senha do usuário
            UpdateEmail(updatedUserEmail, userId)
            setTimeout(() => UpdatePassword(updatedUserPassword), 4000); 
            setTimeout(() => window.location.reload(), 8000); 
        } else if(updatedUserPassword === '' && updatedUserEmail !== ''){
            //! Atualiza somente o email
            UpdateEmail(updatedUserEmail, userId)
            setTimeout(() => window.location.reload(), 5000);
            } else if(updatedUserPassword !== '' && updatedUserEmail === ''){
                //! Atualiza somente a senha
                UpdatePassword(updatedUserPassword)
                setTimeout(() => window.location.reload(), 3000);
            }
    })
        .catch((error) => {alert(`Falha ao autenticar o usuário:\n${error.message}`)});  
}

    //? =================================================================================
    //? ||                      FUNÇÕES AUXILIARES DO UPDATE                           ||
    //? =================================================================================
const UpdateEmail = (newEmail, userId) => {
    document.getElementById('user-loadingState').className = "fa fa-spinner fa-spin";
    updateEmail(auth.currentUser, newEmail)
        .then(() => {
            //? Mensagem de confirmação
            console.log(`O email do usuário foi atualizado`);
            //? Dar update no email do usuário
            update(ref(database, `users/${userId}`), {
                email: newEmail
            })
                .then(() => console.log('Email do usuário foi atualizado no banco de dados'))
            document.getElementById('user-changeEmail').value = '';
            document.getElementById('user-oldPassword').value = '';
        })
        .catch((error) => {
            //? Mensagem de erro
            console.log(`Houve um problema ao trocar o email:\n${error.message}`);
        });
}

const UpdatePassword = (newPassword) => {
    document.getElementById('user-loadingState').className = "fa fa-spinner fa-spin";
    updatePassword(auth.currentUser, newPassword)
        .then(() => {
            //? Mensagem de confirmação
            console.log(`A senha do usuário foi atualizada`);
            document.getElementById('user-oldPassword').value = '';
            document.getElementById('user-newPassword').value = '';
        })
        .catch((error) => {
            //? Mensagem de erro
            console.log(`Houve um problema ao trocar a senha:\n${error.message}`);
        });
}
