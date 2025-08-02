// JavaScript para a área de membros
document.addEventListener('DOMContentLoaded', function() {
    console.log('Área de membros carregada');
    
    // Verificar se o usuário está logado
    if (!isUserLoggedIn()) {
        alert('Você precisa estar logado para acessar a área de membros.');
        window.location.href = 'login.html';
        return;
    }
    
    // Mostrar informações do usuário logado
    displayUserInfo();
    
    // Inicializar funcionalidades
    initDashboard();
    initAulas();
    initProgresso();
    initComunidade();
    initSuporte();
});

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

// Função para obter dados do usuário logado
function getLoggedUser() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        return JSON.parse(usuarioLogado);
    }
    return null;
}

// Função para exibir informações do usuário
function displayUserInfo() {
    const usuario = getLoggedUser();
    if (usuario) {
        const userInfoElement = document.querySelector('.user-info');
        if (userInfoElement) {
            const nome = usuario.nome || usuario.email || 'Usuário';
            // Pegar apenas o primeiro nome
            const primeiroNome = nome.split(' ')[0];
            userInfoElement.innerHTML = `
                <span>Bem-vindo, ${primeiroNome}</span>
                <button onclick="logout()" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Sair
                </button>
            `;
        }
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Função para inicializar o dashboard
function initDashboard() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetSection = this.querySelector('a').getAttribute('href');
            if (targetSection.startsWith('#')) {
                const section = document.querySelector(targetSection);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Função para inicializar a seção de progresso
function initProgresso() {
    // Simular dados de progresso
    const progressoData = {
        pesoAtual: 75,
        pesoInicial: 80,
        meta: 65,
        diasNoPrograma: 21,
        diasRestantes: 9
    };
    
    // Atualizar valores na tela
    updateProgressoValues(progressoData);
    
    // Adicionar animações aos cards
    const progressoCards = document.querySelectorAll('.progresso-card');
    progressoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Função para atualizar valores de progresso
function updateProgressoValues(data) {
    const pesoAtualEl = document.querySelector('.progresso-card:nth-child(1) .progresso-value');
    const metaEl = document.querySelector('.progresso-card:nth-child(2) .progresso-value');
    const diasEl = document.querySelector('.progresso-card:nth-child(3) .progresso-value');
    
    if (pesoAtualEl) pesoAtualEl.textContent = `${data.pesoAtual} kg`;
    if (metaEl) metaEl.textContent = `${data.meta} kg`;
    if (diasEl) diasEl.textContent = data.diasNoPrograma;
    
    // Calcular mudanças
    const pesoChange = data.pesoInicial - data.pesoAtual;
    const pesoChangeEl = document.querySelector('.progresso-card:nth-child(1) .progresso-change');
    if (pesoChangeEl) {
        pesoChangeEl.textContent = pesoChange > 0 ? `-${pesoChange} kg esta semana` : `+${Math.abs(pesoChange)} kg esta semana`;
        pesoChangeEl.style.color = pesoChange > 0 ? '#51cf66' : '#ff6b6b';
    }
    
    const metaFaltam = data.pesoAtual - data.meta;
    const metaChangeEl = document.querySelector('.progresso-card:nth-child(2) .progresso-change');
    if (metaChangeEl) {
        metaChangeEl.textContent = `Faltam ${metaFaltam} kg`;
    }
    
    const diasChangeEl = document.querySelector('.progresso-card:nth-child(3) .progresso-change');
    if (diasChangeEl) {
        diasChangeEl.textContent = `+${data.diasRestantes} dias restantes`;
    }
}

// Função para inicializar a comunidade
function initComunidade() {
    // Simular posts dinâmicos
    const posts = [
        {
            avatar: 'MS',
            author: 'Maria Silva',
            text: 'Perdi mais 2kg esta semana! O método está funcionando perfeitamente!',
            time: 'há 2 horas'
        },
        {
            avatar: 'JS',
            author: 'João Santos',
            text: 'Finalmente consegui ver resultados! 5kg em 3 semanas!',
            time: 'há 5 horas'
        },
        {
            avatar: 'AC',
            author: 'Ana Costa',
            text: 'Me sinto muito mais energética! Obrigada pela comunidade!',
            time: 'há 1 dia'
        }
    ];
    
    // Adicionar interatividade aos posts
    const postItems = document.querySelectorAll('.post-item');
    postItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            console.log(`Post clicado: ${posts[index].author}`);
            // Aqui você pode adicionar funcionalidade para expandir o post
        });
    });
    
    // Atualizar estatísticas da comunidade
    updateComunidadeStats();
}

// Função para atualizar estatísticas da comunidade
function updateComunidadeStats() {
    const stats = {
        membrosAtivos: 1247,
        taxaSucesso: 89,
        mediaPerda: 15.2
    };
    
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((el, index) => {
        if (index === 0) el.textContent = stats.membrosAtivos.toLocaleString();
        if (index === 1) el.textContent = `${stats.taxaSucesso}%`;
        if (index === 2) el.textContent = `${stats.mediaPerda}kg`;
    });
}

// Função para inicializar o suporte
function initSuporte() {
    const suporteCards = document.querySelectorAll('.suporte-card');
    
    suporteCards.forEach(card => {
        card.addEventListener('click', function() {
            const button = this.querySelector('.suporte-button');
            const action = button.textContent.toLowerCase();
            
            switch(action) {
                case 'ver faq':
                    showFAQ();
                    break;
                case 'iniciar chat':
                    startChat();
                    break;
                case 'enviar e-mail':
                    // O link mailto já está configurado no HTML
                    break;
            }
        });
    });
}

// Função para mostrar FAQ
function showFAQ() {
    const faqData = [
        {
            question: 'Como funciona o método?',
            answer: 'Nosso método é baseado em uma combinação de alimentação inteligente e hábitos saudáveis que aceleram o metabolismo.'
        },
        {
            question: 'Quanto tempo leva para ver resultados?',
            answer: 'A maioria dos membros vê os primeiros resultados em 7-10 dias, com transformação completa em 30 dias.'
        },
        {
            question: 'Preciso fazer exercícios?',
            answer: 'Não é obrigatório, mas recomendamos atividades leves para potencializar os resultados.'
        }
    ];
    
    // Criar modal de FAQ
    const modal = document.createElement('div');
    modal.className = 'faq-modal';
    modal.innerHTML = `
        <div class="faq-content">
            <span class="close">&times;</span>
            <h3>Perguntas Frequentes</h3>
            <div class="faq-list">
                ${faqData.map(item => `
                    <div class="faq-item">
                        <h4>${item.question}</h4>
                        <p>${item.answer}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Função para iniciar chat
function startChat() {
    alert('Chat ao vivo será implementado em breve! Por enquanto, entre em contato via e-mail.');
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Adicionar efeito de scroll no header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(139, 92, 246, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Funções para gerenciar aulas
function initAulas() {
    console.log('Inicializando seção de aulas');
    
    // Carregar progresso das aulas do localStorage
    const aulasCompletadas = JSON.parse(localStorage.getItem('aulasCompletadas') || '[]');
    
    // Atualizar interface das aulas
    atualizarInterfaceAulas(aulasCompletadas);
    
    // Atualizar barra de progresso
    atualizarProgressoAulas(aulasCompletadas.length);
    
    // Adicionar interatividade aos cards de aula
    const aulaCards = document.querySelectorAll('.aula-card');
    aulaCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Não executar se clicou no botão
            if (e.target.closest('.aula-btn')) return;
            
            // Expandir/colapsar o card
            this.classList.toggle('expanded');
        });
    });
}

// Função para marcar aula como concluída
function marcarComoConcluida(aulaId) {
    const aulasCompletadas = JSON.parse(localStorage.getItem('aulasCompletadas') || '[]');
    
    if (!aulasCompletadas.includes(aulaId)) {
        aulasCompletadas.push(aulaId);
        localStorage.setItem('aulasCompletadas', JSON.stringify(aulasCompletadas));
        
        // Atualizar interface
        atualizarInterfaceAulas(aulasCompletadas);
        atualizarProgressoAulas(aulasCompletadas.length);
        
        // Mostrar feedback
        mostrarFeedbackConclusao(aulaId);
    } else {
        // Desmarcar como concluída
        const index = aulasCompletadas.indexOf(aulaId);
        aulasCompletadas.splice(index, 1);
        localStorage.setItem('aulasCompletadas', JSON.stringify(aulasCompletadas));
        
        // Atualizar interface
        atualizarInterfaceAulas(aulasCompletadas);
        atualizarProgressoAulas(aulasCompletadas.length);
    }
}

// Função para atualizar interface das aulas
function atualizarInterfaceAulas(aulasCompletadas) {
    const aulaCards = document.querySelectorAll('.aula-card');
    
    aulaCards.forEach(card => {
        const aulaId = parseInt(card.getAttribute('data-aula'));
        const btn = card.querySelector('.aula-btn');
        const status = card.querySelector('.aula-status i');
        
        if (aulasCompletadas.includes(aulaId)) {
            // Marcar como concluída
            btn.classList.add('completed');
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Concluída';
            status.className = 'fas fa-check-circle';
            status.style.color = '#51cf66';
        } else {
            // Marcar como não concluída
            btn.classList.remove('completed');
            btn.innerHTML = '<i class="fas fa-check"></i> Marcar como Concluída';
            status.className = 'fas fa-play-circle';
            status.style.color = '';
        }
    });
}

// Função para atualizar barra de progresso
function atualizarProgressoAulas(completadas) {
    const total = 10;
    const porcentagem = (completadas / total) * 100;
    
    const progressFill = document.getElementById('aulasProgress');
    const aulasCompletadasEl = document.getElementById('aulasCompletadas');
    
    if (progressFill) {
        progressFill.style.width = `${porcentagem}%`;
    }
    
    if (aulasCompletadasEl) {
        aulasCompletadasEl.textContent = completadas;
    }
}

// Função para mostrar feedback de conclusão
function mostrarFeedbackConclusao(aulaId) {
    const aulaCard = document.querySelector(`[data-aula="${aulaId}"]`);
    const aulaTitulo = aulaCard.querySelector('.aula-info h3').textContent;
    
    // Criar notificação
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notificacao.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Aula "${aulaTitulo}" concluída com sucesso!
    `;
    
    document.body.appendChild(notificacao);
    
    // Animar entrada
    setTimeout(() => {
        notificacao.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notificacao)) {
                document.body.removeChild(notificacao);
            }
        }, 300);
    }, 3000);
}

// Exportar funções para uso global
window.membros = {
    updateProgresso: updateProgressoValues,
    showFAQ: showFAQ,
    startChat: startChat,
    marcarComoConcluida: marcarComoConcluida
}; 