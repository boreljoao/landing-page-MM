 // Header scroll effect
 
 window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Accordion functionality
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const wasActive = item.classList.contains('active');
        
        // Close all items first
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle the clicked item
        if (!wasActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') { // Allow simple # links (e.g. for dummy buttons)
            e.preventDefault(); 
            return;
        }

        const targetId = href.substring(1); // Get id without #
        if (!targetId) return; // If only #, do nothing special or handle as top page scroll

        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjusted for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll (IntersectionObserver)
const animateElements = document.querySelectorAll('.animate-fade');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Optional: stop observing after animation
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the element is visible
});

animateElements.forEach(element => {
    // Set initial state for animation via JS
    element.style.opacity = 0;
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // Apply animation delays from CSS classes if present
    const delayClass = Array.from(element.classList).find(cls => cls.startsWith('delay-'));
    if (delayClass) {
        const delayValue = parseFloat(delayClass.replace('delay-', '')) * 0.2; // e.g. delay-1 -> 0.2s
        element.style.transitionDelay = `${delayValue}s`;
    }
    observer.observe(element);
});

// Counter animation
function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16); // 16ms for ~60fps
    let current = start;
    const counterEl = element;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counterEl.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counterEl.textContent = target;
        }
    };
    updateCounter();
}

// Start counter when visible
const counterSection = document.querySelector('.counter-container');
if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = document.querySelectorAll('.counter-item');
                counters.forEach((counter, index) => {
                    const target = parseInt(counter.textContent, 10); // Store original target
                    if (isNaN(target)) return; // Skip if not a number
                    counter.textContent = '0'; // Reset for animation
                    setTimeout(() => {
                        animateCounter(counter, target, 1000 + (index * 200)); // Stagger animation
                    }, index * 100); // Stagger start
                });
                counterObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the counter section is visible
    });
    counterObserver.observe(counterSection);
}

// Floating elements animation (already handled by CSS)
// const floatingElements = document.querySelectorAll('.floating');
// floatingElements.forEach(el => {
//     const delay = parseFloat(el.style.animationDelay) || 0;
//     el.style.animationDelay = delay + 's'; // CSS handles this now
// });

// Checkout Modal Logic
const checkoutModal = document.getElementById('checkout-modal');
const openCheckoutButtons = [
    document.getElementById('header-button'),
    document.getElementById('hero-button'),
    document.getElementById('cta-button'),
    document.getElementById('guarantee-button'),
    document.getElementById('final-button')
];
const closeCheckoutButton = document.getElementById('close-checkout');
const confirmPurchaseButton = document.getElementById('confirm-purchase');
const checkoutForm = document.getElementById('checkout-form-details');

const successModal = document.getElementById('success-modal');
const successButtonAction = document.getElementById('success-button-action');


openCheckoutButtons.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            // If the button is an anchor to #final-cta, let smooth scroll happen first
            // Otherwise, or if it's a direct checkout trigger, open modal.
            // For simplicity, all these buttons will now just open the modal.
            // If specific buttons should scroll *then* open, that's more complex.
            // The current hrefs point to #final-cta, so default behavior will scroll.
            // To make them open modal directly:
            e.preventDefault(); 
            checkoutModal.classList.add('active');
        });
    }
});

if (closeCheckoutButton) {
    closeCheckoutButton.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });
}

// Payment method selection
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentForms = {
    credit: document.getElementById('credit-card-form'),
    pix: document.getElementById('pix-form'),
    boleto: document.getElementById('boleto-form')
};

paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const selectedMethod = option.dataset.method;
        Object.values(paymentForms).forEach(form => {
            if (form) form.style.display = 'none';
        });
        if (paymentForms[selectedMethod]) {
            paymentForms[selectedMethod].style.display = 'block';
        }
    });
});

if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add actual form submission logic here (e.g., validation, AJAX request)
        console.log("Form submitted. Implement payment processing.");
        
        // Simulate success
        checkoutModal.classList.remove('active');
        successModal.classList.add('active');
    });
}

if (successButtonAction) {
     successButtonAction.addEventListener('click', (e) => {
        e.preventDefault();
        successModal.classList.remove('active');
        // Redirect to a members area or close modal
        console.log("Access community button clicked.");
    });
}

// Close modals on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (checkoutModal && checkoutModal.classList.contains('active')) {
            checkoutModal.classList.remove('active');
        }
        if (successModal && successModal.classList.contains('active')) {
            successModal.classList.remove('active');
        }
    }
});

// Close modals when clicking outside
[checkoutModal, successModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Clicked on the backdrop itself
                modal.classList.remove('active');
            }
        });
    }
});
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50; // Número de partículas
    
    // Cores disponíveis
    const colors = ['blue', 'cyan', 'purple', 'pink'];
    // Tamanhos disponíveis
    const sizes = ['small', 'medium', 'large'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Adicionar classe de tamanho aleatório
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        particle.classList.add(randomSize);
        
        // Adicionar classe de cor aleatória
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.classList.add(randomColor);
        
        // Posição aleatória
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Delay aleatório para animação
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        // Duração aleatória da animação
        const duration = 3 + Math.random() * 4;
        particle.style.animationDuration = duration + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Função para recriar partículas no redimensionamento
function recreateParticles() {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    createParticles();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
});

// Recriar partículas quando redimensionar a janela
window.addEventListener('resize', recreateParticles);

