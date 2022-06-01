//! CARREGANDO A CÂMERA DA JANELA DO P5
const CarregarVideo = () => {
	//? CARREGAR WEBCAM
	video = createCapture(VIDEO);
	video.size(480, 360);
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

//! FAZ A MOEDA FICAR VISIVEL NOVAMENTE NO CANVAS
const ResetCollision = (square) => {
	setTimeout(() => {
		timerState = square.visible = true;
	}, 1000);
}

//! VERIFICA QUAL MOEDA FOI PEGA E DÁ UM INTERVALO ENTRE AS COLISÕES
const CollisionInterval = (square, index) => {
	(index < 5) ?
		(//console.log(`Testando colisão esquerda: ${index+1}`)
		 gameInstance.SendMessage("Player", "PlayerInclination", "L" + (index+1)) ) :
		(//console.log(`Testando colisão direita: ${(index-5)+1}`)
		 gameInstance.SendMessage("Player", "PlayerInclination", "R" + ((index-5)+1)) )
	timerState = square.visible = false;
    collisions++;
	coinSound.play();
        console.log(`Colisões: ${collisions}`);
	ResetCollision(square);	
}

//! FUNÇÕES PARA AS MÃOS (DIREITA, ESQUERDA, AMBAS)
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

//! CONTROLE DO CANVAS COM O MOUSE
const SelectButton = (button, tag, x, y) => {
	let buttonTag = tag;

	button.position.x = x;
	button.position.y = y;
	button.onMousePressed = () => {
		gameState = buttonTag;
	}
}

//! CONTROLE DO CANVAS COM O MOVIMENTO
const CollideSelectButton = (counter, tag) => {	
	if(counter > 60){
		gameState = tag;
		counter = 0;
	}
}

//? EXIBIÇÃO DE DADOS NO CONSOLE
const ShowData = () => {
	console.log(`TESTE DE SAÍDA DE DADOS\n
				Level: ${unityLevel}\n
				Points: ${unityPoints}\n
				Time: ${unityTime}\n
				Coins: ${unityCoins}
				Collisions: ${collisions}
				Precision: ${unityCoins/collisions}`
			   );
}

const ChestAngle = (x1, y1, x2, y2) => {
    line(x1, y1, x2, y2);
    stroke(255, 255, 255);
    ellipse(x1, y1, 8);
    ellipse(x2, y2, 8);

    v1 = createVector(50, 0);
    v2 = createVector(x2-x1, y2-y1);
    angle = -degrees(v1.angleBetween(v2)).toFixed(2);
    
    textSize(15);
    text(`Angulação tronco: ${ angle }°`, 300, 20);
    //console.log(`Graus: ${ angle }°`);
}