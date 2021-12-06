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
					background(menuBackground);
					
					//? Botões do menu usando o 'mouse'
					SelectButton(button1, 'game-start', 240, 180);
						button1.addImage(buttonPlay);
					SelectButton(button2, 'instructions', 240, 250);
						button2.addImage(buttonInstructions);

					//? A mão será como um "mouse" para percorrer nos itens
					RightHandPosition(rightHand);
						//? Botões do menu usando o 'movimento'
						rightHand.overlap(button1, () => {
							menuCounter1++;
							CollideSelectButton(menuCounter1, 'game-start');
						}) ? null : menuCounter1 = 0;
						rightHand.overlap(button2, () => {
							menuCounter2++;
							CollideSelectButton(menuCounter2, 'instructions');
						}) ? null : menuCounter2 = 0;
						
					console.log(`menuCounter1 = ${menuCounter1}\nmenuCounter2 = ${menuCounter2}`);
					
					//? Adicionando os sprites na tela
					drawSprite(button1);
					drawSprite(button2);
					drawSprite(rightHand);
					break;

				case 'instructions':
					background(instructionsBackground);
					//text('INSTRUÇÔES', 240, 30);
					
					//? Botões do menu usando o 'mouse'
					SelectButton(button1, 'game-start', 420, 325);
						button1.addImage(buttonPlay);

					//? A mão será como um "mouse" para percorrer nos itens
					RightHandPosition(rightHand);
						//? Botões do menu usando o 'movimento'
						rightHand.overlap(button1, () => {
							menuCounter1++;
							CollideSelectButton(menuCounter1, 'game-start');
						}) ? null : menuCounter1 = 0;
					
					console.log(`menuCounter1 = ${menuCounter1}\nmenuCounter2 = ${menuCounter2}`);
					
					//? Adicionando os sprites na tela
					drawSprite(button1);
					//drawSprite(button2);
					drawSprite(rightHand);
					break;

				case 'game-start':
					//? Definindo posição das mãos na tela
					HandsPosition(rightHand, leftHand);	

					//? Verificando se o estado do 'timer' está ativo para colisões
					if(timerState === true){
						//? Laço pegando todos os quadrados da tela
						squaresGroup.forEach((sqr, ind) => {
							//? Verifcando a direção [ ind < 5 ? esquerda : direita ]
							(ind < 5) ?
								//? Verificando colisões
								sqr.overlap(leftHand, () => {
									//? Inverte o estado do 'timer' por certo tempo e chama função do
									CollisionInterval(sqr, ind);
								}) :
								sqr.overlap(rightHand, () => {
									CollisionInterval(sqr, ind);
								})
						});
					}
					drawSprite(rightHand);
					drawSprite(leftHand);
					drawSprites(squaresGroup);
					break;
			} //! Fim do if(pose)
		} //! Fim do switch-case
	}//! Fim do if(videoLigado)
}//! fim do draw()

//! CARREGANDO A CÂMERA DA JANELA DO P5
const CarregarVideo = () => {
	//? CARREGAR WEBCAM
	video = createCapture(VIDEO);
	video.size(480,360);
	video.hide();

	//? CARREGAR POSENET
	poseNet = ml5.poseNet(video, { inputResolution: 289 }, modelReady);
	poseNet.on('pose', gotPoses);

	//? Troca o estado para verdadeiro
	videoLigado = true;
}

//! COLETA DAS POSES DO USUÁRIO
const gotPoses = (poses) => {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    //console.log(pose);
  }
}

//! VERIFICA SE O MODELO DE VERIFICAÇÃO DAS POSES FUNCIONOU
const modelReady = () => {
  console.log('model ready');
}

const ResetCollision = (square) => {
	setTimeout(() => {
		timerState = square.visible = true;
	}, 500);
}

const CollisionInterval = (square, index) => {
	(index < 5) ?
		(//console.log(`Testando colisão esquerda: ${index+1}`)
		 gameInstance.SendMessage("Player", "PlayerInclination", "L" + (index+1)) ) :
		(//console.log(`Testando colisão direita: ${(index-5)+1}`)
		 gameInstance.SendMessage("Player", "PlayerInclination", "R" + ((index-5)+1)) )
	timerState = square.visible = false;
	ResetCollision(square);	
}

const RightHandPosition = (r) => {
	r.position.x = 480-pose.rightWrist.x;
	r.position.y = pose.rightWrist.y;
}

const LeftHandPosition = (l) => {
	l.position.x = 480-pose.leftWrist.x;
	l.position.y = pose.leftWrist.y;	
}

const HandsPosition = (r, l) => {
	RightHandPosition(r);
	LeftHandPosition(l);	
}

const SelectButton = (button, tag, x, y) => {
	let buttonTag = tag;

	button.position.x = x;
	button.position.y = y;
	button.onMousePressed = () => {
		gameState = buttonTag;
	}
}

const CollideSelectButton = (counter, tag) => {	
	if(counter > 60){
		gameState = tag;
		counter = 0;
	}
}