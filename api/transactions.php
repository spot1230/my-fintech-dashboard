
<?php
require_once 'config.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "Session user_id missing"]);
    exit;
}

try {
    // Fetch latest transactions for user
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC");
    $stmt->execute([$user_id]);
    $results = $stmt->fetchAll();

    // Cast types for JSON consistency
    $formatted = array_map(function($row) {
        $row['amount'] = (float)$row['amount'];
        return $row;
    }, $results);

    echo json_encode($formatted);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Fetch Failed: " . $e->getMessage()]);
}
?>
