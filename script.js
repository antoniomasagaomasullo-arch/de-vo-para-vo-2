// ==================== Scripts de Inicialização ====================
// A chave de API do Google Gemini é necessária apenas para as funções de IA (chatbot e dicas do blog).
// A função de busca de CEP não precisa desta chave.
const API_KEY_GEMINI = ""; // Coloque a sua chave aqui para ativar o chatbot e as dicas de IA.

document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initScrollReveal();
    initParallax();
    initFormHandlers();
    initServiceButtonHandlers();
    initCarousel();
    initBlogLinks();
    initNavToggle();
    initAITipGenerators();
    initFAQ();
    initChatbot();
    initQuiz();
    initCalculadora();
    initBlogFilters();
    initFooter();
    initBackToTopButton();
    initSmartHeader();
    initAgendamentoLigacao();
    initFontSizeToggle();
    initContrastToggle(); 
    initDarkMode(); 
    initSocialShare();
    initReadingProgress();
    initChecklist();
    initConselhoVoForm();
    initHighlightToShare();
});

// ==================== Funções de Efeitos Visuais ====================

function initLoadingScreen() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2500);
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((element, index) => {
        if (element) {
            // Calcula um atraso crescente, mas que reseta a cada 5 elementos
            // para não ficar muito longo em seções com muitos itens.
            const delay = (index % 5) * 150; // Atraso de 150ms por item
            element.style.transitionDelay = `${delay}ms`;
            revealObserver.observe(element);
        }
    });
}

function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length === 0) return;

    let lastScrollY = window.pageYOffset;
    let tick = false;

    function updateParallax() {
        const scrolled = lastScrollY;
        parallaxElements.forEach((element) => {
            const speed = parseFloat(element.dataset.speed || 0.1);
            const yPos = scrolled * speed;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        tick = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.pageYOffset;
        if (!tick) {
            window.requestAnimationFrame(updateParallax);
            tick = true;
        }
    });
}

function initBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    const progressCircle = backToTopBtn.querySelector('.progress-ring__circle--progress');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius; // Calcula a circunferência do círculo

    // Define o comprimento e o início do traço do SVG
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    // Função para atualizar a animação do círculo
    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    window.addEventListener('scroll', () => {
        // Calcula a percentagem de scroll da página
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        setProgress(scrollPercent); // Atualiza o anel de progresso

        // Controla a visibilidade do botão
        if (scrollTop > 200) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initSmartHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollTop = 0;
    const delta = 5; // Pequena margem para evitar ativação em rolagens mínimas
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Garante que o usuário rolou mais que a margem 'delta'
        if (Math.abs(lastScrollTop - scrollTop) <= delta) {
            return;
        }

        // Adiciona a classe 'scrolled' para o efeito de encolhimento quando rolar além da altura do header
        if (scrollTop > headerHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Esconde o header ao rolar para baixo, mostra ao rolar para cima
        if (scrollTop > lastScrollTop && scrollTop > headerHeight){
            // Scroll Down
            header.classList.add('header--hidden');
        } else {
            // Scroll Up
            header.classList.remove('header--hidden');
        }

        lastScrollTop = scrollTop;
    });
}

// ==================== Funções de Navegação e Interatividade ====================

function initNavToggle() {
    const navToggleBtn = document.getElementById('navToggleBtn');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    
    if (!navToggleBtn || !navMenu || !navOverlay) return;
    
    navToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        if (navMenu.classList.contains('active')) {
            navToggleBtn.textContent = '✕';
        } else {
            navToggleBtn.textContent = '☰';
        }
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            navToggleBtn.textContent = '☰';
        });
    });

    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

function openWhatsApp(message) {
    const phoneNumber = '5511999999999';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

function handleSubmit(event) {
    event.preventDefault();
    triggerVibration();

    const form = event.target;
    const cepInput = form.querySelector('#cep');
    const cpfInput = form.querySelector('#cpf');
    const telefoneInput = form.querySelector('#telefone');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const selectedServices = Array.from(document.querySelectorAll('input[name="servicos[]"]:checked'))
                                             .map(checkbox => checkbox.value)
                                             .join(', ');

    let message = "Olá, gostaria de um orçamento!\n\n";
    message += `Nome: ${data.nome}\n`;
    message += `E-mail: ${data.email}\n`;
    message += `Telefone: ${data.telefone}\n`;
    message += `CPF: ${data.cpf}\n`;
    message += `Serviços de interesse: ${selectedServices || 'Nenhum'}\n`;
    message += `Endereço: ${data.endereco} - ${data.bairro}, ${data.cidade}\n`;
    message += `CEP: ${data.cep}\n`;
    
    openWhatsApp(message);
    
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('visible');
    }
}

function validateCepFormat(value) {
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(value);
}

function validateCpfFormat(value) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(value);
}

function validateTelefoneFormat(value) {
    const sanitized = value.replace(/\D/g, '');
    if (sanitized.length === 11) {
        const telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        return telefoneRegex.test(value);
    } else if (sanitized.length === 10) {
        const telefoneRegex = /^\(\d{2}\)\s\d{4}-\d{4}$/;
        return telefoneRegex.test(value);
    }
    return false;
}

function maskCEP(value) {
    let sanitized = value.replace(/\D/g, '');
    sanitized = sanitized.substring(0, 8);
    if (sanitized.length > 5) {
        sanitized = sanitized.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return sanitized;
}

function maskCPF(value) {
    let sanitized = value.replace(/\D/g, '');
    sanitized = sanitized.replace(/^(\d{3})(\d)/, '$1.$2');
    sanitized = sanitized.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    sanitized = sanitized.replace(/\.(\d{3})(\d)/, '.$1-$2');
    return sanitized.substring(0, 14);
}

function maskTelefone(value) {
    let sanitized = value.replace(/\D/g, '');
    let masked = '';
    if (sanitized.length > 0) {
        masked = '(' + sanitized.substring(0, 2);
    }
    if (sanitized.length > 2) {
        masked += ') ' + sanitized.substring(2, 7);
    }
    if (sanitized.length > 7) {
        masked += '-' + sanitized.substring(7, 11);
    }
    return masked;
}

function updateValidationIcons(inputElement, isValid) {
    const parent = inputElement.closest('.form-group');
    if (!parent) return;

    const successIcon = parent.querySelector('.success-icon');
    const errorIcon = parent.querySelector('.error-icon');

    if (successIcon) successIcon.style.display = isValid ? 'inline' : 'none';
    if (errorIcon) errorIcon.style.display = isValid === false ? 'inline' : 'none';
}

function initFormHandlers() {
    const form = document.querySelector('.contact-form');
    const cepInput = document.getElementById('cep');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    const cepStatus = document.getElementById('cep-status');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('successModal');
    const bairroTags = document.querySelectorAll('#bairros-atuacao .service-tag');

    bairroTags.forEach(tag => {
        tag.addEventListener('click', () => {
            bairroTags.forEach(t => {
                t.classList.remove('selected');
                t.setAttribute('aria-pressed', 'false');
            });
            tag.classList.add('selected');
            tag.setAttribute('aria-pressed', 'true');
        });
    });

    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            e.target.value = maskCEP(value);
            if (value.length === 8) {
                searchCEP(value);
            } else {
                if (cepStatus) {
                    cepStatus.textContent = '';
                    cepStatus.classList.remove('success', 'error');
                }
                updateValidationIcons(cepInput, null);
                document.getElementById('endereco').value = '';
                document.getElementById('bairro').value = '';
                document.getElementById('cidade').value = '';
            }
        });
    }

    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = maskCPF(e.target.value);
            updateValidationIcons(e.target, validateCpfFormat(e.target.value));
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            e.target.value = maskTelefone(e.target.value);
            updateValidationIcons(e.target, validateTelefoneFormat(e.target.value));
        });
    }
    
    // MELHORIA: Validação em tempo real para o e-mail
    if (emailInput) {
        emailInput.addEventListener('input', function(e) {
            updateValidationIcons(e.target, e.target.validity.valid);
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('visible');
                form.reset();
            }
        });
    }
const formInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');

    formInputs.forEach(input => {
        const parent = input.closest('.form-group');
        if (!parent) return;

        // Ativa o efeito se o input já tiver um valor (ex: preenchimento automático)
        if (input.value) {
            parent.classList.add('active');
        }

        input.addEventListener('focus', () => {
            parent.classList.add('active');
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                parent.classList.remove('active');
            }
        });
    });
    // FIM DO NOVO BLOCO
}

async function searchCEP(cep) {
    const statusElement = document.getElementById('cep-status');
    const enderecoField = document.getElementById('endereco');
    const bairroField = document.getElementById('bairro');
    const cidadeField = document.getElementById('cidade');
    const cepInput = document.getElementById('cep');
    const bairroTags = document.querySelectorAll('#bairros-atuacao .service-tag');

    if (!statusElement || !enderecoField || !bairroField || !cidadeField) return;
    
    const bairrosAtendidos = {
        'Itaim': ['Itaim Bibi'],
        'Jardins': ['Jardim América', 'Jardim Paulista', 'Jardim Europa', 'Jardim Paulistano', 'Jardins'],
        'Panamby': ['Panamby', 'Paraíso do Morumbi', 'Vila Andrade'],
        'Morumbi': ['Morumbi'],
        'Moema': ['Moema', 'Indianópolis'],
        'Pinheiros': ['Pinheiros'],
        'Vila Madalena': ['Vila Madalena'],
        'Higienópolis': ['Higienópolis']
    };

    bairroTags.forEach(tag => {
        tag.classList.remove('selected');
        tag.setAttribute('aria-pressed', 'false');
    });

    try {
        statusElement.textContent = '🔍 Buscando endereço...';
        statusElement.classList.remove('error');
        statusElement.classList.add('success');
        
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado.');
        }
        
        enderecoField.value = `${data.logradouro}, ${data.complemento || ''}`.trim();
        bairroField.value = data.bairro;
        cidadeField.value = `${data.localidade} - ${data.uf}`;
        
        enderecoField.removeAttribute('readonly');
        bairroField.removeAttribute('readonly');
        cidadeField.removeAttribute('readonly');

        let isBairroAtendido = false;
        let bairroPrincipal = '';

        for (const [key, value] of Object.entries(bairrosAtendidos)) {
            if (value.includes(data.bairro)) {
                isBairroAtendido = true;
                bairroPrincipal = key;
                break;
            }
        }

        if (isBairroAtendido) {
            statusElement.textContent = `✅ Endereço encontrado. Atendemos no bairro ${bairroPrincipal}!`;
            statusElement.classList.remove('error');
            statusElement.classList.add('success');
            
            const tagCorreta = document.querySelector(`#bairros-atuacao .service-tag[data-bairro-principal="${bairroPrincipal}"]`);
            if (tagCorreta) {
                tagCorreta.classList.add('selected');
                tagCorreta.setAttribute('aria-pressed', 'true');
            }
            updateValidationIcons(cepInput, true);
        } else {
            statusElement.textContent = `❌ Infelizmente ainda não atendemos a sua região.`;
            statusElement.classList.remove('success');
            statusElement.classList.add('error');
            enderecoField.setAttribute('readonly', true);
            bairroField.setAttribute('readonly', true);
            cidadeField.setAttribute('readonly', true);
            updateValidationIcons(cepInput, false);
        }

    } catch (error) {
        statusElement.textContent = `❌ ${error.message}`;
        statusElement.classList.remove('success');
        statusElement.classList.add('error');
        enderecoField.value = '';
        bairroField.value = '';
        cidadeField.value = '';
        enderecoField.setAttribute('readonly', true);
        bairroField.setAttribute('readonly', true);
        cidadeField.setAttribute('readonly', true);
        updateValidationIcons(cepInput, false);
    }
}

function initServiceButtonHandlers() {
    const serviceButtons = document.querySelectorAll('.open-whatsapp-service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = button.getAttribute('data-service');
            
            const contactSection = document.getElementById('contato');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            const checkboxes = document.querySelectorAll('input[name="servicos[]"]');
            checkboxes.forEach(cb => {
                if (cb.value !== 'Cuidadora') {
                    cb.checked = false;
                }
            });
            
            const selectedCheckbox = document.querySelector(`input[name="servicos[]"][value="${serviceName}"]`);
            if (selectedCheckbox) {
                selectedCheckbox.checked = true;
            }
        });
    });
}

function initCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');
    const wrapper = document.querySelector('.testimonial-carousel-wrapper');
    if (!carousel || !slides.length || !prevBtn || !nextBtn || !wrapper) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let slideWidth = 0;
    
    function setCarouselHeight() {
        const maxSlideHeight = Math.max(...Array.from(slides).map(s => s.offsetHeight));
        wrapper.style.height = `${maxSlideHeight}px`;
    }

    function updateCarousel() {
        if (slides.length > 0) {
            currentTranslate = -currentIndex * slideWidth;
            carousel.style.transform = `translateX(${currentTranslate}px)`;
        }
    }
    
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }
    
    window.addEventListener('resize', () => {
        setCarouselHeight();
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth;
        }
        updateCarousel();
    });
    
    setCarouselHeight();
    if (slides.length > 0) {
        slideWidth = slides[0].offsetWidth;
    }

    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateCarousel();
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
        startAutoSlide();
    });
    
    wrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startPos = e.touches[0].clientX;
        prevTranslate = currentTranslate;
        clearInterval(autoSlideInterval);
    });

    wrapper.addEventListener('touchend', () => {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        if (movedBy < -100) {
            currentIndex = (currentIndex + 1) % slides.length;
        }
        if (movedBy > 100) {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        }
        updateCarousel();
        startAutoSlide();
    });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.touches[0].clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    });

    startAutoSlide();
}

function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (!filterButtons.length || !blogCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
    triggerVibration(); // 🆕 NOVA LINHA
    const filter = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            blogCards.forEach(card => {
                const cardTag = card.getAttribute('data-tag');
                if (filter === 'all' || filter === cardTag) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initBlogLinks() {
    const progressBar = document.getElementById('readingProgressBar');
    if (!progressBar) return;

    let activeArticleContent = null;

    // Função que calcula e atualiza a barra de progresso
    const scrollHandler = () => {
        if (!activeArticleContent) return;

        const rect = activeArticleContent.getBoundingClientRect();
        const progress = (-rect.top / (rect.height - window.innerHeight)) * 100;
        const cappedProgress = Math.min(Math.max(progress, 0), 100);
        
        progressBar.style.width = `${cappedProgress}%`;
    };

    // Adiciona o listener de scroll à janela (apenas uma vez)
    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Adiciona os listeners de clique a todos os botões "Ler artigo"
    document.querySelectorAll('.blog-card .read-more-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = button.closest('.blog-card');
            const content = card.querySelector('.full-article-content');
            const textSpan = button.querySelector('span');
            const iconSvg = button.querySelector('svg');
            const isOpening = !content.classList.contains('visible');

            // Antes de fazer qualquer coisa, fecha todos os outros artigos que possam estar abertos
            document.querySelectorAll('.full-article-content.visible').forEach(openContent => {
                if (openContent !== content) {
                    openContent.classList.remove('visible');
                    const otherButton = openContent.closest('.blog-card').querySelector('.read-more-btn');
                    const otherText = otherButton.querySelector('span');
                    const otherIcon = otherButton.querySelector('svg');

                    otherButton.classList.remove('expanded');
                    otherText.textContent = 'Ler artigo';
                    otherIcon.innerHTML = `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`;
                }
            });

            // Agora, abre ou fecha o artigo que foi clicado
            content.classList.toggle('visible');
            button.classList.toggle('expanded');
            
            // Atualiza o texto e o ícone do botão clicado
            if (isOpening) {
                textSpan.textContent = 'Diminuir';
                iconSvg.innerHTML = `<path d="m18 15-6-6-6 6"/>`;
            } else {
                textSpan.textContent = 'Ler artigo';
                iconSvg.innerHTML = `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`;
            }

            // Finalmente, controla a visibilidade da barra de progresso
            if (isOpening) {
                activeArticleContent = content;
                progressBar.classList.add('visible');
            } else {
                activeArticleContent = null;
                progressBar.classList.remove('visible');
                progressBar.style.width = '0%';
            }
        });
    });
}

// ==================== Funções da API Gemini ====================
async function fetchGeminiApi(url, payload) {
    if (!API_KEY_GEMINI) {
        console.error("Chave de API do Gemini não configurada. O chatbot e as dicas de IA não funcionarão.");
        return { error: "API key not configured." };
    }
    
    let response = null;
    let retryDelay = 1000;
    const maxRetries = 5;

    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                return await response.json();
            } else if (response.status === 429) {
                console.warn(`Tentativa ${i + 1}: Rate limit excedido. Tentando novamente em ${retryDelay / 1000}s.`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay *= 2;
            } else {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            console.warn(`Tentativa ${i + 1}: Erro de rede. Tentando novamente em ${retryDelay / 1000}s.`, error);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retryDelay *= 2;
        }
    }

    throw new Error("Não foi possível obter uma resposta da API após várias tentativas.");
}

function initAITipGenerators() {
    const generateButtons = document.querySelectorAll('.generate-tip-btn');
    
    generateButtons.forEach(button => {
        const card = button.closest('.blog-card-content');
        const aiTipContainer = card.querySelector('.ai-tip-container');
        const aiTipText = card.querySelector('.ai-tip-text');
        const loadingSkeleton = card.querySelector('.loading-skeleton');
        const audioBtn = card.querySelector('.audio-btn');

        button.addEventListener('click', async () => {
            const topic = button.getAttribute('data-topic');
            aiTipText.textContent = '';
            aiTipContainer.classList.add('visible');
            loadingSkeleton.style.display = 'flex';
            aiTipContainer.classList.remove('loaded');
            button.classList.add('loading');
            button.disabled = true;
            audioBtn.style.display = 'none';

            try {
                const tip = await generateNewTip(topic);
                if (tip === 'Nenhuma dica gerada. Tente novamente.') {
                    throw new Error(tip);
                }
                aiTipText.textContent = tip;
                audioBtn.dataset.textForAudio = tip;
                audioBtn.style.display = 'block';
            } catch (error) {
                aiTipText.textContent = 'Ocorreu um erro ao gerar a dica. Tente novamente.';
                console.error('Erro ao gerar a dica:', error);
            } finally {
                loadingSkeleton.style.display = 'none';
                aiTipContainer.classList.add('loaded');
                button.classList.remove('loading');
                button.disabled = false;
            }
        });
    });

    const audioButtons = document.querySelectorAll('.audio-btn');
    audioButtons.forEach(button => {
        const card = button.closest('.blog-card-content');
        const aiTipTextElement = card.querySelector('.ai-tip-text');
        button.addEventListener('click', async () => {
            const text = aiTipTextElement.textContent;
            if (text && text.length > 0) {
                const audioIcon = button.querySelector('.audio-icon');
                audioIcon.textContent = '...';
                audioIcon.classList.add('loading-audio');
                await playAudio(text, button);
                audioIcon.textContent = '📢';
                audioIcon.classList.remove('loading-audio');
            }
        });
    });
}

async function generateNewTip(topic) {
    if (!API_KEY_GEMINI) {
        return 'Nenhuma dica gerada. A chave de API não está configurada.';
    }
    const prompt = `Gere uma dica curta e útil (no máximo 50 palavras) para cuidadores de idosos, focada no tema de "${topic}". Formate a resposta como uma frase direta.`;
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY_GEMINI}`;
    const result = await fetchGeminiApi(apiUrl, payload);

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        return 'Nenhuma dica gerada. Tente novamente.';
    }
}

async function playAudio(text) {
    if (!API_KEY_GEMINI) {
        alert("Função de áudio desativada. Chave de API não configurada.");
        return;
    }
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createBufferSource();
    const payload = {
        contents: [{
            parts: [{ text: text }]
        }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: "Puck" }
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY_GEMINI}`;
    const result = await fetchGeminiApi(apiUrl, payload);
    const audioDataPart = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (audioDataPart) {
        const base64Audio = base64ToArrayBuffer(audioDataPart.inlineData.data);
        
        const sampleRate = 24000;
        
        const audioBuffer = audioContext.createBuffer(1, base64Audio.byteLength / 2, sampleRate);
        const nowBuffering = audioBuffer.getChannelData(0);
        const pcm16 = new Int16Array(base64Audio);
        for (let i = 0; i < pcm16.length; i++) {
            nowBuffering[i] = pcm16[i] / 32768;
        }
        
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    }
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            toggleFAQItem(item, faqItems);
        });
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQItem(item, faqItems);
            }
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                navigateFAQ(e.key, item, faqItems);
            }
        });
    });
}

function toggleFAQItem(currentItem, allItems) {
    const question = currentItem.querySelector('.faq-question');
    const isActive = currentItem.classList.contains('active');
    
    allItems.forEach(item => {
        if (item !== currentItem) {
            item.classList.remove('active');
            const otherQuestion = item.querySelector('.faq-question');
            otherQuestion.setAttribute('aria-expanded', 'false');
        }
    });
    
    if (isActive) {
        currentItem.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
    } else {
        currentItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        
        setTimeout(() => {
            currentItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }
}

function navigateFAQ(direction, currentItem, allItems) {
    const currentIndex = Array.from(allItems).indexOf(currentItem);
    let nextIndex;
    
    if (direction === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % allItems.length;
    } else {
        nextIndex = currentIndex === 0 ? allItems.length - 1 : currentIndex - 1;
    }
    
    const nextQuestion = allItems[nextIndex].querySelector('.faq-question');
    nextQuestion.focus();
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeItems = document.querySelectorAll('.faq-item.active');
        activeItems.forEach(item => {
            item.classList.remove('active');
            const question = item.querySelector('.faq-question');
            question.setAttribute('aria-expanded', 'false');
        });
    }
});


// ==================== Lógica do Chatbot (Novo Layout) ====================

const quickReplyAnswers = {
    "Quais serviços vocês oferecem?": "Oferecemos um cuidado 360º! Nossos principais serviços são: Cuidadoras, Manicure e Cabeleireiro, Apoio Psicológico, Motorista e Terapia Ocupacional. Precisa de detalhes sobre algum deles?",
    "Qual a área de atendimento?": "Atendemos principalmente no Itaim e em bairros próximos como Jardins, Panamby, Morumbi, Moema, Pinheiros e Vila Madalena. Para confirmar seu endereço, por favor, utilize o formulário de contato na página. 😉",
    "Como agendo uma avaliação?": "É muito simples! O melhor caminho é preencher nosso formulário de contato na seção 'Contato' ou, se preferir, pode agendar uma ligação diretamente pelo botão 'Agendar uma Avaliação'.",
    "Qual o diferencial da empresa?": "Nosso grande diferencial é o carinho! ❤️ Todos os nossos profissionais são treinados na prática em nossa própria casa, cuidando da nossa avó, Dona Tereca. Assim, garantimos que eles cuidem dos nossos clientes como se fossem da nossa própria família."
};

function initChatbot() {
    const chatbotTogglerBtn = document.getElementById('chatbotTogglerBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatbox = document.getElementById('chatbox');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const quickRepliesContainer = document.getElementById('quickReplies');

    const initialMessage = "Olá! Como posso te ajudar? 👋";
    
    // Mostra a mensagem inicial e as opções rápidas
    const showInitialState = () => {
        chatbox.innerHTML = '';
        appendMessage(initialMessage, 'ai');
        quickRepliesContainer.style.display = 'block';
    };
    
    // Lógica para abrir o chat
    if (chatbotTogglerBtn) {
        chatbotTogglerBtn.addEventListener('click', () => {
            triggerVibration(); 
            chatbotModal.classList.add('visible');
            document.body.classList.add('modal-open');
            showInitialState();
        });
    }

    // Lógica para fechar o chat
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatbotModal.classList.remove('visible');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Lógica para enviar mensagem digitada
    if (sendBtn) {
        sendBtn.addEventListener('click', handleUserMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
    }

    // Lógica para os botões de resposta rápida
if (quickRepliesContainer) {
        quickRepliesContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const question = e.target.dataset.question;
                const answer = quickReplyAnswers[question];
                
                quickRepliesContainer.style.display = 'none';
                
                appendMessage(question, 'user');
                
                setTimeout(() => {
                    appendMessage(answer, 'ai');
                    setTimeout(() => {
                        appendMessage("Posso ajudar com algo mais?", 'ai');
                        quickRepliesContainer.style.display = 'block';
                    }, 1200);
                }, 500);
            }
        });
    }
}

async function handleUserMessage() {
    const chatInput = document.getElementById('chatInput');
    const quickRepliesContainer = document.getElementById('quickReplies');
    const message = chatInput.value.trim();
    if (message === '') return;

    chatInput.value = '';
    quickRepliesContainer.style.display = 'none'; // Esconde as opções ao digitar
    
    appendMessage(message, 'user');
    
    // Resposta padrão caso a IA não esteja configurada
    setTimeout(() => {
        appendMessage("Obrigado pela sua mensagem. Para continuar o atendimento, por favor, preencha o formulário de contato.", 'ai');
    }, 1000);
}

function appendMessage(text, sender) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
    return messageElement;
}

function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    const quizSteps = quizContainer.querySelectorAll('.quiz-step');
    const quizOptions = quizContainer.querySelectorAll('.quiz-option');
    let userAnswers = {};

    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            const currentStepElem = option.closest('.quiz-step');
            const currentStep = currentStepElem.dataset.step;
            const nextStep = option.dataset.next;
            const value = option.dataset.value;
            const action = option.dataset.action;

            userAnswers[currentStep] = value;

            if (action === 'finish') {
                quizContainer.style.display = 'none';
                // Chamar a função que atualiza a calculadora com as respostas
                updateCalculatorFromQuiz(userAnswers);
            } else {
                currentStepElem.classList.remove('active');
                quizContainer.querySelector(`.quiz-step[data-step="${nextStep}"]`).classList.add('active');
            }
        });
    });
}

function updateCalculatorFromQuiz(answers) {
    // Respostas: answers['1'], answers['2'], answers['3']
    const tipoCuidado = document.querySelector(`.option-card[data-tipo="${answers['1']}"]`);
    const horasCuidado = document.querySelector(`.option-card[data-horas="${answers['2']}"]`);
    const diasCuidado = document.querySelector(`.option-card[data-dias="${answers['3']}"]`);

    // Desmarca todas as opções antes de marcar as novas
    document.querySelectorAll('#step1 .option-card, #step2 .option-card, #step3 .option-card').forEach(card => {
        card.classList.remove('selected');
    });

    if (tipoCuidado) tipoCuidado.click();
    if (horasCuidado) horasCuidado.click();
    if (diasCuidado) diasCuidado.click();
}

function initCalculadora() {
    class CalculadoraOrcamento {
        constructor() {
            this.dados = {
                tipo: 'basico',
                preco: 30,
                horas: 12,
                dias: 7,
                tipoLabel: 'Cuidado Básico',
                horasLabel: '12 horas/dia',
                diasLabel: '7 dias/semana'
            };
            this.init();
        }
        init() {
            // Para ativar a persistência de dados, descomente a linha abaixo.
            // this.loadState();
            this.bindEvents();
            this.calcular();
            this.updateStepIndicator();
        }
    bindEvents() {
    document.querySelectorAll('.calculadora-container .option-card').forEach(card => {
        card.addEventListener('click', (e) => {
    triggerVibration(); // 🆕 NOVA LINHA
            const step = card.closest('.calc-step');
            const stepOptions = step.querySelectorAll('.option-card');
            stepOptions.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            this.updateData(card);
            this.calcular();
            this.updateStepIndicator();

            const nextStep = document.getElementById(`step${parseInt(step.id.slice(4)) + 1}`);
            if(nextStep) {
                document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
                nextStep.classList.add('active');
                // Adiciona um pequeno atraso para a animação ser mais agradável
                setTimeout(() => {
                    nextStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    });

    document.querySelectorAll('.calculadora-container .step-label').forEach(label => {
        label.addEventListener('click', (e) => {
            const step = label.closest('.calc-step');
            document.querySelectorAll('.calc-step').forEach(s => s.classList.remove('active'));
            step.classList.add('active');
        });
    });

    document.getElementById('btnWhatsApp').addEventListener('click', (e) => {
        e.preventDefault();
        this.enviarWhatsApp();
    });
}
        updateData(card) {
            if (card.dataset.tipo) {
                this.dados.tipo = card.dataset.tipo;
                this.dados.preco = parseInt(card.dataset.preco);
                this.dados.tipoLabel = card.dataset.label;
            }
            if (card.dataset.horas) {
                this.dados.horas = parseInt(card.dataset.horas);
                this.dados.horasLabel = card.dataset.label;
            }
            if (card.dataset.dias) {
                this.dados.dias = parseInt(card.dataset.dias);
                this.dados.diasLabel = card.dataset.label;
            }
            // Para ativar a persistência, descomente a linha abaixo
            // this.saveState();
        }
        calcular() {
            const valorMensal = this.dados.preco * this.dados.horas * this.dados.dias * 4.3;
            document.getElementById('valorFinal').textContent = valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            document.getElementById('totalMensal').textContent = valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            document.getElementById('valorHora').textContent = this.dados.preco;
            document.getElementById('tipoSelecionado').textContent = this.dados.tipoLabel;
            document.getElementById('periodoSelecionado').textContent = this.dados.horasLabel;
            document.getElementById('frequenciaSelecionada').textContent = this.dados.diasLabel;
            const resultado = document.getElementById('resultado');
            if (!resultado.classList.contains('visible')) {
                setTimeout(() => {
                    resultado.classList.add('visible');
                }, 300);
            }
        }
        updateStepIndicator() {
            const steps = document.querySelectorAll('.calc-step');
            steps.forEach((step, index) => {
                const allOptionsSelected = Array.from(step.querySelectorAll('.option-card')).some(c => c.classList.contains('selected'));
                if (allOptionsSelected) {
                    step.classList.add('completed');
                } else {
                    step.classList.remove('completed');
                }
            });
        }
        enviarWhatsApp() {
            const mensagem = `Olá! Usei a calculadora do site e gostaria de agendar uma avaliação com base no meu orçamento:
            🏥 Tipo: ${this.dados.tipoLabel}
            ⏰ Período: ${this.dados.horasLabel}
            📅 Frequência: ${this.dados.diasLabel}
            💰 Estimativa: R$ ${document.getElementById('totalMensal').textContent}/mês`;
            const telefone = '5511999999999';
            const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
        }
        // Métodos para persistência (descomentar para usar)
        // saveState() {
        //    localStorage.setItem('calculadoraData', JSON.stringify(this.dados));
        // }
        // loadState() {
        //    const savedData = localStorage.getItem('calculadoraData');
        //    if (savedData) {
        //        this.dados = JSON.parse(savedData);
        //        this.restoreUIFromState();
        //    }
        // }
        // restoreUIFromState() {
        //    const step1 = document.getElementById('step1');
        //    const step2 = document.getElementById('step2');
        //    const step3 = document.getElementById('step3');
        //
        //    const selectCard = (stepElement, dataKey, dataValue) => {
        //        const card = stepElement.querySelector(`[data-${dataKey}="${dataValue}"]`);
        //        if (card) {
        //            card.classList.add('selected');
        //        }
        //    };
        //
        //    selectCard(step1, 'tipo', this.dados.tipo);
        //    selectCard(step2, 'horas', this.dados.horas);
        //    selectCard(step3, 'dias', this.dados.dias);
        // }
    }
    new CalculadoraOrcamento();
}

function initFooter() {
    const footerYear = document.querySelector('.footer p:last-child');
    if (footerYear) {
        footerYear.textContent = `© ${new Date().getFullYear()} - De Vó para Vó`;
    }
}

function initAgendamentoLigacao() {
    const agendamentoLigacaoModal = document.getElementById('agendamentoLigacaoModal');
    const closeLigacaoModalBtn = document.getElementById('closeLigacaoModalBtn');
    const formAgendamentoLigacao = document.getElementById('formAgendamentoLigacao');
    const headerContactBtn = document.getElementById('header-contact-btn');
    const heroWhatsappBtn = document.getElementById('hero-whatsapp-btn');

    const openModal = (e) => {
        e.preventDefault();
        triggerVibration();
        agendamentoLigacaoModal.classList.add('visible');
        document.body.classList.add('modal-open'); // Adiciona a classe para travar o scroll
    };

    const closeModal = () => {
        agendamentoLigacaoModal.classList.remove('visible');
        document.body.classList.remove('modal-open'); // Remove a classe para liberar o scroll
    };

    if (headerContactBtn) {
        headerContactBtn.addEventListener('click', openModal);
    }

    if (heroWhatsappBtn) {
        heroWhatsappBtn.addEventListener('click', openModal);
    }
    
    if (closeLigacaoModalBtn) {
        closeLigacaoModalBtn.addEventListener('click', () => {
            closeModal();
            formAgendamentoLigacao.reset();
        });
    }

    if (formAgendamentoLigacao) {
        formAgendamentoLigacao.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formAgendamentoLigacao);
            const nome = formData.get('nome');
            const telefone = formData.get('telefone');
            const horario = new Date(formData.get('horario')).toLocaleString('pt-BR');

            const message = `Olá, gostaria de agendar uma ligação!\n\nNome: ${nome}\nTelefone: ${telefone}\nHorário de preferência: ${horario}`;
            openWhatsApp(message);
            
            closeModal();
            formAgendamentoLigacao.reset();
        });
    }
}

function initFontSizeToggle() {
    const fontSizeToggleBtn = document.getElementById('fontSizeToggleBtn');
    if (!fontSizeToggleBtn) return;

    fontSizeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('large-font');
        const isLargeFont = document.documentElement.classList.contains('large-font');
        fontSizeToggleBtn.setAttribute('aria-pressed', isLargeFont);
    });
}

function initContrastToggle() {
    const contrastToggleBtn = document.getElementById('contrastToggleBtn');
    if (!contrastToggleBtn) return;

    contrastToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        contrastToggleBtn.setAttribute('aria-pressed', isHighContrast);
    });
}

// ==================== NOVAS FUNÇÕES ====================

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });
}

// MELHORIA: Lógica para compartilhamento em redes sociais
function initSocialShare() {
    const socialShareButtons = document.querySelectorAll('.social-share-btn');
    socialShareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = button.dataset.platform;
            const articleUrl = window.location.href;
            const articleTitle = document.title;
            let shareUrl = '';

            switch (platform) {
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + ' ' + articleUrl)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
                    break;
                default:
                    return;
            }

            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        });
    });
}

function triggerVibration() {
    // Verifica se a API de Vibração é suportada pelo navegador
    if ('vibrate' in navigator) {
        // Vibração curta de 50 milissegundos
        navigator.vibrate(50);
    }
}

function initReadingProgress() {
    const progressBar = document.getElementById('readingProgressBar');
    if (!progressBar) return;

    let currentArticle = null;

    // Observa quando um artigo fica visível
    const articleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentArticle = entry.target.closest('.blog-card');
                progressBar.classList.add('visible');
            } else {
                // Se o artigo que estava sendo lido saiu da tela, esconde a barra
                if (currentArticle === entry.target.closest('.blog-card')) {
                    currentArticle = null;
                    progressBar.classList.remove('visible');
                    progressBar.style.width = '0%';
                }
            }
        });
    }, { threshold: 0.5 }); // Ativa quando 50% do artigo está visível

    // Adiciona o observador a todos os conteúdos de artigo
    document.querySelectorAll('.full-article-content').forEach(articleContent => {
        articleObserver.observe(articleContent);
    });

    // Atualiza a barra com base na rolagem
    window.addEventListener('scroll', () => {
        if (!currentArticle) return;

        const articleContent = currentArticle.querySelector('.full-article-content');
        const rect = articleContent.getBoundingClientRect();

        // Calcula o quanto do artigo já foi "scrollado" para dentro da tela
        const scrollPercent = (window.innerHeight - rect.top) / rect.height;

        // Garante que o percentual fique entre 0 e 100
        const progress = Math.min(Math.max(scrollPercent, 0), 1) * 100;

        progressBar.style.width = `${progress}%`;
    });
}

function initChecklist() {
    const checklist = document.getElementById('interactiveChecklist');
    if (!checklist) return;

    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('checklistProgressBar');
    const counter = document.getElementById('checklistCounter');
    const totalItems = checkboxes.length;

    const updateProgress = () => {
        const checkedItems = checklist.querySelectorAll('input[type="checkbox"]:checked').length;

        // Atualiza a barra de progresso
        const progressPercentage = (checkedItems / totalItems) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Atualiza o contador de texto
        counter.textContent = `${checkedItems} de ${totalItems} itens concluídos`;

        // Adiciona ou remove a classe para o efeito visual
        checkboxes.forEach(cb => {
            const item = cb.closest('.check-item');
            if (cb.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    };

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });

    // Inicia o contador no estado inicial
    updateProgress();
}

// ==================== Lógica do Formulário "Conselho de Vó" ====================
function initConselhoVoForm() {
    const form = document.getElementById('formConselhoVo');
    const successMessage = document.getElementById('submissionSuccessMessage');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio real do formulário
        triggerVibration();

        // Esconde o formulário e mostra a mensagem de sucesso
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // Opcional: em um projeto real, aqui você enviaria os dados para um servidor.
        // const formData = new FormData(form);
        // const data = Object.fromEntries(formData.entries());
        // console.log("Dados a serem enviados:", data);
    });
}

function initHighlightToShare() {
    const sharePopup = document.getElementById('share-popup');
    if (!sharePopup) return;

    let selectedText = '';

    document.addEventListener('mouseup', (e) => {
        // Atraso para garantir que a seleção foi registrada
        setTimeout(() => {
            const selection = window.getSelection();
            selectedText = selection.toString().trim();
            const articleContent = e.target.closest('.article-content');

            if (selectedText && articleContent) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                
                // Posiciona o pop-up acima da seleção
                const top = window.scrollY + rect.top - sharePopup.offsetHeight - 10;
                const left = window.scrollX + rect.left + (rect.width / 2) - (sharePopup.offsetWidth / 2);

                sharePopup.style.top = `${top}px`;
                sharePopup.style.left = `${left}px`;
                sharePopup.classList.add('visible');
            } else {
                // Esconde se o clique for fora ou a seleção for limpa
                sharePopup.classList.remove('visible');
            }
        }, 10);
    });

    sharePopup.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const platform = button.dataset.platform;
        const articleUrl = window.location.href;
        const quote = `"${selectedText}" - De Vó para Vó`;
        let shareUrl = '';

        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(quote + '\n\nLeia mais em: ' + articleUrl)}`;
                break;
            case 'linkedin':
                 shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }
    });
}

