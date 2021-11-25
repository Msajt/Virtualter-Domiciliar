//! VARIÁVEIS DO VÍDEO
var video;
var poseNet;
var pose;

//! VARIÁVEIS DA POSE
var posicaoInicialX, posicaoInicialY;
var limiteMaxY, limiteMinY;

//! VARIÁVEL DO BOTÃO DE CALIBRAR
var calibrar;

//! VARIÁVEL PARA O UNITY
var gameInstance = UnityLoader.instantiate("gameContainer", "Build/Build Versions.json", {onProgress: UnityProgress});

//! LIGAR VIDEO
var videoLigado = false;

//! VÁRIAVEL QUADRADOS
var leftSquares = [];
var rightSquares = [];

//! VARIÁVEL MÃOS
var leftHand;
var rightHand;

//! TIMER
let timerState = true;

//! GROUP SQUARES
let squaresGroup;

//! GAMESTATE
let gameState = '';

//! ITENS DO MENU
let button1, button2, button3;
let menuCounter1 = 0, menuCounter2 = 0;

function setup(){
	//? Criando o canvas da página
	let cnv = createCanvas(480, 360);
	//? Posição do canvas da página
	cnv.position(0, 125);

	//? Timer para exibir o vídeo da webcam na tela
	setTimeout(CarregarVideo, 2000);

	//? Botões do menu
	button1 = createSprite(0, 0, 100, 50);
	button2 = createSprite(0, 0, 100, 50);

	//? Criando os sprites que serão as 'mãos'
	leftHand = createSprite(10, 10, 10, 10);
	rightHand = createSprite(10, 10, 10, 10);

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

	if(videoLigado){
		push();
		translate(video.width, 0);
		scale(-1, 1);
		image(video, -1,1);
		pop();

		if(pose){
			switch(gameState){
				case 'main-menu':
					background(150);
					text('MAIN-MENU', 240, 30);
					
					//? Botões do menu usando o 'mouse'
					SelectButton(button1, 'game-start', 240, 180);
					SelectButton(button2, 'instructions', 240, 250);

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
					background(255, 0, 0);
					text('INSTRUÇÔES', 240, 30);
					
					//? Botões do menu usando o 'mouse'
					SelectButton(button1, 'game-start', 380, 120);
					SelectButton(button2, 'main-menu', 380, 60);

					//? A mão será como um "mouse" para percorrer nos itens
					RightHandPosition(rightHand);
						//? Botões do menu usando o 'movimento'
						rightHand.overlap(button1, () => {
							menuCounter1++;
							CollideSelectButton(menuCounter1, 'game-start');
						}) ? null : menuCounter1 = 0;
						rightHand.overlap(button2, () => {
							menuCounter2++;
							CollideSelectButton(menuCounter2, 'main-menu');
						}) ? null : menuCounter2 = 0;
					
					console.log(`menuCounter1 = ${menuCounter1}\nmenuCounter2 = ${menuCounter2}`);
					
					//? Adicionando os sprites na tela
					drawSprite(button1);
					drawSprite(button2);
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

function CarregarVideo(){
    //? CARREGAR WEBCAM
    video = createCapture(VIDEO);
    video.size(480,360);
    video.hide();
  
    //? CARREGAR POSENET
    poseNet = ml5.poseNet(video, { inputResolution: 289 }, modelReady);
    poseNet.on('pose', gotPoses);

	videoLigado = true;
}

//! COLETA DAS POSES DO USUÁRIO
function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    //console.log(pose);
  }
}

//! VERIFICA SE O MODELO DE VERIFICAÇÃO DAS POSES FUNCIONOU
function modelReady() {
  console.log('model ready');
  Recalibrar();
}

//! FUNÇÃO PARA CALIBRAR A POSIÇÃO DO USUÁRIO SEM A NECESSIDADE DE ATUALIZAR A PÁGINA
function Recalibrar(){
  setTimeout(()=>{
    posicaoInicialX = (pose.leftHip.x+pose.rightHip.x)/2;
    posicaoInicialY = (pose.leftHip.y+pose.rightHip.y)/2;

    limiteMaxY = posicaoInicialY-30;
  }, 5000)
}

const ResetCollision = (square) => {
	setTimeout(() => {
		timerState = square.visible = true;
	}, 1000);
}

const CollisionInterval = (square, index) => {
	(index < 5) ?
		(console.log(`Testando colisão esquerda: ${index+1}`)
		/* gameInstance.SendMessage("Player", "PlayerInclination", "L" + (index+1)) */) :
		(console.log(`Testando colisão direita: ${(index-5)+1}`)
		/* gameInstance.SendMessage("Player", "PlayerInclination", "R" + ((index-5)+1)) */)
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