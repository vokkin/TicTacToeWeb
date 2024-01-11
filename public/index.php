<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

use Vokkin\TicTacToe\GameModel;
use VoKKin\TicTacToe\GamesRepository;

$app = AppFactory::create();
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$app->get('/', function (Request $request, Response $response) {
    return $response->withStatus(301)->withHeader('Location', '/index.html');
});

$app->post('/games', function (Request $request, Response $response) {
    $gameModel = new GameModel();
    $gameModel->mapFromJson($request->getBody());

    $repository = new GamesRepository();
    $repository->add($gameModel);

    $gameModelJson = json_encode($gameModel, JSON_PRETTY_PRINT);
    $response->getBody()->write($gameModelJson);
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});

$app->get('/games', function (Request $request, Response $response) {
    $repository = new GamesRepository();
    $games = $repository->getAll();

    $gamesJson = json_encode($games, JSON_PRETTY_PRINT);
    $response->getBody()->write($gamesJson);
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});

$app->get('/game/{id}', function (Request $request, Response $response, array $args) {
    $id = $args['id'];
    $repository = new GamesRepository();

    try {
        $game = $repository->getById($id);
    } catch (Exception $e) {
        $game = null;
    }

    $gameJson = json_encode($game, JSON_PRETTY_PRINT);
    $response->getBody()->write($gameJson);
    $response = $response->withHeader('Content-Type', 'application/json');
    return $response;
});

$app->run();
