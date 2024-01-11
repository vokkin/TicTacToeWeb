const DEFAULT_DIMENSION = 3;
const DEFAULT_MARKUP = " ";

export const PLAYER_X_MARKUP = "X";
export const PLAYER_O_MARKUP = "O";

export class Board {
    #dimension;
    #boardArr;
    #checkArr;
    #userMarkup;
    #computerMarkup;
    #freeSpaceCount;

    constructor() {
        this.#dimension = DEFAULT_DIMENSION;
        this.#boardArr = [];
        this.#checkArr = [];
        this.#userMarkup = DEFAULT_MARKUP;
        this.#computerMarkup = DEFAULT_MARKUP;
        this.#freeSpaceCount = 0;
    }

    initialize() {
        this.#initializeBoardArr();
        this.#initializeCheckArr();
        this.#initializeMarkup();
        this.#initializeFreeSpace();
    }

    #initializeBoardArr() {
        this.#boardArr = [];

        for (let i = 0; i < this.#dimension; i++) {
            const row = [];
            for (let j = 0; j < this.#dimension; j++) {
                row.push(DEFAULT_MARKUP);
            }

            this.#boardArr.push(row);
        }
    }

    #initializeCheckArr() {
        this.#checkArr = [];

        for (let i = 0; i < 2 * this.#dimension + 2; i++) {
            this.#checkArr[i] = 0;
        }
    }

    #initializeMarkup() {
        if (Math.round(Math.random()) === 0) {
            this.#userMarkup = PLAYER_X_MARKUP;
            this.#computerMarkup = PLAYER_O_MARKUP;
        } else {
            this.#userMarkup = PLAYER_O_MARKUP;
            this.#computerMarkup = PLAYER_X_MARKUP;
        }
    }

    #initializeFreeSpace() {
        this.#freeSpaceCount = Math.pow(this.#dimension, 2);
    }

    determineWinner(i, j) {
        if (this.#checkArr[i] === this.#dimension || this.#checkArr[this.#dimension + j] === this.#dimension) {
            return PLAYER_X_MARKUP;
        } else if (this.#checkArr[i] === -this.#dimension || this.#checkArr[this.#dimension + j] === -this.#dimension) {
            return PLAYER_O_MARKUP;
        }

        if (this.#checkArr[2 * this.#dimension] === this.#dimension || this.#checkArr[2 * this.#dimension + 1] === this.#dimension) {
            return PLAYER_X_MARKUP;
        } else if (this.#checkArr[2 * this.#dimension] === -this.#dimension || this.#checkArr[2 * this.#dimension + 1] === -this.#dimension) {
            return PLAYER_O_MARKUP;
        } else {
            return "";
        }
    }

    setMarkupOnBoard(i, j, markup) {
        if (!this.#isCoordsCorrect(i, j)) {
            return false;
        }
        if (this.#isSetPossible(i, j)) {
            this.#boardArr[i][j] = markup;
            this.#updateCheckArr(i, j, markup);
            this.#freeSpaceCount--;
            
            return true;
        }
        
        return false;
    }

    #isCoordsCorrect(i, j) {
        return !isNaN(i) && !isNaN(j) && i >= 0 && i < this.#dimension && j >= 0 && j < this.#dimension;
    }

    #isSetPossible(i, j) {
        return this.#boardArr[i][j] === DEFAULT_MARKUP;
    }

    #updateCheckArr(i, j, markup) {
        let offset = 1;
        if (markup === PLAYER_O_MARKUP) {
            offset = -1;
        }

        this.#checkArr[i] += offset;
        this.#checkArr[this.#dimension + j] += offset;

        if ((i === j) && (i === (this.#dimension - 1 - j))) {
            this.#checkArr[2 * this.#dimension] += offset;
            this.#checkArr[2 * this.#dimension + 1] += offset;
        } else if (i === j) {
            this.#checkArr[2 * this.#dimension] += offset;
        } else if (i === (this.#dimension - 1 - j)) {
            this.#checkArr[2 * this.#dimension + 1] += offset;
        }
    }

    setDimension(dim) {
        if (!isNaN(dim) && dim >= 3 && dim <= 10) {
            this.#dimension = dim;
        } else {
            throw new Error("Incorrect dimension (should be 3 <= dim <= 10). Please try again.");
        }
    }

    getBoardArr() {
        return this.#boardArr;
    }

    getDimension() {
        return this.#dimension;
    }

    getUserMarkup() {
        return this.#userMarkup;
    }

    getComputerMarkup() {
        return this.#computerMarkup;
    }

    isFreeSpaceEnough() {
        return this.#freeSpaceCount !== 0;
    }
}
