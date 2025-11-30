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
let history = [];
const startTiles = Math.floor(Math.random() * 2) + 2;

// Отрисовка игрового поля
function drawBoard() {
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (matrix[r][c] !== 0) {
                cell.textContent = matrix[r][c];
                cell.setAttribute("data-value", matrix[r][c]);

                // Анимация слияния плиток
                if (matrix[r][c + 1] === 0 || matrix[r + 1]?.[c] === 0) {
                    cell.classList.add("merge");
                    setTimeout(() => cell.classList.remove("merge"), 200);
                }
            }
            board.appendChild(cell);
        }
    }

    scoreEl.textContent = score;

    if (checkGameOver()) {
        gameOverModal.classList.remove("hidden");
    }
}

// Генерация новой плитки
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

// Генерация начальных плиток
for (let i = 0; i < startTiles; i++) spawnTile();

// Сохранение состояния для Undo
function saveState() {
    history.push({
        matrix: matrix.map(row => row.slice()),
        score
    });
    if (history.length > 20) history.shift();
}

// Undo
function undo() {
    if (history.length === 0) return;
    const lastState = history.pop();
    matrix = lastState.matrix.map(row => row.slice());
    score = lastState.score;
    drawBoard();
}

// Движение плиток влево
function moveLeft() {
    saveState();
    let moved = false;

    for (let r = 0; r < size; r++) {
        let row = matrix[r].filter(v => v !== 0);

        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
                i++;
            }
        }

        row = row.filter(v => v !== 0);
        while (row.length < size) row.push(0);

        if (matrix[r].some((v, idx) => v !== row[idx])) moved = true;
        matrix[r] = row;
    }

    if (moved) spawnTile();
    drawBoard();
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
        for (let r = 0; r < size; r++) if (matrix[r][c] !== 0) col.push(matrix[r][c]);

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
        for (let r = 0; r < size; r++) if (matrix[r][c] !== 0) col.push(matrix[r][c]);

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

// Проверка окончания игры
function checkGameOver() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c] === 0) return false;
            if (c < size - 1 && matrix[r][c] === matrix[r][c + 1]) return false;
            if (r < size - 1 && matrix[r][c] === matrix[r + 1][c]) return false;
        }
    }
    return true;
}

// Получение и сохранение лидерборда
function getLeaderboard() {
    return JSON.parse(localStorage.getItem("leaderboard") || "[]");
}

function saveLeaderboard(name, score) {
    const leaderboard = getLeaderboard();
    leaderboard.push({
        name: name || "Игрок",
        score: score,
        date: new Date().toLocaleString()
    });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 10)));
    showLeaderboard();
}

// Отображение таблицы лидеров
function showLeaderboard() {
    leaderboardModal.classList.remove("hidden");

    while (recordsTable.firstChild) {
        recordsTable.removeChild(recordsTable.firstChild);
    }

    const headerRow = document.createElement("tr");
    ["Имя", "Очки", "Дата"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    recordsTable.appendChild(headerRow);

    const leaderboard = getLeaderboard();
    leaderboard.forEach(record => {
        const row = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = record.name;
        row.appendChild(tdName);

        const tdScore = document.createElement("td");
        tdScore.textContent = record.score;
        row.appendChild(tdScore);

        const tdDate = document.createElement("td");
        tdDate.textContent = record.date;
        row.appendChild(tdDate);

        recordsTable.appendChild(row);
    });
}

// Обработчики событий
document.addEventListener("keydown", e => {
    switch(e.key) {
        case "ArrowLeft": moveLeft(); break;
        case "ArrowRight": moveRight(); break;
        case "ArrowUp": moveUp(); break;
        case "ArrowDown": moveDown(); break;
    }
});

controls.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        switch(btn.dataset.dir) {
            case "up": moveUp(); break;
            case "down": moveDown(); break;
            case "left": moveLeft(); break;
            case "right": moveRight(); break;
        }
    });
});

undoBtn.addEventListener("click", undo);
restartBtn.addEventListener("click", restartGameBtn.click);

restartGameBtn.addEventListener("click", () => {
    matrix = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    history = [];
    for (let i = 0; i < startTiles; i++) spawnTile();
    gameOverModal.classList.add("hidden");
    drawBoard();
});

saveScoreBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    saveLeaderboard(name, score);
    gameOverModal.querySelector("p").textContent = "Ваш рекорд сохранен!";
    playerNameInput.classList.add("hidden");
    saveScoreBtn.classList.add("hidden");
});

showLeaderboardBtn.addEventListener("click", showLeaderboard);
closeLeaderboardBtn.addEventListener("click", () => {
    leaderboardModal.classList.add("hidden");
});

drawBoard();