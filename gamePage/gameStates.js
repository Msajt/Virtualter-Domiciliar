const MainMenuState = () => {
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
}

const InstructionsState = () => {
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
}

const GameStartState = () => { 
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

    switch(unityLevel){
        case undefined:
            //TODO Trocar o tamanho para essa fase
            //console.log('fase1');
            for(let i=0; i<10; i++){
                squaresGroup[i].debug = mouseIsPressed;
                squaresGroup[i].setCollider('circle', 0, 0, 30);
            }
            break;
        case 1:
            //console.log('fase2');
            for(let i=0; i<10; i++){
                squaresGroup[i].debug = mouseIsPressed;
                squaresGroup[i].setCollider('circle', 0, 0, 20);
            }
            break;
        case 2:
            //console.log('fase3');
            for(let i=0; i<10; i++){
                squaresGroup[i].debug = mouseIsPressed;
                squaresGroup[i].setCollider('circle', 0, 0, 10);
            }
            break;
    }

    let { leftHip, rightHip, leftShoulder, rightShoulder, leftKnee, rightKnee } = pose;

    let x1 = 480 - (leftHip.x+rightHip.x)/2;
    let x2 = 480 - (leftShoulder.x+rightShoulder.x)/2;
    let y1 = (leftHip.y+rightHip.y)/2;
    let y2 = (leftShoulder.y+rightShoulder.y)/2;

    let x3 = 480 - rightKnee.x;
    let y3 = rightKnee.y;
    let x4 = 480 - leftKnee.x;
    let y4 = leftKnee.y;

    ChestAngle(x1, y1, x2, y2);
    //KneeAngle(480 - rightHip.x, rightHip.y, x3, y3);


    ellipse(480 - rightHip.x, rightHip.y, 8)
    ellipse(x3, y3, 8);

    // let v3 = createVector(0, 0, 50);
    // let v4 = createVector(0, rightHip.y-y3, 50);
    let v3 = createVector(0, 0, 50);
    let v4 = createVector(0, rightHip.y-y3, (rightHip.y-y3));

    let v3_xy = createVector(100, 100);
    let v4_xy = createVector(100, 0);
    let v5_xy = createVector(100, rightHip.y-y3);
    drawArrow(v3_xy, v4_xy, 'red');
    drawArrow(v3_xy, v5_xy, 'blue');

    line(480 - rightHip.x, rightHip.y, x3, y3);

    angleKnee = (degrees(v3_xy.angleBetween(v5_xy)) + 90).toFixed(2);
    textSize(15);
    text(`Joelho: ${ angleKnee }°`, 300, 40);

    for(let i=0; i<10; i++) squaresGroup[i].debug = mouseIsPressed;

    drawSprite(rightHand);
    drawSprite(leftHand);
    drawSprites(squaresGroup);
}

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }