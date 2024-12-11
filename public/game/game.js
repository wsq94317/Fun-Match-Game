class Game {
    constructor(gameState, boardManager, ui) {
        this.state = gameState;
        this.boardManager = boardManager;
        this.ui = ui;
        this.ui.bindGame(this);
    }

    startGame(){
        console.log('Start Game Button Clicked');
        this.boardManager.initialiseBoard();
        this.state.gameStarted = true;
        this.showNextPieces();
    }

    showNextPieces() {
        this.state.isShowingNextPiece = true;
        this.ui.setNoClick(true);
        const allowed = this.boardManager.getAllAllowedPieces();
        this.state.currentPiecesQuene = [];
        for (let i = 0; i < this.state.piecesToShow; i++) {
            this.state.currentPiecesQuene.push(this.boardManager.getRandomPieceFromAllowed(allowed));
        }

        this.ui.updatePiecesInfo(`Next Pieces: ${this.state.currentPiecesQuene.join(' ')}`);
        this.ui.updateCountdown;

        setTimeout(()=>{
            this.ui.updatePiecesInfo('Next Piece: ???');
            this.state.isShowingNextPiece = false;
            this.ui.setNoClick(false);
            this.startCountdown();
        }, this.state.previewDuration);
    }

    startCountdown() {
        if (this.state.countdownInterval !== null) return;
        console.log('startCountdown kcalled');
        this.state.resetCountdown();
        this.ui.updateCountdown(`Time Left: ${this.state.timeLeft}s`);

        this.state.countdownInterval = setInterval(()=>{
            this.state.timeLeft--;
            if(this.state.timeLeft>0){
                this.ui.updateCountdown(`Time Left: ${this.state.timeLeft}s`);
            } else {
                clearInterval(this.state.countdownInterval);
                this.state.countdownInterval=null;
                this.boardManager.forcePlacePiece(this.ui,this);
            }
        },1000);
    }

    handleCellClick(r,c) {
        const {grid, currentPiecesQuene} = this.state;
        if (grid[r][c]!==null) return;

        if (currentPiecesQuene.length>0) {
            clearInterval(this.state.countdownInterval);
            this.state.countdownInterval=null;

            const nextPiece = currentPiecesQuene.shift();
            this.boardManager.placePiece(r,c,nextPiece);
            this.ui.renderBoard();
            this.boardManager.checkAndRemoveMatches();

            if (this.boardManager.isBoardEmpty()) {
                this.takeSuccess();
                return;
            }

            if (this.boardManager.isBoardFull()) {
                this.gameOver();
                return;
            }

            this.verifyCurrentSequence();

            if (currentPiecesQuene.length===0) {
                this.showNextPieces();
            } else {
                this.startCountdown();
            }
        }
    }

    verifyCurrentSequence() {
        const allowed = this.boardManager.getAllAllowedPieces();
        const isSequenceValid = this.state.currentPiecesQuene.every(p=>allowed.includes(p));
        if (!isSequenceValid) {
            console.log('Current Sequence invalid, refreshing');
            this.state.currentPiecesQuene=[];
            this.showNextPieces();
        }
    }

    takeSuccess() {
        this.ui.updatePiecesInfo('Task Completed! You cleared the board!');
        this.ui.setNoClick(true);
    }

    gameOver() {
        this.ui.updatePiecesInfo('Game Over! No moves left!');
        this.ui.setNoClick(true);
    }
}