// JavaScript para analytics e tracking
document.addEventListener('DOMContentLoaded', function() {
    console.log('Analytics carregado');
    
    // Inicializar analytics
    initAnalytics();
    trackPageView();
    setupEventTracking();
});

// Função para inicializar analytics
function initAnalytics() {
    // Configurar dados básicos
    window.analyticsData = {
        sessionId: generateSessionId(),
        startTime: new Date().toISOString(),
        pageViews: [],
        events: [],
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language
    };
    
    // Salvar dados iniciais
    saveAnalyticsData();
}

// Função para gerar ID de sessão
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Função para rastrear visualização de página
function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    };
    
    window.analyticsData.pageViews.push(pageData);
    saveAnalyticsData();
    
    // Enviar para servidor
    sendAnalyticsToServer('pageview', pageData);
}

// Função para configurar rastreamento de eventos
function setupEventTracking() {
    // Rastrear cliques em CTAs
    const ctaButtons = document.querySelectorAll('.cta-button, .submit-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                button_location: getElementLocation(this)
            });
        });
    });
    
    // Rastrear cliques em links de navegação
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('nav_click', {
                link_text: this.textContent.trim(),
                link_href: this.href
            });
        });
    });
    
    // Rastrear tempo na página
    trackTimeOnPage();
    
    // Rastrear scroll
    trackScroll();
    
    // Rastrear interações com carrossel
    trackCarouselInteractions();
}

// Função para rastrear eventos
function trackEvent(eventName, eventData) {
    const event = {
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
    };
    
    window.analyticsData.events.push(event);
    saveAnalyticsData();
    
    // Enviar para servidor
    sendAnalyticsToServer('event', event);
    
    console.log('Evento rastreado:', event);
}

// Função para rastrear tempo na página
function trackTimeOnPage() {
    let startTime = Date.now();
    
    // Enviar dados quando a página for fechada
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('page_exit', {
            time_on_page: timeOnPage,
            url: window.location.href
        });
    });
    
    // Enviar dados a cada 30 segundos
    setInterval(() => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (timeOnPage % 30 === 0) {
            trackEvent('page_time', {
                time_on_page: timeOnPage,
                url: window.location.href
            });
        }
    }, 1000);
}

// Função para rastrear scroll
function trackScroll() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Rastrear marcos de scroll (25%, 50%, 75%, 100%)
            if (maxScroll >= 25 && maxScroll < 50) {
                trackEvent('scroll_25', { scroll_percent: maxScroll });
            } else if (maxScroll >= 50 && maxScroll < 75) {
                trackEvent('scroll_50', { scroll_percent: maxScroll });
            } else if (maxScroll >= 75 && maxScroll < 100) {
                trackEvent('scroll_75', { scroll_percent: maxScroll });
            } else if (maxScroll >= 100) {
                trackEvent('scroll_100', { scroll_percent: maxScroll });
            }
        }
    });
}

// Função para rastrear interações com carrossel
function trackCarouselInteractions() {
    const carousel = document.querySelector('.results-swiper');
    if (carousel) {
        // Rastrear cliques nas setas
        const prevButton = carousel.querySelector('.swiper-button-prev');
        const nextButton = carousel.querySelector('.swiper-button-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                trackEvent('carousel_prev', { carousel_type: 'results' });
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                trackEvent('carousel_next', { carousel_type: 'results' });
            });
        }
        
        // Rastrear cliques na paginação
        const pagination = carousel.querySelector('.swiper-pagination');
        if (pagination) {
            pagination.addEventListener('click', function(e) {
                if (e.target.classList.contains('swiper-pagination-bullet')) {
                    trackEvent('carousel_pagination', { 
                        carousel_type: 'results',
                        bullet_index: Array.from(pagination.children).indexOf(e.target)
                    });
                }
            });
        }
    }
}

// Função para rastrear captura de leads
function trackLeadCapture(name, email) {
    trackEvent('lead_capture', {
        name: name,
        email: email,
        source: 'modal',
        page: window.location.href
    });
}

// Função para rastrear conversões
function trackConversion(conversionType, value) {
    trackEvent('conversion', {
        type: conversionType,
        value: value,
        page: window.location.href
    });
}

// Função para obter localização de elemento
function getElementLocation(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
    };
}

// Função para salvar dados de analytics
function saveAnalyticsData() {
    localStorage.setItem('analyticsData', JSON.stringify(window.analyticsData));
}

// Função para enviar analytics para servidor
function sendAnalyticsToServer(type, data) {
    const payload = {
        type: type,
        data: data,
        sessionId: window.analyticsData.sessionId,
        timestamp: new Date().toISOString()
    };
    
    fetch('database/analytics_manager.php?action=track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Analytics enviado com sucesso');
        } else {
            console.error('Erro ao enviar analytics:', result.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição de analytics:', error);
        // Salvar no localStorage como fallback
        saveAnalyticsData();
    });
}

// Função para obter relatórios de analytics
function getAnalyticsReport() {
    const data = JSON.parse(localStorage.getItem('analyticsData') || '{}');
    
    const report = {
        sessionId: data.sessionId,
        startTime: data.startTime,
        totalPageViews: data.pageViews.length,
        totalEvents: data.events.length,
        eventsByType: {},
        timeOnPage: calculateTimeOnPage(data),
        userAgent: data.userAgent,
        screenResolution: data.screenResolution,
        language: data.language
    };
    
    // Contar eventos por tipo
    data.events.forEach(event => {
        if (!report.eventsByType[event.name]) {
            report.eventsByType[event.name] = 0;
        }
        report.eventsByType[event.name]++;
    });
    
    return report;
}

// Função para calcular tempo na página
function calculateTimeOnPage(data) {
    if (data.pageViews.length === 0) return 0;
    
    const firstView = new Date(data.pageViews[0].timestamp);
    const lastView = new Date(data.pageViews[data.pageViews.length - 1].timestamp);
    
    return Math.round((lastView - firstView) / 1000);
}

// Função para exportar dados de analytics
function exportAnalyticsData() {
    const data = JSON.parse(localStorage.getItem('analyticsData') || '{}');
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'analytics-dietatransform.json';
    link.click();
}

// Função para limpar dados de analytics
function clearAnalyticsData() {
    localStorage.removeItem('analyticsData');
    console.log('Dados de analytics limpos');
}

// Função para obter métricas de performance
function getPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
        pageLoadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
    };
}

// Exportar funções para uso global
window.analytics = {
    trackEvent: trackEvent,
    trackLeadCapture: trackLeadCapture,
    trackConversion: trackConversion,
    getReport: getAnalyticsReport,
    exportData: exportAnalyticsData,
    clearData: clearAnalyticsData,
    getPerformanceMetrics: getPerformanceMetrics
}; 