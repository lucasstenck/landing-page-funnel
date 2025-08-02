// Variáveis globais
let timeOnPage = 0;
let captureModalShown = false;
let captureTimer;

// Função para iniciar o timer de captura
function startCaptureTimer() {
    captureTimer = setInterval(() => {
        timeOnPage += 1;
        
        // Mostrar modal após 1 minuto (60 segundos)
        if (timeOnPage >= 60 && !captureModalShown) {
            showCaptureModal();
        }
    }, 1000);
}

// Função para mostrar o modal de captura
function showCaptureModal() {
    captureModalShown = true;
    const modal = document.getElementById('captureModal');
    modal.style.display = 'block';
    
    // Parar o timer após mostrar o modal
    clearInterval(captureTimer);
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('captureModal');
    modal.style.display = 'none';
}

// Função para salvar os dados capturados
function saveCaptureData(name, email) {
    // Salvar no banco de dados MySQL via PHP
    fetch('database/leads_manager.php?action=capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            timeOnPage: timeOnPage,
            pageUrl: window.location.pathname
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Lead capturado com sucesso:', data.message);
            
            // Também salvar no localStorage como backup
            const captureData = {
                name: name,
                email: email,
                timestamp: new Date().toISOString(),
                timeOnPage: timeOnPage
            };
            
            let captures = JSON.parse(localStorage.getItem('captures') || '[]');
            captures.push(captureData);
            localStorage.setItem('captures', JSON.stringify(captures));
            
        } else {
            console.error('Erro ao capturar lead:', data.message);
            
            // Fallback para localStorage se o banco falhar
            const captureData = {
                name: name,
                email: email,
                timestamp: new Date().toISOString(),
                timeOnPage: timeOnPage
            };
            
            let captures = JSON.parse(localStorage.getItem('captures') || '[]');
            captures.push(captureData);
            localStorage.setItem('captures', JSON.stringify(captures));
            
            console.log('Dados salvos no localStorage como fallback');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        
        // Fallback para localStorage em caso de erro de rede
        const captureData = {
            name: name,
            email: email,
            timestamp: new Date().toISOString(),
            timeOnPage: timeOnPage
        };
        
        let captures = JSON.parse(localStorage.getItem('captures') || '[]');
        captures.push(captureData);
        localStorage.setItem('captures', JSON.stringify(captures));
        
        console.log('Dados salvos no localStorage como fallback');
    });
}

// Função para melhorar o carregamento das imagens
function preloadImages() {
    const images = document.querySelectorAll('.result-card img');
    
    images.forEach(img => {
        // Adicionar loading state
        img.style.opacity = '0';
        
        // Quando a imagem carregar
        img.onload = function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.5s ease';
        };
        
        // Se a imagem falhar
        img.onerror = function() {
            console.log('Imagem falhou ao carregar:', this.src);
            // O fallback já está definido no HTML com onerror
        };
    });
}

// Inicializar Swiper Carrossel de Resultados
document.addEventListener('DOMContentLoaded', function() {
    // Pré-carregar imagens
    preloadImages();
    
    // Verificar se o Swiper está disponível
    if (typeof Swiper !== 'undefined') {
        const resultsSwiper = new Swiper('.results-swiper', {
            // Configurações básicas
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            
            // Navegação
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Paginação
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Efeitos
            effect: 'slide',
            speed: 600,
            
            // Responsividade
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 40,
                },
            },
            
            // Callbacks
            on: {
                init: function() {
                    console.log('Swiper inicializado com sucesso');
                    // Garantir que as imagens sejam carregadas após inicialização
                    setTimeout(preloadImages, 100);
                },
                slideChange: function() {
                    console.log('Slide alterado para:', this.activeIndex);
                    // Pré-carregar imagens do slide atual
                    setTimeout(preloadImages, 100);
                }
            }
        });
        
        // Adicionar efeitos de hover nos slides
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
            slide.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            slide.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
    } else {
        console.warn('Swiper não está carregado. Verifique se o CDN está funcionando.');
    }
    
    // Inicializar timer de captura
    startCaptureTimer();
    
    // Event listeners para o modal
    const modal = document.getElementById('captureModal');
    const closeBtn = document.querySelector('.close');
    const captureForm = document.getElementById('captureForm');
    
    // Fechar modal ao clicar no X
    closeBtn.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Processar formulário de captura
    captureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        if (name && email) {
            saveCaptureData(name, email);
            
            // Mostrar mensagem de sucesso
            alert('Obrigado! Seu ebook será enviado para seu e-mail em breve.');
            
            // Fechar modal
            closeModal();
            
            // Limpar formulário
            captureForm.reset();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
});

// Função para reiniciar o carrossel (exportada globalmente)
function restartResultsSwiper() {
    if (window.resultsSwiper) {
        window.resultsSwiper.update();
        console.log('Carrossel reiniciado');
    }
}

// Exportar função para uso global
window.restartResultsSwiper = restartResultsSwiper; 