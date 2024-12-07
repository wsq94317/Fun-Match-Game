const board = document.getElementById('board');
const startGameBtn = document.getElementById('startGameBtn');
const message = document.getElementById('message');
const rows = 8;
const cols = 8;
let grid = [];
let currentPreview = null;
let gameStarted = false;

//generate a random piece
function getRandomPiece(){
    const pieces = ['A','B', 'C', 'D'];
    return pieces[Math.floor(Math.random() * pieces.length)];
}

//initialise the board
function initialiseBoard(){
    console.log('Initialising board...');
    grid = [];
    board.innerHTML = '';
    for (let r = 0; r< rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const piece = getRandomPiece();
            row.push(piece);
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.textContent = piece;

            cell.addEventListener('click', onCellClick);
            board.appendChild(cell);
        }
        grid.push(row);
    }
}

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
    showPreview();
})

function onCellClick(e) {
    const cell = e.currentTarget;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const piece = grid[row][col];
    console.log(`Cell clicked: Row ${row}, Col ${col}, Piece ${Piece}`);
}

quitGameBtn.addEventListener('click', ()=> {
    console.log('Quit Game button Clicked');

    board.innerHTML = '';
    message.textContent = 'Game Over!';
    quitGameBtn.style.display = 'none';
    startGameBtn.style.display = 'inline-block';
    gameStarted = false;
});

