<?php

namespace VoKKin\TicTacToe;

class GameModel {
    public int $id;
    public int $sizeBoard;
    public string $gameDate;
    public string $playerName;
    public string $playerMarkup;
    public string $winnerMarkup;
    public string $xCoords;
    public string $oCoords;

    public function mapFromJson($json): void {
        $data = json_decode($json);
        $this->sizeBoard = $data->{"sizeBoard"};
        $this->playerName = $data->{"playerName"};
        $this->playerMarkup = $data->{"playerMarkup"};
        $this->winnerMarkup = $data->{"winnerMarkup"};
        $this->xCoords = $data->{"xCoords"};
        $this->oCoords = $data->{"oCoords"};
    }
}
