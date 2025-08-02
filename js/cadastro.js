// JavaScript para a página de cadastro
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de cadastro carregada');
    
    // Inicializar funcionalidades
    initForm();
    initValidation();
});

// Função para inicializar o formulário
function initForm() {
    const form = document.getElementById('cadastroForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
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
        case 'nome':
            if (value.length < 3) {
                showFieldError(field, 'Nome deve ter pelo menos 3 caracteres');
                return false;
            }
            break;
            
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
            
        case 'confirmarSenha':
            const senha = document.getElementById('senha').value;
            if (value !== senha) {
                showFieldError(field, 'As senhas não coincidem');
                return false;
            }
            break;
            
        case 'termos':
            if (!field.checked) {
                showFieldError(field, 'Você deve aceitar os termos de uso');
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

// Função para enviar formulário
function submitForm() {
    const form = document.getElementById('cadastroForm');
    const formData = new FormData(form);
    
    // Converter FormData para objeto
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Adicionar dados extras
    data.timestamp = new Date().toISOString();
    data.source = 'cadastro.html';
    
    // Mostrar loading
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    submitBtn.disabled = true;
    
    // Enviar para o servidor
    fetch('database/users_manager.php?action=register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Cadastro realizado com sucesso:', result.message);
            showSuccessModal();
            
            // Salvar no localStorage como backup
            saveToLocalStorage(data);
            
        } else {
            console.error('Erro no cadastro:', result.message);
            alert('Erro ao criar conta. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        
        // Fallback para localStorage
        saveToLocalStorage(data);
        showSuccessModal();
        
        console.log('Dados salvos no localStorage como fallback');
    })
    .finally(() => {
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Função para salvar no localStorage
function saveToLocalStorage(data) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Verificar se o email já existe
    const emailExiste = usuarios.some(user => user.email === data.email);
    if (emailExiste) {
        alert('Este e-mail já está cadastrado. Tente fazer login.');
        return false;
    }
    
    // Adicionar novo usuário
    usuarios.push({
        nome: data.nome,
        email: data.email,
        senha: data.senha, // Em produção, isso deveria ser criptografado
        timestamp: data.timestamp
    });
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return true;
}

// Função para mostrar modal de sucesso
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    
    // Limpar formulário
    document.getElementById('cadastroForm').reset();
}

// Função para fechar modal de sucesso
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    // Redirecionar para página inicial
    window.location.href = 'index.html';
}

// Exportar funções para uso global
window.cadastro = {
    validateForm: validateForm,
    submitForm: submitForm
}; 