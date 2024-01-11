import * as view from "./view.js";
import { PLAYER_X_MARKUP, PLAYER_O_MARKUP, Board } from "./model.js";
import { ClientApi } from "./client.api.js";

let gameBoard = new Board();
let clientApi = new ClientApi();

let username = "";
let currentMarkup = PLAYER_X_MARKUP;
let winnerMarkup = currentMarkup;
let endGameMsg = "";
let stopGame = false;

let xCoords = "";
let oCoords = "";

const playBtn = document.getElementById("play-btn");
const listBtn = document.getElementById("list-btn");
const replyBtn = document.getElementById("reply-btn");

playBtn.addEventListener("click", () => {
    view.hideElement(document.getElementById("menu-wrapper"));
    view.showElement(document.getElementById("board-wrapper"));

    play();
});

listBtn.addEventListener("click", () => {
    view.hideElement(document.getElementById("menu-wrapper"));
    view.showElement(document.getElementById("list-wrapper"));

    list();
});

replyBtn.addEventListener("click", () => {
    view.hideElement(document.getElementById("menu-wrapper"));
    view.showElement(document.getElementById("reply-wrapper"));

    reply();
});

async function play() {
    view.clearBoard();
    initialize();
    gameLoop();
}

function initialize() {
    const usernameStr = prompt('Enter your name (Default name - "Guest")');
    username = usernameStr ? usernameStr : "Guest";

    setBoardSize();
    gameBoard.initialize();
    view.renderBoard(gameBoard.getDimension());
    xCoords = "";
    oCoords = "";
}

function setBoardSize() {
    let isSetSuccess = false;

    do {
        try {
            const size = prompt('Enter board size (Minimum - 3 Maximum - 10)');
            gameBoard.setDimension(+size);
            isSetSuccess = true;
        } catch (error) {
            alert(error);
            isSetSuccess = false;
        }
    } while (!isSetSuccess);
}

async function gameLoop() {
    if (currentMarkup === gameBoard.getComputerMarkup()) {
        processComputerTurn(currentMarkup);
        endGameMsg = "PC wins the game.";
        currentMarkup = gameBoard.getUserMarkup();
        
        if (stopGame) {
            await endGame();
            return;
        }
    }

    if (!gameBoard.isFreeSpaceEnough() && !stopGame) {
        endGameMsg = "Draw!";
        winnerMarkup = "Draw"
        stopGame = true;
        await endGame();
    }
}

async function endGame() {
    view.updateMsg("end-game-msg", endGameMsg);
    const result = await clientApi.createGame({
        sizeBoard: gameBoard.getDimension(),
        playerName: username,
        playerMarkup: gameBoard.getUserMarkup(),
        winnerMarkup: winnerMarkup,
        xCoords: xCoords.slice(0, -1),
        oCoords: oCoords.slice(0, -1)
    });
}

window.onCellClick = (i, j) => {
    if (stopGame) {
        return;
    }

    processUserTurn(i, j, currentMarkup);

    if (stopGame) {
        endGame();
    } else {
        gameLoop();
    }
}

window.onResetClick = () => {
    resetGame();
    play();
}

window.onRenew = () => {
    document.getElementById("reply").innerHTML = "";
    view.updateMsg("reply-msg", "");
    reply();
}

window.backToMenu = () => {
    resetGame();

    view.hideElement(document.getElementById("board-wrapper"));
    document.getElementById("board").innerHTML = "";
    
    view.hideElement(document.getElementById("list-wrapper"));
    document.getElementById("list").innerHTML = "";
    
    view.hideElement(document.getElementById("reply-wrapper"));
    document.getElementById("reply").innerHTML = "";
    
    view.showElement(document.getElementById("menu-wrapper"));
}

function resetGame() {
    currentMarkup = PLAYER_X_MARKUP;
    winnerMarkup = currentMarkup;

    endGameMsg = "";
    view.updateMsg("end-game-msg", endGameMsg);

    stopGame = false;
}

function processUserTurn(i, j, markup) {
    if (!gameBoard.setMarkupOnBoard(i, j, markup)) {
        return;
    }

    view.setMarkup(i, j, markup);
    recordMove(i, j);
    stopGame = gameBoard.determineWinner(i, j) !== "";
    winnerMarkup = currentMarkup;
    endGameMsg = `${username} wins the game.`;
    currentMarkup = gameBoard.getComputerMarkup(currentMarkup);
}

function processComputerTurn(markup) {
    if (!gameBoard.isFreeSpaceEnough()) {
        return;
    }

    let answerTaked = false;
    let i, j;
    do {
        i = getRandInt(0, gameBoard.getDimension() - 1);
        j = getRandInt(0, gameBoard.getDimension() - 1);

        try {
            if (gameBoard.setMarkupOnBoard(i, j, markup)) {
                stopGame = gameBoard.determineWinner(i, j) !== "";
                winnerMarkup = currentMarkup;
                answerTaked = true;
            }
        } catch (error) {}
    } while (!answerTaked);

    view.setMarkup(i, j, markup);
    recordMove(i, j);
}

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function recordMove(i, j) {
    if (currentMarkup === PLAYER_X_MARKUP) {
        xCoords += `(${i}; ${j}),`;
    } else {
        oCoords += `(${i}; ${j}),`;
    }
}

async function list() {
    const records = await clientApi.getAll();
    view.renderList(records);
}

async function reply() {
    const id = parseInt(prompt('Enter game ID'));
    if (!id) {
        await reply();
    }

    const game = await clientApi.getById(id);

    if (!game || Object.keys(game).length === 0) {
        view.updateMsg("reply-msg", "There is no game with this id");
        return;
    }

    const board = new Board();
    board.setDimension(game.sizeBoard);
    board.initialize();

    const xCoordsArr = game.xCoords.split(",");
    const oCoordsArr = game.oCoords.split(",");

    for (let i = 0; i < Math.max(xCoordsArr.length, oCoordsArr.length); i++) {
        if (xCoordsArr[i]) {
            const matches = xCoordsArr[i].match(/\d+/g);
            board.setMarkupOnBoard(matches[0], matches[1], PLAYER_X_MARKUP);
        }
        
        if (oCoordsArr[i]) {
            const matches = oCoordsArr[i].match(/\d+/g);
            board.setMarkupOnBoard(matches[0], matches[1], PLAYER_O_MARKUP);
        }

        view.addBoardToReply(board);
    }

    view.updateMsg("reply-msg", `Winner: ${game.winnerMarkup}`);
}
