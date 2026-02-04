
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

try {
    // Check if user exists
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit;
    }

    $id = 'usr_' . bin2hex(random_bytes(6));
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $avatar = "https://ui-avatars.com/api/?name=" . urlencode($name) . "&background=random";

    $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, avatar) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $email, $hashed_password, $avatar]);

    echo json_encode([
        "id" => $id,
        "name" => $name,
        "email" => $email,
        "balance" => 0,
        "active_investments" => 0,
        "total_profit" => 0,
        "avatar" => $avatar
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Registration failed"]);
}
?>
