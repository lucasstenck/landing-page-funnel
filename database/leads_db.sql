-- Banco de Dados para Leads (Email e Nome Capturados)
-- Nome do banco: leads_database

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS leads_database;
USE leads_database;

-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    time_on_page INT NOT NULL,
    page_url VARCHAR(255) DEFAULT 'index.html',
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP NULL,
    notes TEXT,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_is_processed (is_processed)
);

-- Inserir alguns leads de teste
INSERT INTO leads (name, email, time_on_page, page_url, user_agent, ip_address) VALUES
('Ana Silva', 'ana.silva@email.com', 65, 'index.html', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100'),
('Carlos Santos', 'carlos@email.com', 72, 'index.html', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.101'),
('Fernanda Costa', 'fernanda@email.com', 58, 'index.html', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.102');

-- Mostrar estrutura da tabela
DESCRIBE leads;

-- Mostrar dados de teste
SELECT id, name, email, time_on_page, created_at FROM leads; 