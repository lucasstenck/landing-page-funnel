-- Script para criar o banco de dados de usuários
-- Execute este script no MySQL Workbench

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS users_database;
USE users_database;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Inserir alguns usuários de exemplo (senhas são hashes de '123456')
INSERT INTO users (nome, email, senha) VALUES
('João Silva', 'joao@exemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Maria Santos', 'maria@exemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Pedro Costa', 'pedro@exemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Verificar se a tabela foi criada corretamente
SELECT COUNT(*) as total_usuarios FROM users; 