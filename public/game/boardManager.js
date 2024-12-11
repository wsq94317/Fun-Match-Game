class BoardManager {
    constructor(gameState) {
        this.state = gameState;
    }

    initialiseBoard() {
        do {
            this.generateRandomBoard();
        } while (this.hasThreeInARow());
    }

    generateRandomBoard() {
        const {rows, cols, basePieces} = this.state;
        this.state.grid = [];
        const totalCells = rows*cols;
        const maxPieces = Math.floor(totalCells /2);
        let placedPieces = 0;

        for (let r = 0; r< rows; r++) {
            const rowArr = [];
            for (let c = 0; c < cols; c++) {
                let piece = null;
                if (placedPieces < maxPieces && Math.random() < 0.5) {
                    piece = this.getRandomPieceFromAllowed(basePieces);
                    placedPieces++;
                }
                rowArr.push(piece);
            }
            this.state.grid.push(rowArr);
        }
    }

    getAllAllowedPieces() {
        const set = new Set();
        for (let r = 0; r < this.state.rows; r++) {
            for (let c=0; c< this.state.cols; c++) {
                const p = this.state.grid[r][c];
                if (p !== null) {
                    set.add(p);
                }
            }
        }

        return set.size > 0 ? Array.from(set) : this.state.basePieces;
    }

    getRandomPieceFromAllowed() {
        return allowed[Math.floor(Math.random() * allowed.length)];
    }

    hasThreeInARow() {
        const {grid, rows, cols} = this.state;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols-2 ; c++) {
                const p = grid[r][c];
                if (p !== null && p === grid[r][c+1] && p ===grid[r][c+2] ) {
                    return true;
                }
            }
        }

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows-2; r++) {
                const p = grid[r][c];
                if (p !== null && p === grid[r+1][c] && p === grid[r+2][c]) return true;
            }
        }
        return false;
    }

    checkAndRemoveMatches() {
        const {grid, rows, cols} = this.state;
        let toRemove = new Set();

        // Vertical check
        for (let r = 0; r<rows; r++) {
            for (let c=0; c<cols; c++) {
                const p = grid[r][c];
                if (p!==null && p===grid[r][c+1] && p===grid[r][c+2]) {
                    let end = c+2;
                    while(end+1<cols && grid[r][end+1]===p) end++;
                    for (let cc=c; cc<=end; cc++) toRemove.add(`${r},${cc}`);
                    c = end;
                }
            }
        }

        // Horizontal check
        for (let c=0; c<cols; c++) {
            for (let r=0; r<rows-2; r++) {
                const p = grid[r][c];
                if (p!==null && p===grid[r+1][c] && p===grid[r+2][c]) {
                    let end = r+2;
                    while(end+1<rows && grid[end+1][c]===p) end++;
                    for (let rr=r; rr<=end; rr++) toRemove.add(`${rr},${c}`);
                    r = end;
                }
            }
        }

        if (toRemove.size>0) {
            toRemove.forEach(key=>{
                const [rr,cc]=key.split(',').map(Number);
                grid[rr][cc]=null;
            });
        }
    }

    isBoardEmpty() {
        const {grid, rows, cols} = this.state;
        for (let r=0; r<rows; r++){
            for (let c=0; c<cols; c++){
                if (grid[r][c] !== null) return false;
            }
        }
        return true;
    }

    isBoardFull() {
        const {grid, rows, cols} = this.state;
        for (let r=0; r<rows; r++){
            for (let c=0; c<cols; c++){
                if (grid[r][c] === null) return false;
            }
        }
        return true;
    }

    placePiece(r, c, piece) {
        this.state.grid[r][c] = piece;
    }

    forcePlacePiece(ui, game) {
        console.log('forcePlacePiece called');
        const { currentPiecesQuene, grid } = this.state;

        if (currentPiecesQuene.length > 0) {
            console.log('There are pieces to force place');
            const nextPiece = currentPiecesQuene.shift();

            let emptyCells = [];
            for (let r=0; r< this.state.rows; r++) {
                for (let c=0; c<this.state.cols; c++) {
                    if (grid[r][c]===null) {
                        emptyCells.push({r,c});
                    }
                }
            }

            if (emptyCells.length>0) {
                const chosen=emptyCells[Math.floor(Math.random()*emptyCells.length)];
                this.placePiece(chosen.r, chosen.c, nextPiece);
                ui.renderBoard();
                this.checkAndRemoveMatches();

                if (this.isBoardEmpty()) {
                    console.log('Board empty after force placement, success');
                    game.takeSuccess();
                    return;
                }

                if (this.isBoardFull()) {
                    console.log('Board full after force placement');
                    game.gameOver();
                    return;
                }

                this.state.currentPiecesQuene = [];
                console.log('Forced piece placed, discarding remaining pieces and showing a new sequence');
                game.showNextPieces(); 
            } else {
                console.log('No empty cells, game over');
                game.gameOver();
            }
        } else {
            console.log('No pieces in queue, show next pieces');
            game.showNextPieces();
        }
    }
}