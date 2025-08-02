// JavaScript para a página de login
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de login carregada');
    
    // Inicializar funcionalidades
    initForm();
    initValidation();
    checkRememberMe();
});

// Função para inicializar o formulário
function initForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitLogin();
        }
    });
}

// Função para inicializar validação
function initValidation() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Função para validar o formulário
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Função para validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Limpar erro anterior
    clearFieldError(field);
    
    // Validações específicas
    switch(fieldName) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'E-mail inválido');
                return false;
            }
            break;
            
        case 'senha':
            if (value.length < 6) {
                showFieldError(field, 'Senha deve ter pelo menos 6 caracteres');
                return false;
            }
            break;
    }
    
    // Validação geral para campos obrigatórios
    if (field.hasAttribute('required') && value === '') {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    return true;
}

// Função para mostrar erro no campo
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Criar nova mensagem de erro
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#ff6b6b';
    errorMessage.style.fontSize = '0.875rem';
    errorMessage.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorMessage);
}

// Função para limpar erro do campo
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Função para enviar login
function submitLogin() {
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    
    // Converter FormData para objeto
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Adicionar dados extras
    data.timestamp = new Date().toISOString();
    data.source = 'login.html';
    
    // Mostrar loading
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    submitBtn.disabled = true;
    
    // Tentar login com banco de dados primeiro
    fetch('database/users_manager.php?action=login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Login realizado com sucesso:', result.message);
            
            // Salvar dados do usuário
            localStorage.setItem('usuarioLogado', JSON.stringify({
                email: result.user.email,
                nome: result.user.nome,
                timestamp: new Date().toISOString()
            }));
            
            // Salvar "lembrar de mim" se marcado
            if (data.lembrar) {
                saveRememberMe(data.email);
            }
            
            // Redirecionar para área de membros
            setTimeout(() => {
                window.location.href = 'membros.html';
            }, 1000);
            
        } else {
            console.error('Erro no login:', result.message);
            
            // Tentar login com localStorage como fallback
            if (authenticateWithLocalStorage(data.email, data.senha)) {
                // Salvar "lembrar de mim" se marcado
                if (data.lembrar) {
                    saveRememberMe(data.email);
                }
                
                // Redirecionar para área de membros
                setTimeout(() => {
                    window.location.href = 'membros.html';
                }, 1000);
                return;
            }
            
            showErrorModal(result.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        
        // Tentar login com localStorage como fallback
        if (authenticateWithLocalStorage(data.email, data.senha)) {
            // Salvar "lembrar de mim" se marcado
            if (data.lembrar) {
                saveRememberMe(data.email);
            }
            
            // Redirecionar para área de membros
            setTimeout(() => {
                window.location.href = 'membros.html';
            }, 1000);
            return;
        }
        
        showErrorModal('Erro de conexão. Tente novamente.');
    })
    .finally(() => {
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Função para autenticar com localStorage
function authenticateWithLocalStorage(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    const usuario = usuarios.find(user => 
        user.email === email && user.senha === senha
    );
    
    if (usuario) {
        // Salvar sessão do usuário
        localStorage.setItem('usuarioLogado', JSON.stringify({
            email: usuario.email,
            nome: usuario.nome || 'Usuário',
            timestamp: new Date().toISOString()
        }));
        
        return true;
    }
    
    return false;
}

// Função para salvar "lembrar de mim"
function saveRememberMe(email) {
    localStorage.setItem('lembrarEmail', email);
}

// Função para verificar "lembrar de mim"
function checkRememberMe() {
    const emailSalvo = localStorage.getItem('lembrarEmail');
    if (emailSalvo) {
        document.getElementById('email').value = emailSalvo;
        document.getElementById('lembrar').checked = true;
    }
}

// Função para mostrar modal de erro
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    modal.style.display = 'flex';
}

// Função para fechar modal de erro
function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none';
}

// Função para verificar se usuário está logado
function isUserLoggedIn() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) return false;
    
    const usuario = JSON.parse(usuarioLogado);
    const agora = new Date();
    const loginTime = new Date(usuario.timestamp);
    
    // Sessão expira em 24 horas
    const diffHours = (agora - loginTime) / (1000 * 60 * 60);
    
    if (diffHours > 24) {
        localStorage.removeItem('usuarioLogado');
        return false;
    }
    
    return true;
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Função para obter dados do usuário logado
function getLoggedUser() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        return JSON.parse(usuarioLogado);
    }
    return null;
}

// Verificar se já está logado e redirecionar
if (isUserLoggedIn()) {
    window.location.href = 'membros.html';
}

// Exportar funções para uso global
window.login = {
    validateForm: validateForm,
    submitLogin: submitLogin,
    isUserLoggedIn: isUserLoggedIn,
    logout: logout,
    getLoggedUser: getLoggedUser
}; 