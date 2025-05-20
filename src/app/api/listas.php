<?php

// CORS - debe ir antes de cualquier salida
if ($_SERVER ['REQUEST_METHOD'] === 'OPTIONS') {
    header ("Access-Control-Allow-Origin: *");
    header ("Access-Control-Allow-Headers: Content-Type");
    header ("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code (200);
    exit;
}

header ("Access-Control-Allow-Origin: *");
header ("Content-Type: application/json");

require_once 'model/database.php';

// Soporte JSON
if (strpos ($_SERVER ['CONTENT_TYPE'], 'application/json') !== false) {
    $_POST = json_decode (file_get_contentsc("php://input"), true);
} // Fin Si

// Conexión
$db = new Database();
$pdo = $db -> getConnection();

// Debug Log
file_put_contents ('debug.log', "--- NUEVA PETICIÓN ---\n", FILE_APPEND);
file_put_contents ('debug.log', print_r ($_POST, true), FILE_APPEND);

$action = $_POST ['action'] ?? '';

switch ($action) {
    case 'getByUserId': 
        file_put_contents ('debug.log', ">> Entrando en getByUserId\n", FILE_APPEND);
        $userId = $_POST ['user_id'] ?? null;

        $stmt = $pdo -> prepare ("SELECT * FROM listas WHERE user_id = ?");
        $stmt -> execute ([$userId]);
        $listas = $stmt -> fetchAll (PDO:: FETCH_ASSOC);

        foreach ($listas as &$lista) {
            $stmt2 = $pdo -> prepare ("SELECT mal_id, titulo, imagen, estado, puntuacion FROM listas_animes WHERE lista_id = ?");
            $stmt2 -> execute ([$lista ['id']]);
            $lista ['animes'] = $stmt2 -> fetchAll (PDO:: FETCH_ASSOC);
        }

        echo json_encode ($listas);
        break;
       
    case 'createCustomList':
        file_put_contents ('debug.log', ">> Entrando en createCustomList\n", FILE_APPEND);
        $userId = $_POST ['user_id'] ?? null;
        $nombre = $_POST ['nombre'] ?? '';

        $stmt = $pdo -> prepare ("INSERT INTO listas (user_id, nombre) VALUES (?, ?)");
        $stmt -> execute ([$userId, $nombre]);

        echo json_encode (['success' => true, 'lista_id' => $pdo -> lastInsertId()]);
        break;

    case 'update':
        file_put_contents ('debug.log', ">> Entrando en UPDATE\n", FILE_APPEND);
        $listaId = $_POST ['lista_id'] ?? null;
        $nuevoNombre = $_POST ['nombre'] ?? '';
        file_put_contents ('debug.log', "lista_id: $listaId, nombre: $nuevoNombre\n", FILE_APPEND);

        $stmt = $pdo -> prepare ("UPDATE listas SET nombre = ? WHERE id = ?");
        $stmt -> execute ([$nuevoNombre, $listaId]);

        echo json_encode (['success' => true]);
        break;

    case 'delete':
        file_put_contents ('debug.log', ">> Entrando en DELETE\n", FILE_APPEND);
        $listaId = $_POST ['lista_id'] ?? null;
        file_put_contents ('debug.log', "lista_id: $listaId\n", FILE_APPEND);

        $stmt1 = $pdo -> prepare ("DELETE FROM listas_animes WHERE lista_id = ?");
        $stmt1 -> execute ([$listaId]);

        $stmt2 = $pdo -> prepare ("DELETE FROM listas WHERE id = ?");
        $stmt2 -> execute ([$listaId]);

        echo json_encode (['success' => true]);
        break;

    case 'addAnime':
        file_put_contents ('debug.log', ">> Entrando en addAnime\n", FILE_APPEND);
        $listaId = $_POST ['lista_id'] ?? null;
        $malId = $_POST ['mal_id'] ?? null;
        $estado = $_POST ['estado'] ?? null;
        $puntuacion = $_POST ['puntuacion'] ?? null;
        $titulo = $_POST ['titulo'] ?? null;
        $imagen = $_POST ['imagen'] ?? null;

        file_put_contents ('debug.log', "lista_id: $listaId, mal_id: $malId, titulo: $titulo\n", FILE_APPEND);

        // Comprobar si Ya Existe
        $checkStmt = $pdo -> prepare ("SELECT COUNT (*) FROM listas_animes WHERE lista_id = ? AND mal_id = ?");
        $checkStmt -> execute ([$listaId, $malId]);
        $existe = $checkStmt -> fetchColumn();

        if ($existe > 0) {
            echo json_encode (['success' => false, 'error' => 'Este Anime Ya Está en la Lista']);
            exit; 
        } // Fin Si

        // Insertar si NO Existe
        $stmt = $pdo -> prepare ("INSERT INTO listas_animes (lista_id, mal_id, estado, puntuacion, titulo, imagen) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt -> execute ([$listaId, $malId, $estado, $puntuacion, $titulo, $imagen]);

        echo json_encode (['success' => true]);
        break;

    case 'removeAnime':
        file_put_contents ('debug.log', ">> Entrando en removeAnime\n", FILE_APPEND);
        $listaId = $_POST ['lista_id'] ?? null;
        $malId = $_POST ['mal_id'] ?? null;

        if (!$lista || !$malId) {
            echo json_encode (['ok' => false, 'error' => 'Faltan Parámetros']);
            exit;
        } // Fin Si

        $stmt = $pdo -> prepare ("DELETE FROM listas_animes WHERE lista_id = ? AND mal_id = ?");
        $stmt -> execute ([$listaId, $malId]);

        echo json_encode (['ok' => true, 'mensaje' => 'Anime ELiminado']);
        break;

    default:
        echo json_encode (['ok' => true, 'mensaje' => 'Backend Operativo']);
        break;
}

?>