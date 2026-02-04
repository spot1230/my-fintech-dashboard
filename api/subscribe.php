
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['user_id'] ?? '';
$plan_id = $input['plan_id'] ?? '';
$amount = (float)($input['amount'] ?? 0);

if (!$user_id || !$plan_id || $amount <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid subscription parameters"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Verify balance
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? FOR UPDATE");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user || $user['balance'] < $amount) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(["error" => "Insufficient balance"]);
        exit;
    }

    // Update user balance and investments
    $update = $pdo->prepare("UPDATE users SET balance = balance - ?, active_investments = active_investments + ? WHERE id = ?");
    $update->execute([$amount, $amount, $user_id]);

    // Record transaction
    $tx_id = 'tx_' . bin2hex(random_bytes(6));
    $date = date('Y-m-d');
    $desc = "Investment Subscription: " . $plan_id;
    
    $insert = $pdo->prepare("INSERT INTO transactions (id, user_id, type, amount, date, status, description) 
                             VALUES (?, ?, 'investment', ?, ?, 'completed', ?)");
    $insert->execute([$tx_id, $user_id, -$amount, $date, $desc]);

    $pdo->commit();

    // Return updated user object
    $stmt = $pdo->prepare("SELECT id, name, email, balance, active_investments, total_profit, avatar FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $updated_user = $stmt->fetch();
    
    // Cast numeric strings
    $updated_user['balance'] = (float)$updated_user['balance'];
    $updated_user['active_investments'] = (float)$updated_user['active_investments'];
    $updated_user['total_profit'] = (float)$updated_user['total_profit'];

    echo json_encode(["success" => true, "user" => $updated_user]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Investment failed: " . $e->getMessage()]);
}
?>
