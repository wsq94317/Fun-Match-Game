class GameState {
    constructor(rows, cols, pieces) {
        this.rows = rows;
        this.cols = cols;
        this.basePieces = pieces;
        this.grid = [];
        this.currentPiecesQuene = [];
        this.gameStarted = false;
        this.isShowingNextPiece = false;
        this.countdownTime = 5;
        this.countdownInterval = null;
        this.timeLeft = this.countdownTime;
        this.piecesToShow = 5;
        this.previewDuration = 2500;

    }

    restCountDown() {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        this.timeLeft = this.countdownTime;
    }
}