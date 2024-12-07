const board = document.getElementById('board');
const startGameBtn = document.getElementById('startGameBtn');
const quitGameBtn = document.getElementById('quitGameBtn');
const message = document.getElementById('message');


let grid = [];
let currentPreview = null;
let currentPiecesQuene = [];

// Difficulities Level
const rows = 8;
const cols = 8;

let gameStarted = false;
let isShowingNextPiece = false;
let piecesToShow = 5;
let previewDuration = 2500;

let basePieces = ['A','B','C','D']; //Representing 4 Different Type of Cell

// Get All types of cell in current board except null
function getAllAllowedPieces(){
    const set = new Set();
    for (let r=0; r< rows; r++) {
        for (let c =0; c < cols; c++) {
            if (grid[r][c] !== null) {
                set.add(grid[r][c]);
            }
        }
    }

    return set.size > 0 ? Array.from(set) : basePieces;
}

// Get a Random cell from current board
function getRandomPieceFromAllowed(allowed) {
    return allowed[Math.floor(Math.random() * allowed.length)];
}

// Rendering board
function renderBoard() {
    board.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c< rows; c++) {
            const piece = grid[r][c];
            const cell = document.createElement('div');

            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (piece !== null) {
                cell.textContent = piece;
            } else {
                cell.textContent = '';
            }

            cell.addEventListener('click', onCellClick);

            board.appendChild(cell);
        }
    }
}

function initialiseBoard() {
    console.log('Initialising board');
    do {
        generateRandomBoard();
    } while (hasThreeInARow() === true);

    renderBoard();
}

function generateRandomBoard() {
    grid = [];
    const allowed = basePieces;
    for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
            const isEmpty = Math.random() < 0.2;
            let piece = isEmpty ? null : getRandomPieceFromAllowed(allowed);
            rowArr.push(piece);
        }
        grid.push(rowArr);
    }
}

// Check if there is three same cell connected
function hasThreeInARow(){
    for (let r = 0; r< rows; r++) {
        for (let c = 0; c< cols -2; c++) {
            const p = grid[r][c];
            if (p !== null && p === grid[r][c+1] && p === grid[r][c+2]) {
                return true;
            }
        }
    }

    for (let c = 0 ; c < cols; c++) {
        for (let r = 0; r<rows -2; r++ ) {
            const p = grid[r][c];
            if (p !== null && p === grid[r+1][c] && p === grid[r+2][c]) {
                return true;
            }
        }
    }

    return false;

}

function showNextPieces() {
    isShowingNextPiece = true;
    const allowed = getAllAllowedPieces();
    currentPiecesQuene = [];
    for (let i = 0; i < piecesToShow; i++) {
        currentPiecesQuene.push(getRandomPieceFromAllowed(allowed));
    }

    message.textContent = `Next Pieces : ${currentPiecesQuene.join(' ')}`;
    setTimeout(()=> {
        message.textContent = 'Next Piece: ???';
        isShowingNextPiece = false;
    }, previewDuration);
}

function onCellClick(e) {
    if (isShowingNextPiece) return;

    const cell = e.currentTarget;
    const r = parseInt(cell.dataset.row, 10);
    const c = parseInt(cell.dataset.col, 10);
    const piece = grid[r][c];

    if (piece !== null) return;

    if (currentPiecesQuene.length > 0) {
        const nextPiece = currentPiecesQuene.shift();
        grid[r][c] = nextPiece;
        renderBoard();
        checkAndRemoveMatches();//

        if (isBoardEmpty()) {
            gameOver();
            return;
        }

        if (currentPiecesQuene.length === 0 ) {
            showNextPieces();
        }
    }
}

function checkAndRemoveMatches() {
    let toRemove = new Set();

    //Check vertically
    for (let r = 0; r< rows; r++) {
        for (let c = 0; c < cols; c++) {
            const p = grid[r][c];
            if (p !== null && p === grid[r][c+1] && p === grid[r][c+2]) {
                let end = c+2;
                while (end +1 < cols && grid [r][end+1] === p) end++;

                for (let cc = c; cc<=end; cc++) {
                    toRemove.add(`${r},${cc}`);
                }
                c = end;
            }
        }
    }

    //Check Horizontally
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 2; r++) {
            const p = grid[r][c];
            if (p !== null && p === grid[r+1][c] && p === grid[r+2][c]) {
                let end = r+2;
                while (end+1 < rows && grid[end+1][c] === p) end++;
                for (let rr = r; rr <= end; rr++) {
                    toRemove.add(`${rr},${c}`);
                }
                r = end; 
            }
        }
    }

    if (toRemove.size > 0) {
        toRemove.forEach(key => {
            const [rr,cc] = key.split(',').map(Number);
            grid[rr][cc] = null;
        });
    }

    renderBoard();
}

function isBoardEmpty() {
    for (let r= 0; r<rows; r++) {
        for (let c= 0; c< cols; c++) {
            if (grid[r][c] !== null) return false;
        }
    }
    return true;

}


function gameOver() {
    message.textContent = 'Game Over! All cleared!';
}

// //generate a random piece
// function getRandomPiece(){
//     const pieces = ['A','B', 'C', 'D'];
//     return pieces[Math.floor(Math.random() * pieces.length)];
// }

// //initialise the board
// function initialiseBoard(){
//     console.log('Initialising board...');
//     grid = [];
//     board.innerHTML = '';
//     for (let r = 0; r< rows; r++) {
//         const row = [];
//         for (let c = 0; c < cols; c++) {
//             const piece = getRandomPiece();
//             row.push(piece);
//             const cell = document.createElement('div');
//             cell.className = 'cell';
//             cell.dataset.row = r;
//             cell.dataset.col = c;
//             cell.textContent = piece;

//             cell.addEventListener('click', onCellClick);
//             board.appendChild(cell);
//         }
//         grid.push(row);
//     }
// }



function showPreview() {
    currentPreview = getRandomPiece();
    message.textContent = `Next Piece: ${currentPreview}`;
}

function updateBoard() {
    const cells = board.querySelectorAll('.cell');
    cells.forEach ((cell)=> {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const piece = grid[row][col];
        cell.textContent = piece || '';
        cell.classList.toggle('hidden', !piece );
    });
}

startGameBtn.addEventListener('click', () => {
    console.log('Start Game button clicked'); 
    initialiseBoard();
    gameStarted = true;
    startGameBtn.style.display = 'none';
    showNextPieces();
})

// function onCellClick(e) {
//     const cell = e.currentTarget;
//     const row = cell.dataset.row;
//     const col = cell.dataset.col;
//     const piece = grid[row][col];
//     console.log(`Cell clicked: Row ${row}, Col ${col}, Piece ${Piece}`);
// }

quitGameBtn.addEventListener('click', ()=> {
    console.log('Quit Game button Clicked');

    board.innerHTML = '';
    message.textContent = 'Game Over!';
    quitGameBtn.style.display = 'none';
    startGameBtn.style.display = 'inline-block';
    gameStarted = false;
});

