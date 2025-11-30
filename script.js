console.log("Игра 2048 — проект инициализирован");

// Получаем элементы DOM для игрового поля, счетчика, кнопок и модальных окон
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

// Матрица, которая хранит текущие значения плиток
let matrix = Array.from({ length: size }, () => Array(size).fill(0));

// Текущий счет игрока
let score = 0;

// История состояний для возможности отмены хода
let history = [];

// Функция отрисовки игрового поля
function drawBoard() {
    board.innerHTML = ""; // очищаем поле
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (matrix[r][c] !== 0) {
                cell.textContent = matrix[r][c]; // если плитка не пустая, показываем число
            }
            board.appendChild(cell);
        }
    }
    scoreEl.textContent = score; // обновляем счет на экране
}

// Функция появления новой плитки (2 или 4) в случайной пустой клетке
function spawnTile() {
    let empty = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length === 0) return; // если нет пустых клеток, не добавляем плитку

    const pos = empty[Math.floor(Math.random() * empty.length)];
    matrix[pos.r][pos.c] = Math.random() < 0.9 ? 2 : 4;
}

// Генерируем 2 или 3 стартовые плитки
const startTiles = Math.floor(Math.random() * 2) + 2;
for (let i = 0; i < startTiles; i++) spawnTile();

// Сохраняем текущее состояние поля и счета для возможности отмены хода
function saveState() {
    history.push({
        matrix: matrix.map(row => row.slice()),
        score
    });
    if (history.length > 20) history.shift(); // храним максимум 20 последних состояний
}

// Движение плиток влево
function moveLeft() {
    saveState(); // сохраняем предыдущее состояние
    let moved = false;

    for (let r = 0; r < size; r++) {
        let row = matrix[r].filter(v => v !== 0); // убираем нули для обработки слияний

        // Слияние одинаковых плиток
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;       // сливаем плитки
                score += row[i];   // добавляем очки
                row[i + 1] = 0;    // следующую плитку обнуляем
                i++;               // пропускаем следующую плитку после слияния
            }
        }

        row = row.filter(v => v !== 0); // убираем новые нули после слияния
        while (row.length < size) row.push(0); // добиваем до длины поля

        if (matrix[r].some((v, idx) => v !== row[idx])) moved = true; // проверяем, было ли движение
        matrix[r] = row; // обновляем строку
    }

    if (moved) spawnTile(); // если плитки двигались, добавляем новую плитку
    drawBoard();            // перерисовываем поле
}

// Движение плиток вправо
function moveRight() {
    saveState();
    let moved = false;

    for (let r = 0; r < size; r++) {
        let row = matrix[r].filter(v => v !== 0);

        for (let i = row.length - 1; i > 0; i--) {
            if (row[i] === row[i - 1]) {
                row[i] *= 2;
                score += row[i];
                row[i - 1] = 0;
                i--;
            }
        }

        row = row.filter(v => v !== 0);
        while (row.length < size) row.unshift(0);

        if (matrix[r].some((v, idx) => v !== row[idx])) moved = true;
        matrix[r] = row;
    }

    if (moved) spawnTile();
    drawBoard();
}

// Движение плиток вверх
function moveUp() {
    saveState();
    let moved = false;

    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) {
            if (matrix[r][c] !== 0) col.push(matrix[r][c]);
        }

        for (let i = 0; i < col.length - 1; i++) {
            if (col[i] === col[i + 1]) {
                col[i] *= 2;
                score += col[i];
                col[i + 1] = 0;
                i++;
            }
        }

        col = col.filter(v => v !== 0);
        while (col.length < size) col.push(0);

        for (let r = 0; r < size; r++) {
            if (matrix[r][c] !== col[r]) moved = true;
            matrix[r][c] = col[r];
        }
    }

    if (moved) spawnTile();
    drawBoard();
}

// Движение плиток вниз
function moveDown() {
    saveState();
    let moved = false;

    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) {
            if (matrix[r][c] !== 0) col.push(matrix[r][c]);
        }

        for (let i = col.length - 1; i > 0; i--) {
            if (col[i] === col[i - 1]) {
                col[i] *= 2;
                score += col[i];
                col[i - 1] = 0;
                i--;
            }
        }

        col = col.filter(v => v !== 0);
        while (col.length < size) col.unshift(0);

        for (let r = 0; r < size; r++) {
            if (matrix[r][c] !== col[r]) moved = true;
            matrix[r][c] = col[r];
        }
    }

    if (moved) spawnTile();
    drawBoard();
}

// Отрисовка начального состояния поля
drawBoard();