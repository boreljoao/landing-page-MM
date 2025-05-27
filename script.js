// Integração com Mercado Pago
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/landing

// Configuração do Mercado Pago
const mercadoPagoConfig = {
  publicKey: 'TEST-12345678-9abc-def0-1234-56789abcdef0', // Chave pública de teste
  preferenceId: null,
  // Em produção, estas informações viriam do backend por segurança
};

// Esperar que o DOM esteja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initParticles();
    initCountdown();
    initScrollEffects();
    initActivityNotifications();
    initStatsCounter();
    initPaymentMethods();
    initFormValidation();
    initMercadoPago();
    
    // Definir o ano atual no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Inicializar Mercado Pago
function initMercadoPago() {
    // Em um ambiente real, carregaríamos o SDK do Mercado Pago
    // const script = document.createElement('script');
    // script.src = 'https://sdk.mercadopago.com/js/v2';
    // script.onload = setupMercadoPago;
    // document.body.appendChild(script);
    
    // Simulação para ambiente de demonstração
    console.log('Mercado Pago SDK carregado');
    setupMercadoPago();
}

// Configurar Mercado Pago após carregamento do SDK
function setupMercadoPago() {
    // Em um ambiente real, inicializaríamos o SDK
    // const mp = new MercadoPago(mercadoPagoConfig.publicKey);
    
    // Simular criação de preferência (normalmente feita no backend)
    simulateCreatePreference();
}

// Simular criação de preferência de pagamento
function simulateCreatePreference() {
    // Em um ambiente real, faríamos uma chamada ao backend
    // que por sua vez chamaria a API do Mercado Pago
    
    // Simular resposta com ID de preferência
    setTimeout(() => {
        mercadoPagoConfig.preferenceId = 'TEST-' + Math.random().toString(36).substring(2, 15);
        console.log('Preferência criada:', mercadoPagoConfig.preferenceId);
        
        // Configurar botão de checkout
        setupCheckoutButton();
    }, 500);
}

// Configurar botão de checkout
function setupCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function(e) {
            // Prevenir comportamento padrão apenas se o formulário for válido
            if (validateCheckoutForm()) {
                e.preventDefault();
                
                // Em um ambiente real, redirecionaríamos para o checkout do Mercado Pago
                // window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=${mercadoPagoConfig.preferenceId}`;
                
                // Para demonstração, mostrar modal de processamento
                showProcessingModal();
                
                // Simular processamento e mostrar sucesso
                setTimeout(() => {
                    hideProcessingModal();
                    showSuccessModal();
                }, 2000);
            }
        });
    }
}

// Validar formulário de checkout
function validateCheckoutForm() {
    const form = document.getElementById('payment-form');
    let isValid = true;
    
    // Validar campos obrigatórios
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Adicionar mensagem de erro se não existir
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Este campo é obrigatório';
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            
            // Remover mensagem de erro se existir
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.parentNode.removeChild(field.nextElementSibling);
            }
        }
    });
    
    // Validar método de pagamento ativo
    const activeMethod = document.querySelector('.payment-method.active');
    const methodType = activeMethod ? activeMethod.getAttribute('data-method') : null;
    
    if (methodType === 'credit') {
        // Validar campos de cartão
        const cardFields = ['card-number', 'card-expiry', 'card-cvc', 'card-name'];
        cardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Adicionar mensagem de erro se não existir
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Este campo é obrigatório';
                    field.parentNode.insertBefore(errorMessage, field.nextSibling);
                }
            } else if (field) {
                field.classList.remove('error');
                
                // Remover mensagem de erro se existir
                if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                    field.parentNode.removeChild(field.nextElementSibling);
                }
            }
        });
        
        // Validações específicas para cartão
        if (isValid) {
            // Validar número do cartão (simplificado)
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 16) {
                isValid = false;
                document.getElementById('card-number').classList.add('error');
                
                // Adicionar mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Número de cartão inválido';
                document.getElementById('card-number').parentNode.insertBefore(errorMessage, document.getElementById('card-number').nextSibling);
            }
            
            // Validar data de expiração
            const expiryValue = document.getElementById('card-expiry').value;
            const expiryParts = expiryValue.split('/');
            
            if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
                isValid = false;
                document.getElementById('card-expiry').classList.add('error');
                
                // Adicionar mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Data inválida (use MM/AA)';
                document.getElementById('card-expiry').parentNode.insertBefore(errorMessage, document.getElementById('card-expiry').nextSibling);
            } else {
                const month = parseInt(expiryParts[0]);
                const year = parseInt('20' + expiryParts[1]);
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;
                
                if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
                    isValid = false;
                    document.getElementById('card-expiry').classList.add('error');
                    
                    // Adicionar mensagem de erro
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Data de expiração inválida';
                    document.getElementById('card-expiry').parentNode.insertBefore(errorMessage, document.getElementById('card-expiry').nextSibling);
                }
            }
            
            // Validar CVV
            const cvv = document.getElementById('card-cvc').value;
            if (cvv.length < 3) {
                isValid = false;
                document.getElementById('card-cvc').classList.add('error');
                
                // Adicionar mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'CVV inválido';
                document.getElementById('card-cvc').parentNode.insertBefore(errorMessage, document.getElementById('card-cvc').nextSibling);
            }
        }
    }
    
    return isValid;
}

// Mostrar modal de processamento
function showProcessingModal() {
    // Verificar se já existe um modal de processamento
    let processingModal = document.getElementById('processing-modal');
    
    if (!processingModal) {
        // Criar modal de processamento
        processingModal = document.createElement('div');
        processingModal.id = 'processing-modal';
        processingModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content processing';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        const message = document.createElement('p');
        message.textContent = 'Processando pagamento...';
        
        modalContent.appendChild(spinner);
        modalContent.appendChild(message);
        processingModal.appendChild(modalContent);
        
        document.body.appendChild(processingModal);
    }
    
    // Mostrar modal
    processingModal.classList.add('show');
}

// Ocultar modal de processamento
function hideProcessingModal() {
    const processingModal = document.getElementById('processing-modal');
    if (processingModal) {
        processingModal.classList.remove('show');
    }
}

// Criar e animar partículas flutuantes
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamanho aleatório
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posição aleatória
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Opacidade aleatória
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Animação com duração e delay aleatórios
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Inicializar contadores regressivos
function initCountdown() {
    // Verificar se já existe um timestamp salvo no localStorage
    let endTime = new Date();
    const savedEndTime = localStorage.getItem('offerEndTime');
    
    if (savedEndTime) {
        // Recuperar timestamp salvo
        endTime = new Date(parseInt(savedEndTime));
        
        // Verificar se o tempo já expirou
        if (endTime <= new Date()) {
            // Se expirou, criar novo timestamp (30 minutos a partir de agora)
            endTime = new Date();
            endTime.setMinutes(endTime.getMinutes() + 30);
            // Salvar no localStorage
            localStorage.setItem('offerEndTime', endTime.getTime().toString());
        }
    } else {
        // Primeira visita, definir data final (30 minutos a partir de agora)
        endTime.setMinutes(endTime.getMinutes() + 30);
        // Salvar no localStorage
        localStorage.setItem('offerEndTime', endTime.getTime().toString());
    }
    
    // Atualizar todos os contadores a cada segundo
    function updateCountdown() {
        const now = new Date();
        const timeDiff = endTime - now;
        
        if (timeDiff <= 0) {
            // Tempo esgotado, reiniciar contador (30 minutos a partir de agora)
            endTime = new Date();
            endTime.setMinutes(endTime.getMinutes() + 30);
            // Atualizar localStorage
            localStorage.setItem('offerEndTime', endTime.getTime().toString());
            return;
        }
        
        // Calcular horas, minutos e segundos
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // Formatar com zeros à esquerda
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        // Atualizar todos os elementos de contagem regressiva
        if (document.getElementById('hours')) {
            document.getElementById('hours').textContent = formattedHours;
        }
        if (document.getElementById('minutes')) {
            document.getElementById('minutes').textContent = formattedMinutes;
        }
        if (document.getElementById('seconds')) {
            document.getElementById('seconds').textContent = formattedSeconds;
        }
        
        // Atualizar contadores menores
        const smallCounters = document.querySelectorAll('#countdown-small, #checkout-timer');
        smallCounters.forEach(counter => {
            counter.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        });
    }
    
    // Iniciar atualização e repetir a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Inicializar efeitos de rolagem
function initScrollEffects() {
    // Mostrar/ocultar botão flutuante de CTA
    const floatingCta = document.getElementById('floating-cta');
    
    window.addEventListener('scroll', function() {
        // Mostrar botão flutuante após rolar 500px
        if (window.scrollY > 500) {
            floatingCta.classList.add('show');
        } else {
            floatingCta.classList.remove('show');
        }
        
        // Animar elementos quando entrarem na viewport
        animateOnScroll();
    });
    
    // Configurar rolagem suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Configurar indicadores de rolagem
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const currentSection = this.closest('section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Função para animar elementos quando entrarem na viewport
    function animateOnScroll() {
        const elements = document.querySelectorAll('.benefit-card, .value-card, .feature-card, .testimonial-box, .stats-section');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = elementTop < window.innerHeight && elementBottom > 0;
            
            if (isVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Iniciar animações para elementos visíveis na carga inicial
    setTimeout(animateOnScroll, 100);
}

// Inicializar notificações de atividade
function initActivityNotifications() {
    const notifications = [
        "João acabou de entrar na comunidade",
        "Apenas 5 vagas restantes!",
        "Maria conseguiu R$1.200 em 3 dias",
        "Carlos está assistindo agora",
        "Ana acaba de fazer o pagamento",
        "Últimas 3 vagas disponíveis!",
        "Pedro obteve lucro de R$850 ontem",
        "Promoção encerra em breve!"
    ];
    
    const notificationsContainer = document.getElementById('activity-notifications');
    
    function showNotification() {
        // Não mostrar notificação se a página não estiver visível
        if (document.hidden) return;
        
        // Selecionar notificação aleatória
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        
        // Criar elemento de notificação
        const notificationElement = document.createElement('div');
        notificationElement.className = 'activity-notification';
        
        // Adicionar conteúdo
        const dot = document.createElement('div');
        dot.className = 'activity-dot';
        
        const text = document.createElement('p');
        text.textContent = notification;
        
        notificationElement.appendChild(dot);
        notificationElement.appendChild(text);
        
        // Adicionar ao container
        notificationsContainer.appendChild(notificationElement);
        
        // Remover após alguns segundos
        setTimeout(() => {
            notificationElement.classList.add('hide');
            setTimeout(() => {
                notificationsContainer.removeChild(notificationElement);
            }, 500);
        }, 4000);
    }
    
    // Mostrar primeira notificação após 5 segundos
    setTimeout(showNotification, 5000);
    
    // Mostrar notificações aleatórias a cada 10-20 segundos
    setInterval(() => {
        const randomDelay = Math.random() * 10000 + 10000; // 10-20 segundos
        setTimeout(showNotification, randomDelay);
    }, 20000);
}

// Inicializar contadores de estatísticas
function initStatsCounter() {
    const stats = [
        { id: 'stat-success', target: 97, suffix: '%', duration: 2000 },
        { id: 'stat-members', target: 5000, suffix: '+', duration: 2500 },
        { id: 'stat-profit', target: 200, prefix: 'R$ ', suffix: 'K+', duration: 3500, decimals: 0 }
    ];
    
    // Função para animar contador
    function animateCounter(element, start, end, duration, prefix = '', suffix = '', decimals = 0) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Usar easeOutExpo para efeito de desaceleração
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = start + (end - start) * easeProgress;
            
            // Formatar valor com decimais se necessário
            const formattedValue = decimals > 0 
                ? currentValue.toFixed(decimals) 
                : Math.floor(currentValue);
            
            element.textContent = `${prefix}${formattedValue}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Função para verificar se elemento está visível
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Iniciar animação quando os elementos entrarem na viewport
    function checkVisibility() {
        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (element && isElementInViewport(element) && !element.dataset.animated) {
                element.dataset.animated = true;
                animateCounter(
                    element, 
                    0, 
                    stat.target, 
                    stat.duration, 
                    stat.prefix || '', 
                    stat.suffix || '',
                    stat.decimals || 0
                );
            }
        });
    }
    
    // Verificar visibilidade na carga inicial e durante a rolagem
    window.addEventListener('scroll', checkVisibility);
    setTimeout(checkVisibility, 500);
}

// Inicializar métodos de pagamento
function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remover classe ativa de todos os métodos
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Adicionar classe ativa ao método clicado
            this.classList.add('active');
            
            // Mostrar formulário correspondente
            const methodType = this.getAttribute('data-method');
            paymentForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${methodType}-payment`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Formatar campos de cartão
    if (document.getElementById('card-number')) {
        document.getElementById('card-number').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            
            // Adicionar espaços a cada 4 dígitos
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }
    
    if (document.getElementById('card-expiry')) {
        document.getElementById('card-expiry').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            
            // Formatar como MM/AA
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            
            e.target.value = value;
        });
    }
    
    if (document.getElementById('card-cvc')) {
        document.getElementById('card-cvc').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3);
            e.target.value = value;
        });
    }
    
    if (document.getElementById('phone')) {
        document.getElementById('phone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            // Formatar como (XX) XXXXX-XXXX
            if (value.length > 2) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            }
            if (value.length > 10) {
                value = value.slice(0, 10) + '-' + value.slice(10);
            }
            
            e.target.value = value;
        });
    }
}

// Inicializar validação de formulário
function initFormValidation() {
    const form = document.getElementById('payment-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            // A validação e processamento são tratados pelo setupCheckoutButton
            // Não precisamos fazer nada aqui, pois o botão já tem seu próprio handler
        });
    }
}

// Função para mostrar modal de sucesso
function showSuccessModal() {
    const successModal = document.getElementById('success-modal');
    
    if (successModal) {
        successModal.classList.add('show');
        
        // Configurar fechamento do modal
        const closeButton = successModal.querySelector('.close-modal');
        const modalButton = successModal.querySelector('.modal-button');
        
        function closeModal() {
            successModal.classList.remove('show');
        }
        
        if (closeButton) closeButton.addEventListener('click', closeModal);
        if (modalButton) modalButton.addEventListener('click', closeModal);
        
        // Fechar modal ao clicar fora dele
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }
}

// Função para rolar até a seção de checkout
function scrollToCheckout() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
}
