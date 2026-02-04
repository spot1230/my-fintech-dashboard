
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

// Since we use FormData, we access data via $_POST and files via $_FILES
$user_id = $_POST['user_id'] ?? null;
$amount = (float)($_POST['amount'] ?? 0);
$method = $_POST['method'] ?? 'UNSPECIFIED';

if (!$user_id || $amount <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid deposit parameters"]);
    exit;
}

$tx_id = 'tx_' . bin2hex(random_bytes(6));
$date = date('Y-m-d');
$final_image_url = null;

// Handle Binary File Upload
if (isset($_FILES['proof_image']) && $_FILES['proof_image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . '/uploads/';
    
    // Create directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $file_tmp = $_FILES['proof_image']['tmp_name'];
    $file_ext = strtolower(pathinfo($_FILES['proof_image']['name'], PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'pdf'];

    if (!in_array($file_ext, $allowed_exts)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid file format. Allowed: JPG, PNG, PDF"]);
        exit;
    }

    // Secure file naming
    $new_filename = $tx_id . '.' . $file_ext;
    $upload_path = $upload_dir . $new_filename;

    if (move_uploaded_file($file_tmp, $upload_path)) {
        // Store relative path for frontend access
        $final_image_url = 'api/uploads/' . $new_filename;
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save upload on server"]);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Proof of payment is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO transactions (id, user_id, type, amount, date, status, description, proof_image) 
        VALUES (?, ?, 'deposit', ?, ?, 'pending', ?, ?)
    ");
    
    $desc = strtoupper($method) . " Payment Deposit Request";
    $stmt->execute([$tx_id, $user_id, $amount, $date, $desc, $final_image_url]);

    echo json_encode([
        "success" => true,
        "transaction_id" => $tx_id,
        "message" => "Deposit recorded. Verification in progress."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Transaction Failed: " . $e->getMessage()]);
}
?>
