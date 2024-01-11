<?php

namespace VoKKin\TicTacToe;

use RedBeanPHP\Facade as R;
use Exception as Exception;
use VoKKin\TicTacToe\GameModel;

const DB_PATH = "../db/games.db";

class GamesRepository
{
    public function __construct()
    {
        if (!is_dir("../db")) {
            mkdir("../db");
        }

        R::setup("sqlite:" . DB_PATH);
        $this->createTable();
    }

    private function createTable(): void
    {
        $gamesInfoTable = "CREATE TABLE IF NOT EXISTS gamesInfo(
            id INTEGER PRIMARY KEY,
            sizeBoard INTEGER,
            gameDate DATETIME,
            playerName TEXT,
            playerMarkup TEXT,
            winnerMarkup TEXT,
            xCoords TEXT,
            oCoords TEXT
        )";
        R::exec($gamesInfoTable);
    }

    public function __destruct()
    {
        R::close();
    }

    public function add(GameModel $game): void
    {
        date_default_timezone_set("Europe/Moscow");
        $date = date("Y-m-d H:i:s");

        R::exec("INSERT INTO gamesInfo (
            sizeBoard, 
            gameDate, 
            playerName, 
            playerMarkup, 
            winnerMarkup, 
            xCoords, 
            oCoords
        ) VALUES (
            '$game->sizeBoard', 
            '$date', 
            '$game->playerName', 
            '$game->playerMarkup', 
            '$game->winnerMarkup', 
            '$game->xCoords', 
            '$game->oCoords'
        )");
    }

    public function getAll(): array
    {
        $result = [];

        $queryArr = R::getAll("SELECT * FROM gamesInfo");
        for ($i = 0; $i < count($queryArr); $i++) {
            $game = new GameModel();
            $game->id = $queryArr[$i]["id"];
            $game->sizeBoard = $queryArr[$i]["sizeBoard"];
            $game->gameDate = $queryArr[$i]["gameDate"];
            $game->playerName = $queryArr[$i]["playerName"];
            $game->playerMarkup = $queryArr[$i]["playerMarkup"];
            $game->winnerMarkup = $queryArr[$i]["winnerMarkup"];
            $game->xCoords = $queryArr[$i]["xCoords"];
            $game->oCoords = $queryArr[$i]["oCoords"];

            array_push($result, $game);
        }

        return $result;
    }

    public function getById($id): GameModel
    {
        if (!$this->idExists($id)) {
            throw new Exception("This id doesn't exist");
        }

        $result = new GameModel();

        $query = "SELECT * FROM gamesInfo WHERE id='$id'";
        $queryArr = R::getAll($query);
        for ($i = 0; $i < count($queryArr); $i++) {
            $result->id = $queryArr[$i]["id"];
            $result->sizeBoard = $queryArr[$i]["sizeBoard"];
            $result->gameDate = $queryArr[$i]["gameDate"];
            $result->playerName = $queryArr[$i]["playerName"];
            $result->playerMarkup = $queryArr[$i]["playerMarkup"];
            $result->winnerMarkup = $queryArr[$i]["winnerMarkup"];
            $result->xCoords = $queryArr[$i]["xCoords"];
            $result->oCoords = $queryArr[$i]["oCoords"];
        }

        return $result;
    }

    private function idExists($id): bool
    {
        $query = "SELECT EXISTS(SELECT 1 FROM gamesInfo WHERE id='$id')";
        return count(R::getRow($query)) >= 1;
    }
}
