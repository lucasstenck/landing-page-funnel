<?php
// Configuração dos Bancos de Dados MySQL

// Configurações do banco de dados de usuários
define('USERS_DB_HOST', 'localhost');
define('USERS_DB_NAME', 'users_database');
define('USERS_DB_USER', 'dietatransform_user');
define('USERS_DB_PASS', 'DietaTransform2024!');

// Configurações do banco de dados de leads
define('LEADS_DB_HOST', 'localhost');
define('LEADS_DB_NAME', 'leads_database');
define('LEADS_DB_USER', 'dietatransform_user');
define('LEADS_DB_PASS', 'DietaTransform2024!');

// Função para conectar ao banco de usuários
function connectUsersDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . USERS_DB_HOST . ";dbname=" . USERS_DB_NAME . ";charset=utf8mb4",
            USERS_DB_USER,
            USERS_DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("Erro na conexão com banco de usuários: " . $e->getMessage());
    }
}

// Função para conectar ao banco de leads
function connectLeadsDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . LEADS_DB_HOST . ";dbname=" . LEADS_DB_NAME . ";charset=utf8mb4",
            LEADS_DB_USER,
            LEADS_DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        die("Erro na conexão com banco de leads: " . $e->getMessage());
    }
}

// Função para testar conexões
function testConnections() {
    echo "<h2>Testando Conexões com Bancos de Dados</h2>";
    
    // Testar banco de usuários
    try {
        $usersDB = connectUsersDB();
        echo "<p style='color: green;'>✅ Conexão com banco de usuários: OK</p>";
        
        // Testar consulta
        $stmt = $usersDB->query("SELECT COUNT(*) as total FROM users");
        $result = $stmt->fetch();
        echo "<p>Total de usuários: " . $result['total'] . "</p>";
        
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Erro no banco de usuários: " . $e->getMessage() . "</p>";
    }
    
    // Testar banco de leads
    try {
        $leadsDB = connectLeadsDB();
        echo "<p style='color: green;'>✅ Conexão com banco de leads: OK</p>";
        
        // Testar consulta
        $stmt = $leadsDB->query("SELECT COUNT(*) as total FROM leads");
        $result = $stmt->fetch();
        echo "<p>Total de leads: " . $result['total'] . "</p>";
        
    } catch (Exception $e) {
        echo "<p style='color: red;'>❌ Erro no banco de leads: " . $e->getMessage() . "</p>";
    }
}
?> 