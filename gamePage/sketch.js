//! VARIÁVEIS DO VÍDEO
let video;
let poseNet;
let pose;

//! VARIÁVEL PARA O UNITY
let gameInstance = UnityLoader.instantiate("gameContainer", "Build/Build Versions.json", {onProgress: UnityProgress});

//! LIGAR VIDEO
let videoLigado = false;

//! VARIÁVEL MÃOS
let leftHand;
let rightHand;

//! TIMER
let timerState = true;

//! GROUP SQUARES
let squaresGroup;

//! GAMESTATE
let gameState = '';

//! ITENS DO MENU
let button1, button2, button3;
let menuCounter1 = 0, menuCounter2 = 0;

//! VARIAVEIS PARA ANIMAÇÕES
let menuBackground, instructionsBackground, buttonInstructions, buttonPlay;
let pointer, pointerLoading;

//! VARIAVEIS PARA RETORNO DE DADOS
	//? Para o Unity
let unityPoints, unityTime, unityCoins, unityLevel;
	//? Para o Javascript
let collisions = 0, precision = 0;

//! ESTADOS DA FASE
let l1Completed = false, l2Completed = false, l3Completed = false;

//! DADOS PARA ENVIAR PARA O BANCO DE DADOS DO FIREBASE
let userData = {}, levelData = {};
let gameData = [];
	//? Estado de coletar dos dados prévios;
	let gotUserData = false;//, collectingData = false;
	let updatingData = false;

function preload(){
	menuBackground = loadImage('sprites/virtualter-background.png');
	instructionsBackground = loadImage('sprites/instrucoes-background.png');
	buttonInstructions = loadImage('sprites/button-instrucoes.png');
	buttonPlay = loadImage('sprites/button-jogar.png');

	pointer = loadImage('sprites/pointer.png');

	pointerLoading = loadAnimation('sprites/pointer-loading-1.png', 'sprites/pointer-loading-5.png');

	coinImage = loadImage('./sprites/coin.png');

	coinSound = loadSound('./sounds/coinSound.mp3');
	coinSound.setVolume(0.2);

	auth.onAuthStateChanged((user) => {
		if(user){
			GetUserData(user.uid);
		}
	})
}

function setup(){

	auth.onAuthStateChanged((user) => {
		if(user){

			//? Criando o canvas da página
			let cnv = createCanvas(480, 360);
			//? Posição do canvas da página
			cnv.position(0, 125);

			//? Botões do menu
			button1 = createSprite(0, 0, 100, 50);
			button2 = createSprite(0, 0, 100, 50);

			//? Criando os sprites que serão as 'mãos'
			leftHand = createSprite(10, 10, 10, 10);
			rightHand = createSprite(10, 10, 10, 10);
				rightHand.addImage('pointer', pointer);
				leftHand.addImage('pointer', pointer);

			//? Criando os sprites que serão as 'moedas'
			squaresGroup = new Group();
			for(let i=0; i<10; i++){
				let square;
				(i < 5) ?
					( square = createSprite(40, 70*(i+1)-20, 50, 50) ) :
					( square = createSprite(480-40, 70*((i-5)+1)-20, 50, 50) )
				
				square.addImage('coinImage', coinImage);
				squaresGroup.add(square);
			}

			//? Game State -> Main-Menu
			gameState = 'main-menu';

			//? Coleta dos dados prévios do usuário
			//if(!gotUserData) GetUserData(user.uid);
		}
	})

}

function draw(){

	auth.onAuthStateChanged((user) => {
		if(user){

			//? Mantém os pixels normais
			noSmooth();
			
			//? Verifica se a janela do Unity está totalmente carregada para acionar a câmera
			if(gameInstance.progress.full.style.width === '100%' && videoLigado === false) CarregarVideo();
			
			//? Verificando se a câmera está ligada
			if(videoLigado){
				push();
				translate(video.width, 0);
				scale(-1, 1);
				image(video, -1,1);
				pop();

				//? Verificando se o PoseNet está ligado
				if(pose){
					//! Os gamestates são 'main-menu', 'instructions', 'game-start'
					switch(gameState){
						case 'main-menu':
							MainMenuState();
							break;

						case 'instructions':
							InstructionsState();
							break;

						case 'game-start':
							GameStartState();
							
							/*
							if(gotUserData == false && l1Completed == false && l2Completed == false && l3Completed == false){
								//if(collectingData == false){
									GetUserData(user.uid);
									console.log(`Saída dos dados antigos do usuário`);
									console.log(userData);
									//collectingData = true;
								//}
							}
							*/
							//console.log(gotUserData, l1Completed, l2Completed, l3Completed);
							//console.log(userData);
							
							//! TESTES DE SAÍDA DE DADOS
							if(unityLevel === 1 && l1Completed === false){
								gameData = [];
								l3Completed = false;
								//? Exibindo saída dos dados da fase 1
								//ShowData();
								//? Coletando dados da fase 1
								GetLevelData(0);

								console.log(l1Completed, l2Completed, l3Completed);
								l1Completed = true;
							}
							else if(unityLevel === 2 && l2Completed === false){
								//? Exibindo saída dos dados da fase 2
								//ShowData();
								//? Coletando dados da fase 2
								//GetLevelData(gameData[0].points);
								GetLevelData(gameData.reduce((n, {points}) => n + points, 0));

								console.log(l1Completed, l2Completed, l3Completed);
								l2Completed = true;
							}
							else if(unityLevel === 3 && l3Completed === false){
								//? Exibindo saída dos dados da fase 3
								//ShowData();
								//? Coletando dados da fase 3
								//GetLevelData(gameData[0].points + gameData[1].points);
								GetLevelData(gameData.reduce((n, {points}) => n + points, 0));
								
								console.log(l1Completed, l2Completed, l3Completed);
								l3Completed = true;
								
								//UpdateUserData(user.uid);
							}
						
						if(l1Completed && l2Completed && l3Completed){ 
							if(!updatingData){
								updatingData = true;
								UpdateUserData(user.uid);
								
							} 
						}

						if(keyWentDown('W') || keyWentDown('E')) collisions = precision = 0;
						
						//ResetGame();

						break;
					} //! Fim do if(pose)
				} //! Fim do switch-case
			}//! Fim do if(videoLigado)

		}
	})

}//! fim do draw()

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

//! Verificando se o usuário está logado
auth.onAuthStateChanged((user) => {
	if(user){
		document.getElementById('game-email').innerHTML = user.email;
		document.getElementById('game-logout').addEventListener ("click", Logout);
		//document.getElementById('game-userPage').addEventListener ("click", () => window.location = '/Virtualter-Domiciliar/userPage/user.html');
		document.getElementById('game-userPage').addEventListener ("click", () => window.location = '/userPage/user.html');
	} else {
		console.log('Usuário não logado');
		//window.location = '/Virtualter-Domiciliar/index.html';
		window.location = '/index.html';
	}
});

//! =================================================================================
//! ||                      COLETANDO DADOS PRÉVIOS DO USUÁRIO                     ||
//! =================================================================================
const GetUserData = (userId) => {
	let previousUserData = database.ref().child('users').child(userId);
	
	previousUserData.get()
		.then((snapshot) => {
			if(snapshot.exists()) {
				userData = snapshot.val();
				//gotUserData = true;
				//collectingData = false;
				console.log('Dados prévios coletados com sucesso');
			} else {
				console.log('Não há dados');
			}
		})
		.catch(() => {
			console.log('Houve um erro ao coletar os dados anteriores');
			//window.location = '/Virtualter-Domiciliar/gamePage/index.html';
			window.location = '/gamePage/index.html';
		})
}

//! =================================================================================
//! ||                        UPDATE DOS DADOS DO USUÁRIO                          ||
//! =================================================================================
const UpdateUserData = (userId) => {
	//? Variáveis para atualizar
	let updatedGamesPlayed = userData.gamesPlayed + 1;
	let updatedTotalCoins = userData.totalCoins + gameData.reduce((n, {coins}) => n + coins, 0);
	let updatedTotalCollisions = userData.totalCollisions + gameData.reduce((n, {collisions}) => n + collisions, 0);
	let updatedTotalPoints = userData.totalPoints + gameData.reduce((n, {points}) => n + points, 0);
	let updatedTotalPrecision = (userData.totalCoins + gameData.reduce((n, {coins}) => n + coins, 0))/(userData.totalCollisions + gameData.reduce((n, {collisions}) => n + collisions, 0));
	let updatedTotalTime = userData.totalTime + gameData.reduce((n, {time}) => n + time, 0);

	//! Essa variável tá dando problemas pra ser adicionada quando atualizada
	//let updatedGames = userData.games.push(gameData);

	const updatedUserData = {
		//games: updatedGames,
		gamesPlayed: updatedGamesPlayed,
		totalCoins: updatedTotalCoins,
		totalCollisions: updatedTotalCollisions,
		totalPoints: updatedTotalPoints,
		totalPrecision: updatedTotalPrecision,
		totalTime: updatedTotalTime
	}
	
	database.ref(`users/${userId}`)
		.update(updatedUserData, (error) => {
			console.log(`Os dados foram atualizados com sucesso`);
			//? Limpar array do gameData, userData e gotUserData = 'false'
			gameData = [];
			userData = {};
			gotUserData = false;
			l1Completed = l2Completed = l3Completed = false;
			updatingData = false;
			GetUserData(userId);
			console.log(gameData);
			console.log(userData);
			console.log(gotUserData);
			//console.log(l1Completed, l2Completed, l3Completed);
			//gotUserData = l1Completed = l2Completed = l3Completed = false;	
		})
		/*
		.then(() => {
			console.log(`Os dados de ${user.email} foram atualizados com sucesso`);
			//? Limpar array do gameData, userData e gotUserData = 'false'
			gameData = [];
			userData = {};
			gotUserData = false;
		})
		*/
		.catch((error) => {
			console.log(`Houve um erro: ${error.message}`)
		});
}

//! Resetando o jogo
const ResetGame = () => {
	if(l1Completed && l2Completed && l3Completed){
		l1Completed = false;
		l2Completed = false;
		l3Completed = false;
		console.log('Resetando dados para a coleta');
	}
}

//! Coletando os dados de cada fase
const GetLevelData = (subtractNumber) => {
	//? Como se trata de uma variável local dentro da função, o objeto sempre vai resetar
	let levelData = {};

	levelData['points'] = unityPoints - subtractNumber;
	levelData['time'] = unityTime;
	levelData['coins'] = unityCoins;
	levelData['collisions'] = collisions;
	levelData['precision'] = unityCoins/collisions;

	//? Inserindo no array global 'gameData' que contém os dados de todas as fases
	gameData.push(levelData);
	
	//! TESTES DE SAÍDA
	console.log(`=== Dados da Fase ${unityLevel} ===`);
	console.log(levelData);
	console.log(gameData);
	console.log(`Dados da fase ${unityLevel} foram coletadas`);
	console.log(userData);
}
