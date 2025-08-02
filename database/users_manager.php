<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir configuração do banco
require_once 'config.php';

// Função para registrar usuário
function registerUser($nome, $email, $senha) {
    try {
        $pdo = connectUsersDB();
        
        // Verificar se o email já existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            return ['success' => false, 'message' => 'E-mail já cadastrado'];
        }
        
        // Hash da senha
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
        
        // Inserir novo usuário
        $stmt = $pdo->prepare("INSERT INTO users (nome, email, senha, data_cadastro) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$nome, $email, $senhaHash]);
        
        return ['success' => true, 'message' => 'Usuário cadastrado com sucesso'];
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Erro ao cadastrar: ' . $e->getMessage()];
    }
}

// Função para fazer login
function loginUser($email, $senha) {
    try {
        $pdo = connectUsersDB();
        
        // Buscar usuário pelo email
        $stmt = $pdo->prepare("SELECT id, nome, email, senha FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return ['success' => false, 'message' => 'E-mail não encontrado'];
        }
        
        // Verificar senha
        if (password_verify($senha, $user['senha'])) {
            return [
                'success' => true, 
                'message' => 'Login realizado com sucesso',
                'user' => [
                    'id' => $user['id'],
                    'nome' => $user['nome'],
                    'email' => $user['email']
                ]
            ];
        } else {
            return ['success' => false, 'message' => 'Senha incorreta'];
        }
        
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Erro ao fazer login: ' . $e->getMessage()];
    }
}

// Processar requisições
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $nome = $data['nome'] ?? '';
            $email = $data['email'] ?? '';
            $senha = $data['senha'] ?? '';
            
            if (empty($nome) || empty($email) || empty($senha)) {
                echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
                exit;
            }
            
            $result = registerUser($nome, $email, $senha);
            echo json_encode($result);
        }
        break;
        
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $email = $data['email'] ?? '';
            $senha = $data['senha'] ?? '';
            
            if (empty($email) || empty($senha)) {
                echo json_encode(['success' => false, 'message' => 'E-mail e senha são obrigatórios']);
                exit;
            }
            
            $result = loginUser($email, $senha);
            echo json_encode($result);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não especificada']);
        break;
}
?> 