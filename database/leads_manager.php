<?php
require_once 'config.php';

class LeadsManager {
    private $pdo;
    
    public function __construct() {
        $this->pdo = connectLeadsDB();
    }
    
    // Capturar novo lead
    public function captureLead($name, $email, $timeOnPage, $pageUrl = 'index.html') {
        try {
            // Verificar se email já existe
            $stmt = $this->pdo->prepare("SELECT id FROM leads WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                return ['success' => false, 'message' => 'Email já cadastrado'];
            }
            
            // Capturar informações do usuário
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
            $ipAddress = $this->getClientIP();
            
            // Inserir novo lead
            $stmt = $this->pdo->prepare("
                INSERT INTO leads (name, email, time_on_page, page_url, user_agent, ip_address) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$name, $email, $timeOnPage, $pageUrl, $userAgent, $ipAddress]);
            
            return ['success' => true, 'message' => 'Lead capturado com sucesso'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Erro ao capturar lead: ' . $e->getMessage()];
        }
    }
    
    // Buscar lead por ID
    public function getLeadById($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM leads WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch();
            
        } catch (Exception $e) {
            return null;
        }
    }
    
    // Listar todos os leads
    public function getAllLeads($limit = 100, $offset = 0) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT * FROM leads 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            ");
            $stmt->execute([$limit, $offset]);
            return $stmt->fetchAll();
            
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Buscar leads por email
    public function getLeadsByEmail($email) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM leads WHERE email = ? ORDER BY created_at DESC");
            $stmt->execute([$email]);
            return $stmt->fetchAll();
            
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Marcar lead como processado
    public function markAsProcessed($id, $notes = '') {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE leads 
                SET is_processed = 1, processed_at = NOW(), notes = ? 
                WHERE id = ?
            ");
            $stmt->execute([$notes, $id]);
            
            return ['success' => true, 'message' => 'Lead marcado como processado'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Erro ao processar lead: ' . $e->getMessage()];
        }
    }
    
    // Marcar lead como não processado
    public function markAsUnprocessed($id) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE leads 
                SET is_processed = 0, processed_at = NULL 
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            
            return ['success' => true, 'message' => 'Lead marcado como não processado'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Erro ao desmarcar lead: ' . $e->getMessage()];
        }
    }
    
    // Deletar lead
    public function deleteLead($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM leads WHERE id = ?");
            $stmt->execute([$id]);
            
            return ['success' => true, 'message' => 'Lead deletado com sucesso'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Erro ao deletar lead: ' . $e->getMessage()];
        }
    }
    
    // Atualizar lead
    public function updateLead($id, $data) {
        try {
            $fields = [];
            $values = [];
            
            foreach ($data as $field => $value) {
                if (in_array($field, ['name', 'email', 'notes'])) {
                    $fields[] = "$field = ?";
                    $values[] = $value;
                }
            }
            
            if (empty($fields)) {
                return ['success' => false, 'message' => 'Nenhum campo válido para atualizar'];
            }
            
            $values[] = $id;
            $sql = "UPDATE leads SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($values);
            
            return ['success' => true, 'message' => 'Lead atualizado com sucesso'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Erro ao atualizar lead: ' . $e->getMessage()];
        }
    }
    
    // Estatísticas dos leads
    public function getLeadStats() {
        try {
            $stats = [];
            
            // Total de leads
            $stmt = $this->pdo->query("SELECT COUNT(*) as total FROM leads");
            $stats['total'] = $stmt->fetch()['total'];
            
            // Leads processados
            $stmt = $this->pdo->query("SELECT COUNT(*) as processed FROM leads WHERE is_processed = 1");
            $stats['processed'] = $stmt->fetch()['processed'];
            
            // Leads não processados
            $stmt = $this->pdo->query("SELECT COUNT(*) as unprocessed FROM leads WHERE is_processed = 0");
            $stats['unprocessed'] = $stmt->fetch()['unprocessed'];
            
            // Últimos 7 dias
            $stmt = $this->pdo->query("SELECT COUNT(*) as recent FROM leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
            $stats['recent'] = $stmt->fetch()['recent'];
            
            // Média de tempo na página
            $stmt = $this->pdo->query("SELECT AVG(time_on_page) as avg_time FROM leads");
            $stats['avg_time'] = round($stmt->fetch()['avg_time'], 2);
            
            // Leads por página
            $stmt = $this->pdo->query("SELECT page_url, COUNT(*) as count FROM leads GROUP BY page_url");
            $stats['by_page'] = $stmt->fetchAll();
            
            return $stats;
            
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Exportar leads para CSV
    public function exportLeadsCSV() {
        try {
            $leads = $this->getAllLeads(10000); // Limite alto para exportar todos
            
            $filename = 'leads_export_' . date('Y-m-d_H-i-s') . '.csv';
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            
            $output = fopen('php://output', 'w');
            
            // Cabeçalho
            fputcsv($output, ['ID', 'Nome', 'Email', 'Tempo na Página', 'Página', 'IP', 'Data Criação', 'Processado']);
            
            // Dados
            foreach ($leads as $lead) {
                fputcsv($output, [
                    $lead['id'],
                    $lead['name'],
                    $lead['email'],
                    $lead['time_on_page'],
                    $lead['page_url'],
                    $lead['ip_address'],
                    $lead['created_at'],
                    $lead['is_processed'] ? 'Sim' : 'Não'
                ]);
            }
            
            fclose($output);
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Erro ao exportar: ' . $e->getMessage()];
        }
    }
    
    // Obter IP do cliente
    private function getClientIP() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'HTTP_CLIENT_IP', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

// Interface web para gerenciar leads
if (isset($_GET['action'])) {
    $manager = new LeadsManager();
    
    switch ($_GET['action']) {
        case 'list':
            $limit = $_GET['limit'] ?? 100;
            $offset = $_GET['offset'] ?? 0;
            $leads = $manager->getAllLeads($limit, $offset);
            echo json_encode($leads);
            break;
            
        case 'stats':
            $stats = $manager->getLeadStats();
            echo json_encode($stats);
            break;
            
        case 'capture':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $manager->captureLead(
                    $data['name'],
                    $data['email'],
                    $data['timeOnPage'],
                    $data['pageUrl'] ?? 'index.html'
                );
                echo json_encode($result);
            }
            break;
            
        case 'process':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $manager->markAsProcessed($data['id'], $data['notes'] ?? '');
                echo json_encode($result);
            }
            break;
            
        case 'unprocess':
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $manager->markAsUnprocessed($data['id']);
                echo json_encode($result);
            }
            break;
            
        case 'export':
            $manager->exportLeadsCSV();
            break;
    }
}
?> 