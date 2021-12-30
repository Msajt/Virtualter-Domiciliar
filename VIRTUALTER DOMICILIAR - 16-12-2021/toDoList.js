//! =================================================================================
//! ||                            DADOS PARA COLETAR                               ||
//! =================================================================================

//* Coletar nível -> ok
//* Coletar pontuação -> ok
//* Coletar tempo -> ok
//* Coletar moedas -> ok
//! === Precisam de melhoria ===
    //* Coletar colisões realizadas -> ok
    //* Coletar precisão (moedas/colisões) -> ok

//TODO Adicionar os dados coletados no banco de dados
//TODO Vincular o banco de dados com o usuário
//TODO Resetar pontuação no Unity


//! =================================================================================
//! ||                            FORMATO DA VARIÁVEL                              ||
//! =================================================================================
let levelData = {
    points: 0,
    time: 0,
    coins: 0,
    collision: 0,
    precision: 0   
}

let gameData = []
    //? Encerrou 'Level 1' -> Coleta dos dados com 'levelData' -> gameData.push(levelData) -> Resetar 'levelData'
    //? Encerrou 'Level 2' -> Coleta dos dados com 'levelData' -> gameData.push(levelData) -> Resetar 'levelData'
    //? Encerrou 'Level 3' -> Coleta dos dados com 'levelData' -> gameData.push(levelData) -> Resetar 'levelData'
        //* Pegar array 'gameData' e incrementar nos dados dos jogos do usuário -> Resetar 'gameData'
            //! Incrementar +1 em total de jogos feitos, calcular colisões, moedas e precisão totais

let userData = {
    id: '',
    email: '',
    userType: '',
    games: [ [ {},{},{} ], [ {},{},{} ], ... ],
    gamesPlayed: games.length(),
    totalCoins: 0,
    totalCollisions: 0,
    totalPrecision: totalCoins/totalCollisions
}