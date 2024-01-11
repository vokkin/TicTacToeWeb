export class ClientApi {
    #xhr;

    constructor() {
        this.#xhr = new XMLHttpRequest();
    }

    createGame(game) {
        return new Promise((resolve, reject) => {
            this.#xhr.open("POST", "/games", true);
            this.#xhr.setRequestHeader("Content-Type", "application/json");
            
            this.#xhr.onreadystatechange = function () {
                if (this.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
            
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(Error(this.statusText));
                }
            };
            
            this.#xhr.send(JSON.stringify(game));
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.#xhr.open("GET", "/games", true);

            this.#xhr.onreadystatechange = function () {
                if (this.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
            
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(Error(this.statusText));
                }
            };

            this.#xhr.send();
        });
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            this.#xhr.open("GET", `/game/${id}`, true);

            this.#xhr.onreadystatechange = function () {
                if (this.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
            
                if (this.status == 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(Error(this.statusText));
                }
            };

            this.#xhr.send();
        });
    }

}
