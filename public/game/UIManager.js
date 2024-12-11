class UIManager {
    constructor(gameState, boardElement, piecesInfo, countdownInfo) {
        this.state = gameState;
        this.board = boardElement;
        this.piecesInfo = piecesInfo;
        this.countdownInfo = countdownInfo;
    }

    renderBoard() {
        const {grid, rows, cols} = this.state;
        this.board.style.gridTemplateColumns = `repeat(${cols},50px)`;
        this.board.style.gridTemplateRows = `repeat(${rows},50px)`;
        this.board.innerHTML = '';

        for (let r = 0; r< rows; r++) {
            for (let c = 0; c< cols; c++) {
                const piece = grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.textContent = piece||'';
                cell.addEventListener('click',(e)=>this.onCellClick(e));
                this.board.appendChild(cell);
            }
        }
    }

    setNoClick(noClick){
        if (noClick) this.board.classList.add('no-click');
        else this.board.classList.remove('no-click');
    }

    updatePiecesInfo(text){
        this.piecesInfo.textContent = text;
    }

    updateCountdown(text) {
        this.countdownInfo.textContent = text;
    }

    onCellClick(e) {
        if(this.state.isShowingNextPiece) return;

        const cell = e.currentTarget;
        const r = parseInt(cell.dataset.row,10);
        const  c = parseInt(cell.dataset.col, 10);

        this.game.handleCellClick(r,c);
    }

    bindGame(game) {
        this.game = game;
    }

    
}