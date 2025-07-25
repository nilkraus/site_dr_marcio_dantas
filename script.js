// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const loading = document.getElementById('loading');
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const whatsappFloat = document.getElementById('whatsapp-float');

    // ===== LOADING SCREEN =====
    window.addEventListener('load', function() {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 1000);
    });

    // ===== NAVEGAÇÃO MÓVEL =====
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== SCROLL EFFECTS =====
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        // Header com efeito de scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Botão "Voltar ao Topo"
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Atualizar link ativo na navegação
        updateActiveNavLink();
        
        // Animações de scroll (fade in elements)
        animateOnScroll();
        
        // WhatsApp visibility e link update
        toggleWhatsAppVisibility();
        updateWhatsAppLink();
    });

    // ===== NAVEGAÇÃO SUAVE =====
    function smoothScroll(target, duration = 1000) {
        const targetSection = document.querySelector(target);
        if (!targetSection) return;

        const targetPosition = targetSection.offsetTop - 80; // Compensar altura do header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Aplicar scroll suave a todos os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });

    // Scroll suave para o indicador de scroll
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            smoothScroll('#sobre');
        });
    }

    // Botão "Voltar ao Topo"
    backToTop.addEventListener('click', function() {
        smoothScroll('#home');
    });

    // ===== ATUALIZAR LINK ATIVO =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollTop = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    // ===== ANIMAÇÕES NO SCROLL =====
    function animateOnScroll() {
        const elements = document.querySelectorAll('[data-aos]');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('aos-animate');
            }
        });
    }

    // Inicializar animações AOS (Animate On Scroll)
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all 0.6s ease ${(element.dataset.aosDelay || 0)}ms`;
        });
    }

    // Aplicar estilos CSS para animações AOS
    const style = document.createElement('style');
    style.textContent = `
        .aos-animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    initAOS();

    // ===== CONTADOR ANIMADO =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Velocidade da animação

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Observer para iniciar contador quando visível
    const statsSection = document.querySelector('#sobre');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        statsObserver.observe(statsSection);
    }

    // ===== FORMULÁRIO DE CONTATO =====
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            if (!name || !email || !message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um email válido.', 'error');
                return;
            }

            // Simular envio do formulário
            showNotification('Enviando mensagem...', 'info');
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                contactForm.reset();
            }, 2000);
        });
    }

    // ===== VALIDAÇÃO DE EMAIL =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos da notificação
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background: #10b981;
                color: white;
            }
            .notification-error {
                background: #ef4444;
                color: white;
            }
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.8;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'notification-styles';
            styleElement.textContent = notificationStyles;
            document.head.appendChild(styleElement);
        }

        document.body.appendChild(notification);

        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Fechar notificação automaticamente
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);

        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // ===== EFEITOS ESPECIAIS =====
    
    // Parallax effect no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Efeito hover nos cards da equipe
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== LAZY LOADING DE IMAGENS =====
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===== PERFORMANCE OTIMIZATIONS =====
    
    // Debounce function para otimizar eventos de scroll
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Aplicar debounce aos eventos de scroll
    const debouncedScrollHandler = debounce(function() {
        updateActiveNavLink();
        animateOnScroll();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Fechar menu mobile
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Fechar notificações
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                hideNotification(notification);
            });
        }
    });

    // Focus trap no menu mobile
    navMenu.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusableElements = navMenu.querySelectorAll('a');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // ===== MAPA INTERATIVO =====
    
    // Lazy loading do mapa para melhor performance
    function initMapLazyLoading() {
        const mapContainer = document.querySelector('.map-container iframe');
        if (!mapContainer) return;

        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Mapa já está carregado via HTML, apenas adicionar interações
                    addMapInteractions();
                    mapObserver.unobserve(entry.target);
                }
            });
        });

        mapObserver.observe(mapContainer);
    }

    // Adicionar interações ao mapa
    function addMapInteractions() {
        const mapContainer = document.querySelector('.map-container');
        const mapIframe = mapContainer.querySelector('iframe');

        // Overlay para evitar scroll indesejado
        const mapOverlay = document.createElement('div');
        mapOverlay.className = 'map-overlay';
        mapOverlay.innerHTML = '<div class="map-overlay-text"><i class="fas fa-mouse-pointer"></i> Clique para interagir com o mapa</div>';
        
        // Estilos do overlay
        const overlayStyles = `
            .map-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(26, 54, 93, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: opacity 0.3s ease;
                z-index: 10;
            }
            .map-overlay-text {
                color: white;
                font-size: 1.1rem;
                text-align: center;
                padding: 1rem;
                background: rgba(212, 175, 55, 0.9);
                border-radius: 8px;
                backdrop-filter: blur(10px);
            }
            .map-overlay-text i {
                display: block;
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            .map-container {
                position: relative;
            }
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#map-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'map-styles';
            styleElement.textContent = overlayStyles;
            document.head.appendChild(styleElement);
        }

        mapContainer.appendChild(mapOverlay);

        // Remover overlay ao clicar
        mapOverlay.addEventListener('click', function() {
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.display = 'none';
            }, 300);
        });

        // Botão para abrir no Google Maps
        const openMapButton = document.createElement('a');
        openMapButton.href = 'https://maps.app.goo.gl/h8h9eXC54QcPB9Dd7';
        openMapButton.target = '_blank';
        openMapButton.className = 'open-map-btn';
        openMapButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Abrir no Google Maps';
        
        const buttonStyles = `
            .open-map-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: var(--accent-color);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                text-decoration: none;
                font-size: 0.9rem;
                font-weight: 500;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                z-index: 11;
            }
            .open-map-btn:hover {
                background: #b8941f;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            .open-map-btn i {
                margin-right: 0.5rem;
            }
        `;

        // Adicionar estilos do botão
        const existingMapStyles = document.querySelector('#map-styles');
        if (existingMapStyles) {
            existingMapStyles.textContent += buttonStyles;
        }

        mapContainer.appendChild(openMapButton);

        // Tracking de cliques no mapa
        openMapButton.addEventListener('click', function() {
            trackEvent('click', 'map', 'open_google_maps');
        });
    }

    // ===== GEOLOCALIZAÇÃO =====
    
    // Função para calcular distância (opcional)
    function addDistanceCalculator() {
        if (!navigator.geolocation) return;

        const distanceBtn = document.createElement('button');
        distanceBtn.className = 'distance-btn';
        distanceBtn.innerHTML = '<i class="fas fa-route"></i> Calcular distância';
        
        const mapSection = document.querySelector('.map-section');
        if (mapSection) {
            mapSection.appendChild(distanceBtn);
        }

        distanceBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const officeLat = -22.7833;
                    const officeLng = -43.4333;
                    
                    const distance = calculateDistance(userLat, userLng, officeLat, officeLng);
                    
                    this.innerHTML = `<i class="fas fa-route"></i> Distância: ${distance.toFixed(1)} km`;
                    
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-route"></i> Calcular distância';
                    }, 5000);
                },
                (error) => {
                    this.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Não foi possível calcular';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-route"></i> Calcular distância';
                    }, 3000);
                }
            );
        });

        // Estilos do botão de distância
        const distanceStyles = `
            .distance-btn {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 0.8rem 1.5rem;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.95rem;
                margin-top: 1rem;
                backdrop-filter: blur(5px);
            }
            .distance-btn:hover {
                background: rgba(212, 175, 55, 0.3);
                border-color: var(--accent-color);
                transform: translateY(-2px);
            }
            .distance-btn i {
                margin-right: 0.5rem;
            }
        `;

        const existingMapStyles = document.querySelector('#map-styles');
        if (existingMapStyles) {
            existingMapStyles.textContent += distanceStyles;
        }
    }

    // Função para calcular distância entre duas coordenadas
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // Executar animações iniciais
    setTimeout(() => {
        animateOnScroll();
        lazyLoadImages();
    }, 500);

    // Preload de imagens críticas
    function preloadImages() {
        const criticalImages = [
            'images/logo.png',
            'images/marcio.png',
            'images/camila.png',
            'images/joao.png',
            'images/fernanda.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();

    console.log('✅ Site Dr. Márcio Dantas carregado com sucesso!');

    // ===== GOOGLE ANALYTICS / TRACKING =====
    // Função para tracking de eventos (opcional)
    function trackEvent(action, category, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }
});