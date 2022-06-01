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

    let x1 = 480 - (pose.leftHip.x+pose.rightHip.x)/2;
    let x2 = 480 - (pose.leftShoulder.x+pose.rightShoulder.x)/2;
    let y1 = (pose.leftHip.y+pose.rightHip.y)/2;
    let y2 = (pose.leftShoulder.y+pose.rightShoulder.y)/2;

    ChestAngle(x1, y1, x2, y2);

    for(let i=0; i<10; i++) squaresGroup[i].debug = mouseIsPressed;

    drawSprite(rightHand);
    drawSprite(leftHand);
    drawSprites(squaresGroup);
}