const board = document.getElementById('board');
const startGameBtn = document.getElementById('startGameBtn');
const quitGameBtn = document.getElementById('quitGameBtn');
// const message = document.getElementById('message');
const piecesInfo = document.getElementById('piecesInfo');
const countdownInfo = document.getElementById('countdownInfo');



let grid = [];
let currentPreview = null;
let currentPiecesQuene = [];

// Difficulities Level
const rows = 5;
const cols = 5;

let countdownTime = 5; //default level 1
let countdownInterval = null;
let timeLeft = countdownTime;

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
    // Edit Style
    board.style.gridTemplateColumns = `repeat(${cols},50px)`;
    board.style.gridTemplateRows = `repeat(${rows}, 50px)`;

    board.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c< cols; c++) {
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
    const totalCells = rows * cols;
    const maxPieces = Math.floor(totalCells /2);

    let placedPieces = 0;


    for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
            let piece = null;
            if (placedPieces < maxPieces) {
                const shouldPlacePiece = Math.random() < 0.5;
                if (shouldPlacePiece) {
                    piece = getRandomPieceFromAllowed(allowed);
                    placedPieces++;
                }
            }

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
    board.classList.add('no-click');
    const allowed = getAllAllowedPieces();
    currentPiecesQuene = [];
    for (let i = 0; i < piecesToShow; i++) {
        currentPiecesQuene.push(getRandomPieceFromAllowed(allowed));
    }

    // message.textContent = `Next Pieces : ${currentPiecesQuene.join(' ')}`;
    piecesInfo.textContent = `Next Pieces: ${currentPiecesQuene.join(' ')}`;
    countdownInfo.textContent ='';

    setTimeout(()=> {
        piecesInfo.textContent = 'Next Piece: ???';
        isShowingNextPiece = false;
        board.classList.remove('no-click');

        startCountdown();
    }, previewDuration);
}

function onCellClick(e) {
    if (isShowingNextPiece) return;

    board.classList.remove('no-click');
    
    const cell = e.currentTarget;
    const r = parseInt(cell.dataset.row, 10);
    const c = parseInt(cell.dataset.col, 10);
    const piece = grid[r][c];

    if (piece !== null) return;

    if (currentPiecesQuene.length > 0) {
        // Player place cell before the contdown over
        clearInterval(countdownInterval);
        countdownInterval = null;


        const nextPiece = currentPiecesQuene.shift();
        grid[r][c] = nextPiece;
        renderBoard();
        checkAndRemoveMatches();//

        if (isBoardEmpty()) {
            gameOver();
            return;
        }

        verifyCurrentSequence(); // if there contains a pieces that no longer exists in the board, refresh sequence
        if (currentPiecesQuene.length === 0 ) {
            showNextPieces();
        } else {
            startCountdown();
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
    // message.textContent = 'Game Over! All cleared!';
    piecesInfo.textContent = 'Game Over! All cleared!';
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

function startCountdown() {
    if (countdownInterval !== null) {
        return;
    }
    console.log('startCountdown kcalled');
    //remove old 
    clearInterval(countdownInterval);
    timeLeft = countdownTime;

    // message.textContent = `Time Left: ${timeLeft}s | NextPiece: ???`;
    countdownInfo.textContent = `Time Left: ${timeLeft}s`;

    countdownInterval = setInterval(()=> {
        timeLeft--;
        if(timeLeft > 0){
            // message.textContent =`Time Left: ${timeLeft}s | NextPiece: ???`;
            countdownInfo.textContent = `Time Left: ${timeLeft}s`;
        } else {
            //if countdown finish and the player doesnt response
            clearInterval(countdownInterval);
            countdownInterval = null;
            forcePlacePiece(); //Radomly place one cell
        }

    }, 1000);
}

function forcePlacePiece() {
    console.log('forcePlacePiece called');
    if (currentPiecesQuene.length > 0) {
        console.log('There are pieces to force place');
        const nextPiece = currentPiecesQuene.shift();

        //find all empty cells
        let emptyCells = [];
        for (let r = 0; r< rows; r++) {
            for (let c=0; c<cols; c++) {
                if (grid[r][c] === null) {
                    emptyCells.push({r,c});
                }
            }
        }

        if (emptyCells.length > 0) {
            // choose one random cell to place current cell
            const chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[chosen.r][chosen.c] = nextPiece;
            renderBoard();
            checkAndRemoveMatches();

            if (isBoardEmpty()) {
                console.log('Board empty after force placement, game over');
                gameOver();
                return;
            }

            currentPiecesQuene = [];
            console.log('Forced piece placed, discarding remaining pieces and showing a new sequence');
            showNextPieces();

            // if (currentPiecesQuene.length === 0) {
            //     console.log('Pieces used up, show next batch');
            //     showNextPieces();
            // } else {
            //     console.log('Still have pieces, start countdown again');
            //     startCountdown();
            // }
        } else {
            console.log('No empty cells, game over');
            gameOver();
        }


    } else {
        console.log('No pieces in queue, show next pieces');
        showNextPieces();
    }
}

function verifyCurrentSequence() {
    const allowed = getAllAllowedPieces();

    const isSequenceValid = currentPiecesQuene.every(pieceType => allowed.includes(pieceType));

    if (!isSequenceValid) {
        console.log('Current Sequence contains a piece type no longer available on the board');
        currentPiecesQuene = [];
        showNextPieces();
    }

}

startGameBtn.addEventListener('click', () => {
    console.log('Start Game button clicked'); 
    initialiseBoard();
    gameStarted = true;
    startGameBtn.style.display = 'none';
    showNextPieces();
})


quitGameBtn.addEventListener('click', ()=> {
    console.log('Quit Game button Clicked');

    board.innerHTML = '';
    // message.textContent = 'Game Over!';
    piecesInfo.textContent = 'Game Over!';
    quitGameBtn.style.display = 'none';
    startGameBtn.style.display = 'inline-block';
    gameStarted = false;
});

