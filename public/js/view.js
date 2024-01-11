export function hideElement(element) {
    element.classList.toggle("hide", true);
}

export function showElement(element) {
    element.classList.toggle("hide", false);
}

export function renderBoard(size) {
    const boardEl = document.getElementById("board");

    if (!boardEl) {
        throw new Error("There is no board");
    }

    boardEl.style.gridTemplateColumns = `repeat(${size}, auto)`;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            boardEl.innerHTML += `<div class="cell" id="cell_${i}_${j}" onclick="onCellClick(${i}, ${j})"></div>`;
        }
    }
}

export function clearBoard() {
    const boardEl = document.getElementById("board");
    if (boardEl) {
        boardEl.innerHTML = "";
    }
}

export function setMarkup(i, j, markup) {
    const cellEl = document.getElementById(`cell_${i}_${j}`);
    if (cellEl.innerText === "") {
        cellEl.innerText = markup;
        cellEl.classList.add("occupied");
    }
}

export function updateMsg(id, msg) {
    const endGameMsgEl = document.getElementById(id);
    endGameMsgEl.innerText = msg;
}

export function renderList(gamesInfo) {
    const listEl = document.getElementById("list");
    gamesInfo.forEach(info => {
        const ulEl = document.createElement("ul");
        ulEl.innerHTML += `<li>ID: ${info.id}</li>`;
        ulEl.innerHTML += `<li>Board size: ${info.sizeBoard}</li>`;
        ulEl.innerHTML += `<li>Date: ${info.gameDate}</li>`;
        ulEl.innerHTML += `<li>Player name: ${info.playerName}</li>`;
        ulEl.innerHTML += `<li>Player markup: ${info.playerMarkup}</li>`;
        ulEl.innerHTML += `<li>Winner markup: ${info.winnerMarkup}</li>`;
        listEl.appendChild(ulEl);
        listEl.appendChild(document.createElement("br"));
    });
}

export function addBoardToReply(board) {
    const replyEl = document.getElementById("reply");

    if (!replyEl) {
        throw new Error("There is no reply element");
    }

    replyEl.appendChild(getRenderedBoard(board));
}

function getRenderedBoard(board) {
    const size = board.getDimension();
    const boardArr = board.getBoardArr();
    
    const boardEl = document.createElement("div");
    boardEl.classList.add("board");
    boardEl.style.gridTemplateColumns = `repeat(${size}, auto)`;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            boardEl.innerHTML += `<div class="cell">${boardArr[i][j]}</div>`;
        }
    }

    return boardEl;
}
