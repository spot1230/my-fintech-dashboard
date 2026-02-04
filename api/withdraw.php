
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['user_id'] ?? '';
$amount = (float)($input['amount'] ?? 0);
$wallet_address = $input['wallet_address'] ?? '';

if (!$user_id || $amount <= 0 || !$wallet_address) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid withdrawal request"]);
    exit;
}

try {
    // Check user balance
    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user || $user['balance'] < $amount) {
        http_response_code(400);
        echo json_encode(["error" => "Insufficient funds"]);
        exit;
    }

    $tx_id = 'tx_' . bin2hex(random_bytes(6));
    $date = date('Y-m-d');

    // Record pending withdrawal
    $insert = $pdo->prepare("INSERT INTO transactions (id, user_id, type, amount, date, status, description, wallet_address) 
                             VALUES (?, ?, 'withdrawal', ?, ?, 'pending', 'Crypto Withdrawal Request', ?)");
    $insert->execute([$tx_id, $user_id, -$amount, $date, $wallet_address]);

    echo json_encode(["success" => true, "message" => "Withdrawal request submitted for review"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
?>
