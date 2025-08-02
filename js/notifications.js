// JavaScript para sistema de notificações
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de notificações carregado');
    
    // Inicializar notificações
    initNotifications();
    setupNotificationTriggers();
});

// Função para inicializar notificações
function initNotifications() {
    // Verificar se o navegador suporta notificações
    if (!('Notification' in window)) {
        console.log('Este navegador não suporta notificações');
        return;
    }
    
    // Solicitar permissão para notificações
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Permissão para notificações concedida');
            }
        });
    }
    
    // Configurar notificações push
    setupPushNotifications();
}

// Função para configurar notificações push
function setupPushNotifications() {
    // Verificar se o service worker está registrado
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registrado:', registration);
            })
            .catch(function(error) {
                console.log('Erro ao registrar Service Worker:', error);
            });
    }
}

// Função para configurar triggers de notificação
function setupNotificationTriggers() {
    // Notificação de boas-vindas após 5 segundos
    setTimeout(() => {
        showWelcomeNotification();
    }, 5000);
    
    // Notificação de promoção após 30 segundos
    setTimeout(() => {
        showPromotionNotification();
    }, 30000);
    
    // Notificação de lembrete após 2 minutos
    setTimeout(() => {
        showReminderNotification();
    }, 120000);
}

// Função para mostrar notificação de boas-vindas
function showWelcomeNotification() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('Bem-vindo ao DietaTransform!', {
            body: 'Descubra o método que transformou a vida de milhares de pessoas.',
            icon: '/images/logo.png',
            badge: '/images/badge.png',
            tag: 'welcome',
            requireInteraction: false,
            actions: [
                {
                    action: 'explore',
                    title: 'Explorar'
                },
                {
                    action: 'dismiss',
                    title: 'Fechar'
                }
            ]
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        notification.onaction = function(event) {
            if (event.action === 'explore') {
                window.focus();
                // Scroll para seção de resultados
                const resultadosSection = document.getElementById('resultados');
                if (resultadosSection) {
                    resultadosSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            notification.close();
        };
    }
}

// Função para mostrar notificação de promoção
function showPromotionNotification() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('Oferta Especial! 🎉', {
            body: 'Aproveite 50% de desconto no método completo por tempo limitado!',
            icon: '/images/promo.png',
            badge: '/images/badge.png',
            tag: 'promotion',
            requireInteraction: true,
            actions: [
                {
                    action: 'claim',
                    title: 'Aproveitar'
                },
                {
                    action: 'dismiss',
                    title: 'Fechar'
                }
            ]
        });
        
        notification.onclick = function() {
            window.focus();
            // Abrir página de cadastro
            window.location.href = 'cadastro.html';
            notification.close();
        };
        
        notification.onaction = function(event) {
            if (event.action === 'claim') {
                window.focus();
                window.location.href = 'cadastro.html';
            }
            notification.close();
        };
    }
}

// Função para mostrar notificação de lembrete
function showReminderNotification() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('Não perca esta oportunidade! ⏰', {
            body: 'Milhares de pessoas já transformaram suas vidas. Que tal você também?',
            icon: '/images/reminder.png',
            badge: '/images/badge.png',
            tag: 'reminder',
            requireInteraction: false,
            actions: [
                {
                    action: 'start',
                    title: 'Começar Agora'
                },
                {
                    action: 'dismiss',
                    title: 'Fechar'
                }
            ]
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        notification.onaction = function(event) {
            if (event.action === 'start') {
                window.focus();
                // Scroll para CTA principal
                const ctaButton = document.querySelector('.cta-button');
                if (ctaButton) {
                    ctaButton.scrollIntoView({ behavior: 'smooth' });
                }
            }
            notification.close();
        };
    }
}

// Função para mostrar notificação de captura de lead
function showLeadCaptureNotification(name, email) {
    if (Notification.permission === 'granted') {
        const notification = new Notification('Lead Capturado! 🎯', {
            body: `${name} acabou de se cadastrar com ${email}`,
            icon: '/images/lead.png',
            badge: '/images/badge.png',
            tag: 'lead_capture',
            requireInteraction: false
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        // Auto-close após 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
    }
}

// Função para mostrar notificação de sucesso
function showSuccessNotification(message, title = 'Sucesso! ✅') {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon: '/images/success.png',
            badge: '/images/badge.png',
            tag: 'success',
            requireInteraction: false
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        // Auto-close após 3 segundos
        setTimeout(() => {
            notification.close();
        }, 3000);
    }
}

// Função para mostrar notificação de erro
function showErrorNotification(message, title = 'Erro! ❌') {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon: '/images/error.png',
            badge: '/images/badge.png',
            tag: 'error',
            requireInteraction: true
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    }
}

// Função para mostrar notificação de progresso
function showProgressNotification(currentWeight, targetWeight) {
    if (Notification.permission === 'granted') {
        const lost = currentWeight - targetWeight;
        const notification = new Notification('Progresso Atualizado! 📊', {
            body: `Você perdeu ${lost}kg! Continue assim!`,
            icon: '/images/progress.png',
            badge: '/images/badge.png',
            tag: 'progress',
            requireInteraction: false
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        // Auto-close após 4 segundos
        setTimeout(() => {
            notification.close();
        }, 4000);
    }
}

// Função para mostrar notificação de meta atingida
function showGoalAchievedNotification(goalTitle) {
    if (Notification.permission === 'granted') {
        const notification = new Notification('Meta Atingida! 🎉', {
            body: `Parabéns! Você atingiu a meta: ${goalTitle}`,
            icon: '/images/goal.png',
            badge: '/images/badge.png',
            tag: 'goal_achieved',
            requireInteraction: true,
            actions: [
                {
                    action: 'celebrate',
                    title: 'Celebrar'
                },
                {
                    action: 'dismiss',
                    title: 'Fechar'
                }
            ]
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        notification.onaction = function(event) {
            if (event.action === 'celebrate') {
                window.focus();
                // Mostrar animação de celebração
                showCelebrationAnimation();
            }
            notification.close();
        };
    }
}

// Função para mostrar animação de celebração
function showCelebrationAnimation() {
    // Criar elementos de confete
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
}

// Função para criar confete
function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.backgroundColor = ['#ff6b6b', '#51cf66', '#8b5cf6', '#fbbf24', '#ec4899'][Math.floor(Math.random() * 5)];
    
    document.body.appendChild(confetti);
    
    // Remover após animação
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 4000);
}

// Função para solicitar permissão de notificação
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('Este navegador não suporta notificações');
        return;
    }
    
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
            showSuccessNotification('Notificações ativadas com sucesso!');
        } else {
            showErrorNotification('Permissão de notificações negada');
        }
    });
}

// Função para verificar status das notificações
function checkNotificationStatus() {
    if (!('Notification' in window)) {
        return 'not_supported';
    }
    
    return Notification.permission;
}

// Função para configurar notificações personalizadas
function setupCustomNotification(type, options) {
    const defaultOptions = {
        icon: '/images/default.png',
        badge: '/images/badge.png',
        requireInteraction: false
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    if (Notification.permission === 'granted') {
        const notification = new Notification(options.title, finalOptions);
        
        notification.onclick = function() {
            window.focus();
            if (options.onClick) {
                options.onClick();
            }
            notification.close();
        };
        
        if (options.actions) {
            notification.onaction = function(event) {
                const action = options.actions.find(a => a.action === event.action);
                if (action && action.handler) {
                    action.handler();
                }
                notification.close();
            };
        }
        
        if (!finalOptions.requireInteraction) {
            setTimeout(() => {
                notification.close();
            }, options.duration || 5000);
        }
        
        return notification;
    }
}

// Função para cancelar todas as notificações
function cancelAllNotifications() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.getNotifications().then(function(notifications) {
                notifications.forEach(function(notification) {
                    notification.close();
                });
            });
        });
    }
}

// Exportar funções para uso global
window.notifications = {
    showWelcome: showWelcomeNotification,
    showPromotion: showPromotionNotification,
    showReminder: showReminderNotification,
    showLeadCapture: showLeadCaptureNotification,
    showSuccess: showSuccessNotification,
    showError: showErrorNotification,
    showProgress: showProgressNotification,
    showGoalAchieved: showGoalAchievedNotification,
    requestPermission: requestNotificationPermission,
    checkStatus: checkNotificationStatus,
    setupCustom: setupCustomNotification,
    cancelAll: cancelAllNotifications,
    onLeadCapture: showLeadCaptureNotification
}; 