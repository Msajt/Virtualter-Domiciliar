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

function preload(){
	menuBackground = loadImage('sprites/virtualter-background.png');
	instructionsBackground = loadImage('sprites/instrucoes-background.png');
	buttonInstructions = loadImage('sprites/button-instrucoes.png');
	buttonPlay = loadImage('sprites/button-jogar.png');

	pointer = loadImage('sprites/pointer.png');

	pointerLoading = loadAnimation('sprites/pointer-loading-1.png', 'sprites/pointer-loading-5.png');
}

function setup(){
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
			( square = createSprite(75, 70*(i+1)-20, 30, 30) ) :
			( square = createSprite(480-75, 70*((i-5)+1)-20, 30, 30) )
		
		squaresGroup.add(square);
	}

	//? Game State -> Main-Menu
	gameState = 'main-menu';
}

function draw(){
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
					
					//! TESTES DE SAÍDA DE DADOS
					if(unityLevel === 1 && l1Completed === false){
						ShowData();
						l1Completed = true;
					}
					else if(unityLevel === 2 && l2Completed === false){
						ShowData();
						l2Completed = true;
					}
					else if(unityLevel === 3 && l3Completed === false){
						ShowData();
						l3Completed = true;
					}
				
				if(keyWentDown('W') || keyWentDown('E')) collisions = precision = 0;

				break;
			} //! Fim do if(pose)
		} //! Fim do switch-case
	}//! Fim do if(videoLigado)
}//! fim do draw()