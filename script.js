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
    initCalculadora();
    initBlogFilters();
    initFooter();
    initBackToTopButton();
    initAgendamentoLigacao();
    initFontSizeToggle();
    initSocialShare();
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

    revealElements.forEach(element => {
        if (element) {
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
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // As três linhas que apagavam os campos foram removidas daqui.
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
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const readMoreBtn = card.querySelector('.read-more-btn');
        const readMoreText = readMoreBtn.querySelector('span');
        const readMoreIcon = readMoreBtn.querySelector('svg');
        const fullContent = card.querySelector('.full-article-content');
        const shortText = card.querySelector('.short-text');
        const aiTipContainer = card.querySelector('.ai-tip-container');

        const toggleContent = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (fullContent.classList.contains('visible')) {
                fullContent.classList.remove('visible');
                readMoreText.textContent = 'Ler artigo';
                readMoreIcon.innerHTML = `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
                readMoreBtn.classList.remove('expanded');
                shortText.classList.remove('hidden');
                aiTipContainer.classList.remove('visible');
            } else {
                fullContent.classList.add('visible');
                readMoreText.textContent = 'Diminuir';
                readMoreIcon.innerHTML = `<path d="m18 15-6-6-6 6"/></svg>`;
                readMoreBtn.classList.add('expanded');
                shortText.classList.add('hidden');
                aiTipContainer.classList.add('visible');
            }
        };
        
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', toggleContent);
        }
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

// ==================== Lógica do Chatbot ====================

let chatHistory = [];
const CHATBOT_CONTEXT = `Você é um assistente virtual para a empresa "De Vó para Vó", especializada em serviços de cuidado para idosos no Itaim, São Paulo.
Seu objetivo é responder a perguntas de forma amigável e profissional, com base nas seguintes informações:
- A empresa oferece cuidadores, manicure/cabeleireiro, apoio psicológico, motorista e terapia ocupacional para idosos.
- O diferencial é o treinamento dos profissionais na casa da fundadora, Dona Tereca, que tem 94 anos.
- Os serviços são personalizados.
- A área de atuação é o Itaim e bairros próximos em São Paulo, como Jardins, Panamby, Morumbi, Moema, Pinheiros e Vila Madalena.
- Para agendar um serviço ou obter um orçamento, o cliente deve preencher o formulário de contato. Não forneça preços diretamente.
Responda de forma concisa. Se a pergunta for sobre preços ou agendamentos, oriente o usuário a preencher o formulário na seção 'Contato'. Mantenha a conversa focada nos serviços e na filosofia da empresa.`;

function initChatbot() {
    const headerContactBtn = document.getElementById('header-contact-btn');
    const heroWhatsappBtn = document.getElementById('hero-whatsapp-btn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatbox = document.getElementById('chatbox');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const initialMessage = "Olá! Sou o assistente virtual do De Vó para Vó. Posso te ajudar com dúvidas sobre os nossos serviços, agendamentos e informações sobre a empresa. Como posso te ajudar hoje?";

    chatHistory = [{ role: "model", parts: [{ text: initialMessage }] }];

    if (headerContactBtn) {
        headerContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotModal.classList.add('visible');
        });
    }

    if (heroWhatsappBtn) {
        heroWhatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotModal.classList.add('visible');
        });
    }
    
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatbotModal.classList.remove('visible');
        });
    }
    
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
    
    appendMessage(initialMessage, 'ai');
}

async function handleUserMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message === '') return;

    chatInput.value = '';
    
    appendMessage(message, 'user');
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(chatHistory.length - 10);
    }

    const typingIndicator = appendMessage('...', 'ai-typing');
    
    try {
        const responseText = await getChatbotResponse(chatHistory);
        typingIndicator.remove();
        appendMessage(responseText, 'ai');
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });
    } catch (error) {
        console.error('Erro ao obter a resposta do chatbot:', error);
        typingIndicator.remove();
        appendMessage('Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.', 'ai');
    }
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

async function getChatbotResponse(history) {
    if (!API_KEY_GEMINI) {
        return "Olá! A funcionalidade do assistente virtual está temporariamente desativada. Por favor, entre em contato através do formulário para mais informações.";
    }
    
    // MELHORIA: Apenas o histórico de conversa é enviado, com o contexto definido globalmente.
    const payload = { 
        contents: [...history, { role: "user", parts: [{ text: CHATBOT_CONTEXT }] }]
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY_GEMINI}`;
    
    const result = await fetchGeminiApi(apiUrl, payload);
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        return 'Desculpe, não consegui entender. Poderia reformular a pergunta?';
    }
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
                        nextStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const agendamentoLigacaoBtn = document.getElementById('agendamentoLigacaoBtn');
    const agendamentoLigacaoModal = document.getElementById('agendamentoLigacaoModal');
    const closeLigacaoModalBtn = document.getElementById('closeLigacaoModalBtn');
    const formAgendamentoLigacao = document.getElementById('formAgendamentoLigacao');
    const headerContactBtn = document.getElementById('header-contact-btn');
    const heroWhatsappBtn = document.getElementById('hero-whatsapp-btn');

    if (headerContactBtn) {
        headerContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            agendamentoLigacaoModal.classList.add('visible');
        });
    }

    if (heroWhatsappBtn) {
        heroWhatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            agendamentoLigacaoModal.classList.add('visible');
        });
    }
    
    if (closeLigacaoModalBtn) {
        closeLigacaoModalBtn.addEventListener('click', () => {
            agendamentoLigacaoModal.classList.remove('visible');
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
            
            agendamentoLigacaoModal.classList.remove('visible');
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

// ==================== NOVAS FUNÇÕES ====================

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
