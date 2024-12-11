
const gs = new GameState(rows, cols, basePieces);
const bm = new BoardManager(gs);
const ui = new UIManager(gs, board, piecesInfo, countdownInfo);
const game = new Game(gs, bm, ui);

startGameBtn.addEventListener('click', () => {
    startGameBtn.style.display='none';
    game.startGame();
});

quitGameBtn.addEventListener('click', () => {
    console.log('Quit Game button clicked');
    board.innerHTML='';
    piecesInfo.textContent='Game Over!';
    quitGameBtn.style.display='none';
    startGameBtn.style.display='inline-block';
    gs.gameStarted=false;
});