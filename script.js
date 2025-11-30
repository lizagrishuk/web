console.log("Игра 2048 — проект инициализирован");

const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const undoBtn = document.getElementById("undo");
const restartBtn = document.getElementById("restart");
const showLeaderboardBtn = document.getElementById("showLeaderboard");

const gameOverModal = document.getElementById("gameOver");
const playerNameInput = document.getElementById("playerName");
const saveScoreBtn = document.getElementById("saveScore");
const restartGameBtn = document.getElementById("restartGame");

const leaderboardModal = document.getElementById("leaderboard");
const recordsTable = document.getElementById("recordsTable");
const closeLeaderboardBtn = document.getElementById("closeLeaderboard");

const controls = document.getElementById("controls");

const size = 4;
let matrix = Array.from({ length: size }, () => Array(size).fill(0));
let score = 0;

function drawBoard() {
    board.innerHTML = "";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (matrix[r][c] !== 0) cell.textContent = matrix[r][c];
            board.appendChild(cell);
        }
    }
}
// Появление плитки (2 или 4) в случайной пустой клетке
function spawnTile() {
    let empty = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length === 0) return;

    const pos = empty[Math.floor(Math.random() * empty.length)];
    matrix[pos.r][pos.c] = Math.random() < 0.9 ? 2 : 4;
}

// Стартовые 2–3 плитки
const startTiles = Math.floor(Math.random() * 2) + 2; // 2 или 3
for (let i = 0; i < startTiles; i++) {
    spawnTile();
}

// Отрисовать начальное состояние
drawBoard();

// Заглушки для будущих функций
function moveLeft() {}
function moveRight() {}
function moveUp() {}
function moveDown() {}
function saveState() {}
function loadState() {}
function checkGameOver() {}