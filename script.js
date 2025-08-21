// ==================== Scripts de Inicialização ====================

document.addEventListener('DOMContentLoaded', function() {
    // Verifica a preferência do usuário por movimento reduzido e aplica a classe no HTML
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        document.documentElement.classList.add('prefers-reduced-motion');
    }

    initScrollReveal();
    initParallax();
    initFormHandlers();
    initServiceButtonHandlers();
    initCarousel();
    initBlogLinks();
    initNavToggle();
    initAITipGenerators();
    initFAQ();
    initChatbot(); // Inicializa o chatbot
    initBlogCarousel(); // Novo: Inicializa o carrossel do blog
    
    // Oculta a tela de carregamento após um tempo
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2500);
    
    // Adiciona a classe 'scrolled' ao header ao rolar a página
    let isThrottled = false;
    window.addEventListener('scroll', function() {
        if (!isThrottled) {
            window.requestAnimationFrame(() => {
                const header = document.querySelector('.header');
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                isThrottled = false;
            });
            isThrottled = true;
        }
    });
});

// ==================== Funções de Efeitos Visuais ====================

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

// ==================== Funções de Navegação e Interatividade ====================

function scrollToContact() {
    const contactElement = document.getElementById('contato');
    if (contactElement) {
        contactElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function initNavToggle() {
    const navToggleBtn = document.getElementById('navToggleBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggleBtn || !navMenu) return;
    
    navToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            navToggleBtn.textContent = '✕';
        } else {
            navToggleBtn.textContent = '☰';
        }
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggleBtn.textContent = '☰';
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

    // Validação final dos campos antes de enviar
    const form = event.target;
    const cepInput = form.querySelector('#cep');
    const cpfInput = form.querySelector('#cpf');
    const telefoneInput = form.querySelector('#telefone');

    let isValid = true;
    if (!validateCepFormat(cepInput.value)) {
        cepInput.setCustomValidity('CEP inválido.');
        isValid = false;
    } else {
        cepInput.setCustomValidity('');
    }

    if (!validateCpfFormat(cpfInput.value)) {
        cpfInput.setCustomValidity('CPF inválido.');
        isValid = false;
    } else {
        cpfInput.setCustomValidity('');
    }

    if (!validateTelefoneFormat(telefoneInput.value)) {
        telefoneInput.setCustomValidity('Telefone inválido.');
        isValid = false;
    } else {
        telefoneInput.setCustomValidity('');
    }
    
    if (!isValid) {
        // Se algum campo for inválido, exibe a mensagem de validação do browser
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
    
    // Exibe o modal de sucesso
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('visible');
    }
}

// Função para validar o formato do CEP
function validateCepFormat(value) {
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(value);
}

// Função para validar o formato do CPF (simples)
function validateCpfFormat(value) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(value);
}

// Função para validar o formato do telefone (simples)
function validateTelefoneFormat(value) {
    const telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    return telefoneRegex.test(value);
}

// Função para aplicar a máscara no CEP
function maskCEP(value) {
    let sanitized = value.replace(/\D/g, '');
    if (sanitized.length > 5) {
        sanitized = sanitized.substring(0, 5) + '-' + sanitized.substring(5, 8);
    }
    return sanitized;
}

// Função para aplicar a máscara no CPF
function maskCPF(value) {
    let sanitized = value.replace(/\D/g, '');
    sanitized = sanitized.replace(/^(\d{3})(\d)/, '$1.$2');
    sanitized = sanitized.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    sanitized = sanitized.replace(/\.(\d{3})(\d)/, '.$1-$2');
    return sanitized.substring(0, 14);
}

// Função para aplicar a máscara no Telefone
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

function initFormHandlers() {
    const form = document.querySelector('.contact-form');
    const cepInput = document.getElementById('cep');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepStatus = document.getElementById('cep-status');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('successModal');

    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            e.target.value = maskCEP(value);
            if (value.length === 8) {
                searchCEP(value);
            } else {
                if (cepStatus) cepStatus.textContent = '';
                document.getElementById('endereco').value = '';
                document.getElementById('bairro').value = '';
                document.getElementById('cidade').value = '';
            }
        });
    }

    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = maskCPF(e.target.value);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            e.target.value = maskTelefone(e.target.value);
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
    if (!statusElement) return;
    try {
        statusElement.textContent = '🔍 Buscando endereço...';
        statusElement.style.color = 'var(--primary-color)';
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        const enderecoField = document.getElementById('endereco');
        const bairroField = document.getElementById('bairro');
        const cidadeField = document.getElementById('cidade');
        if (enderecoField) {
            enderecoField.value = `${data.logradouro}, ${data.complemento || ''}`.trim();
            enderecoField.removeAttribute('readonly');
        }
        if (bairroField) bairroField.value = data.bairro;
        if (cidadeField) cidadeField.value = `${data.localidade} - ${data.uf}`;
        statusElement.textContent = '✅ Endereço encontrado!';
        statusElement.style.color = '#10B981'; /* Usando o valor diretamente para não depender de uma var CSS */
    } catch (error) {
        statusElement.textContent = '❌ CEP não encontrado. Verifique o número.';
        statusElement.style.color = '#EF4444'; /* Usando o valor diretamente para não depender de uma var CSS */
        const enderecoField = document.getElementById('endereco');
        const bairroField = document.getElementById('bairro');
        const cidadeField = document.getElementById('cidade');
        if (enderecoField) enderecoField.value = '';
        if (bairroField) bairroField.value = '';
        if (cidadeField) cidadeField.value = '';
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
                // Limpa todas as seleções, exceto a de "Cuidadora" que é obrigatória
                if (cb.value !== 'Cuidadora') {
                    cb.checked = false;
                }
            });
            
            // Encontra e marca o checkbox correspondente ao serviço clicado
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

    function setCarouselHeight() {
        const maxSlideHeight = Math.max(...Array.from(slides).map(s => s.offsetHeight));
        wrapper.style.height = `${maxSlideHeight}px`;
    }

    function updateCarousel() {
        currentTranslate = -currentIndex * slides[0].offsetWidth;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }
    
    window.addEventListener('resize', setCarouselHeight);
    setCarouselHeight();
    
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

    // Touch events for swipe functionality
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

// Nova função para o carrossel de blog
function initBlogCarousel() {
    const blogCarousel = document.getElementById('blogCarousel');
    const blogCards = document.querySelectorAll('#blogCarousel .blog-card');
    const prevBtn = document.getElementById('blogPrevBtn');
    const nextBtn = document.getElementById('blogNextBtn');
    
    if (!blogCarousel || !blogCards.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    const scrollAmount = blogCards[0].offsetWidth + 32; // Largura do card + gap (2rem = 32px)
    
    // Adiciona a classe 'revealed' nos cards do blog para a animação
    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.5
    });

    blogCards.forEach(card => blogObserver.observe(card));

    prevBtn.addEventListener('click', () => {
        blogCarousel.scrollLeft -= scrollAmount;
    });

    nextBtn.addEventListener('click', () => {
        blogCarousel.scrollLeft += scrollAmount;
    });
}

function initBlogLinks() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const readMoreBtn = card.querySelector('.blog-card-actions .read-more-btn');
        const fullContent = card.querySelector('.full-article-content');
        const shortText = card.querySelector('.short-text');
        const title = card.querySelector('.article-header h3');

        const toggleContent = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (fullContent.classList.contains('visible')) {
                fullContent.classList.remove('visible');
                readMoreBtn.textContent = 'Ler artigo';
                shortText.classList.remove('hidden');
            } else {
                fullContent.classList.add('visible');
                readMoreBtn.textContent = 'Diminuir';
                shortText.classList.add('hidden');
            }
        };
        
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', toggleContent);
        }
        if (title) {
            title.addEventListener('click', toggleContent);
        }
    });
}

// ==================== Funções da API Gemini ====================

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
            aiTipContainer.style.display = 'block';
            loadingSkeleton.style.display = 'flex';
            aiTipContainer.classList.remove('loaded');
            button.classList.add('loading');
            button.disabled = true;
            audioBtn.style.display = 'none';

            try {
                const tip = await generateNewTip(topic);
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
    const prompt = `Gere uma dica curta e útil (no máximo 50 palavras) para cuidadores de idosos, focada no tema de "${topic}". Formate a resposta como uma frase direta.`;
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // <-- COLOQUE SUA API KEY AQUI
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let response = null;
    let retryDelay = 1000;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                break;
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

    if (!response || !response.ok) {
        throw new Error("Não foi possível obter uma resposta da API após várias tentativas.");
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        return text;
    } else {
        return 'Nenhuma dica gerada. Tente novamente.';
    }
}

async function playAudio(text) {
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
    const apiKey = ""; // <-- COLOQUE SUA API KEY AQUI
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    let response = null;
    let retryDelay = 1000;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                break;
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

    if (!response || !response.ok) {
        console.error("Não foi possível obter uma resposta de áudio da API após várias tentativas.");
        return;
    }

    const result = await response.json();
    const audioDataPart = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (audioDataPart) {
        const base64Audio = audioDataPart.inlineData.data;
        const pcmData = base64ToArrayBuffer(base64Audio);
        
        // MimeType is 'audio/L16; rate=24000'
        const sampleRate = 24000;
        
        const audioBuffer = audioContext.createBuffer(1, pcmData.byteLength / 2, sampleRate);
        const nowBuffering = audioBuffer.getChannelData(0);
        const pcm16 = new Int16Array(pcmData);
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

// Código do FAQ
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

// Função principal para inicializar o chatbot
function initChatbot() {
    const headerContactBtn = document.getElementById('header-contact-btn');
    const heroWhatsappBtn = document.getElementById('hero-whatsapp-btn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatbox = document.getElementById('chatbox');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const initialMessage = "Olá! Sou o assistente virtual do De Vó para Vó. Posso te ajudar com dúvidas sobre os nossos serviços, agendamentos e informações sobre a empresa. Como posso te ajudar hoje?";

    // Adiciona a mensagem inicial ao histórico do chat
    chatHistory.push({ role: "model", parts: [{ text: initialMessage }] });

    // Eventos para abrir o modal do chatbot
    headerContactBtn.addEventListener('click', () => {
        chatbotModal.classList.add('visible');
    });
    heroWhatsappBtn.addEventListener('click', () => {
        chatbotModal.classList.add('visible');
    });

    // Evento para fechar o modal
    closeChatBtn.addEventListener('click', () => {
        chatbotModal.classList.remove('visible');
    });
    
    // Eventos para enviar mensagem
    sendBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    // Adiciona a mensagem inicial ao chatbox
    appendMessage(initialMessage, 'ai');
}

// Função para lidar com a mensagem do usuário
async function handleUserMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message === '') return;

    // Limpa o input
    chatInput.value = '';
    
    // Adiciona a mensagem do usuário ao chatbox e ao histórico
    appendMessage(message, 'user');
    chatHistory.push({ role: "user", parts: [{ text: message }] });

    // Mostra o indicador de digitação da IA
    const typingIndicator = appendMessage('...', 'ai-typing');
    
    try {
        // Chama a API para obter a resposta do chatbot
        const responseText = await getChatbotResponse(chatHistory);
        
        // Remove o indicador de digitação
        typingIndicator.remove();
        
        // Adiciona a resposta da IA ao chatbox e ao histórico
        appendMessage(responseText, 'ai');
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });
    } catch (error) {
        console.error('Erro ao obter a resposta do chatbot:', error);
        typingIndicator.remove();
        appendMessage('Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.', 'ai');
    }
}

// Função para adicionar uma nova mensagem ao chatbox
function appendMessage(text, sender) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatbox.appendChild(messageElement);
    // Rola para o final para mostrar a nova mensagem
    chatbox.scrollTop = chatbox.scrollHeight;
    return messageElement;
}

// Função para chamar a API do Gemini e obter a resposta
async function getChatbotResponse(history) {
    const prompt = `Você é um assistente virtual para a empresa "De Vó para Vó", especializada em serviços de cuidado para idosos no Itaim, São Paulo.
    Seu objetivo é responder a perguntas de forma amigável e profissional, com base nas seguintes informações:
    - A empresa oferece cuidadores, manicure/cabeleireiro, apoio psicológico e motorista para idosos.
    - O diferencial é o treinamento dos profissionais na casa da fundadora, Dona Tereca, que tem 94 anos.
    - Os serviços são personalizados.
    - A área de atuação é o Itaim e bairros próximos em São Paulo.
    - Para agendar um serviço ou obter um orçamento, o cliente deve preencher o formulário de contato. Não forneça preços diretamente.

    Responda de forma concisa. Se a pergunta for sobre preços ou agendamentos, oriente o usuário a preencher o formulário na seção 'Contato'. Mantenha a conversa focada nos serviços e na filosofia da empresa.

    Histórico da conversa: ${JSON.stringify(history)}
    
    Responda à última pergunta do usuário.`;

    let chatHistoryWithPrompt = [];
    chatHistoryWithPrompt.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistoryWithPrompt };
    const apiKey = ""; // <-- COLOQUE SUA API KEY AQUI
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    let response = null;
    let retryDelay = 1000;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                break;
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
    
    if (!response || !response.ok) {
        throw new Error("Não foi possível obter uma resposta da API após várias tentativas.");
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        return text;
    } else {
        return 'Desculpe, não consegui entender. Poderia reformular a pergunta?';
    }
}
