// ===================================================================
// ======   ARQUIVO JAVASCRIPT FINAL E CORRETO PARA DIARIO.JS   ======
// ===================================================================

// --- PASSO 1: DECLARAÇÃO DE TODAS AS NOSSAS FUNÇÕES ---

function triggerVibration() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

function initTabs() {
    const tabContainer = document.querySelector('.tabs-container');
    const tabLinks = Array.from(tabContainer.querySelectorAll('.tab-link'));
    const editProfileBtn = document.getElementById('editProfileBtn');

    let currentActiveIndex = tabLinks.findIndex(link => link.classList.contains('active'));

    tabLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            if (index === currentActiveIndex) return;
            triggerVibration();

            const oldActiveLink = tabLinks[currentActiveIndex];
            const oldActiveContent = document.getElementById(oldActiveLink.dataset.tab);
            
            const newActiveLink = link;
            const newActiveContent = document.getElementById(newActiveLink.dataset.tab);

            // Determina a direção
            const direction = index > currentActiveIndex ? 'right' : 'left';

            // Remove a classe 'active' do link antigo e adiciona ao novo
            oldActiveLink.classList.remove('active');
            newActiveLink.classList.add('active');

            // Aplica as animações
            if (direction === 'right') {
                oldActiveContent.classList.add('slide-out-left');
                newActiveContent.classList.add('slide-in-right');
            } else {
                oldActiveContent.classList.add('slide-out-right');
                newActiveContent.classList.add('slide-in-left');
            }
            
            // Ativa o display do novo conteúdo para a animação ser visível
            newActiveContent.classList.add('active');

            // Limpa as classes de animação após a transição
            oldActiveContent.addEventListener('animationend', () => {
                oldActiveContent.classList.remove('active', 'slide-out-left', 'slide-out-right');
            }, { once: true });

            newActiveContent.addEventListener('animationend', () => {
                newActiveContent.classList.remove('slide-in-left', 'slide-in-right');
            }, { once: true });

            // Atualiza o índice ativo
            currentActiveIndex = index;
            
            // Lógica de visibilidade do FAB (Botão Flutuante)
            if (newActiveLink.dataset.tab === 'health-profile') {
                editProfileBtn.classList.add('visible');
            } else {
                editProfileBtn.classList.remove('visible');
            }

            // Lógica de animação dos gráficos (já existente)
            if (newActiveLink.dataset.tab === 'weekly-analysis') {
                const moodMosaic = newActiveContent.querySelector('.mood-mosaic');
                const lineCharts = newActiveContent.querySelectorAll('.line-chart');
                if (moodMosaic) {
                    moodMosaic.classList.remove('animated');
                    setTimeout(() => moodMosaic.classList.add('animated'), 10);
                }
                lineCharts.forEach(chart => {
                    chart.classList.remove('animated');
                    setTimeout(() => chart.classList.add('animated'), 10);
                });
            }
        });
    });
}

// SUGESTÃO: Substitua a sua função initDiary por esta versão final

// ===================================================================
// ======   FUNÇÃO INITDIARY - VERSÃO FINAL E COMPLETA          ======
// ===================================================================
function initDiary() {
    const dailyChecklistForm = document.getElementById('dailyChecklistForm');
    const mediaUploadInput = document.getElementById('mediaUpload');
    const mediaPreview = document.getElementById('mediaPreview');
    let mediaFileContent = null; 

    if (!dailyChecklistForm || !mediaUploadInput) {
        console.error("Formulário do Diário ou Input de Mídia não encontrados!");
        return;
    }

    // --- Lógica de pré-visualização da mídia ---
    mediaUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            mediaFileContent = null;
            mediaPreview.innerHTML = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            mediaFileContent = e.target.result;
            mediaPreview.innerHTML = '';
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = mediaFileContent;
                mediaPreview.appendChild(img);
            } else if (file.type.startsWith('audio/')) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = mediaFileContent;
                mediaPreview.appendChild(audio);
            }
        };
        reader.readAsDataURL(file);
    });

    // --- Lógica de submissão do formulário ---
    dailyChecklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerVibration();
        
        const submitBtn = dailyChecklistForm.querySelector('.submit-btn');
        const highlightIcon = document.querySelector('.highlight-icon');
        const highlightMessage = document.getElementById('highlightMessage');
        const connectionSuggestion = document.getElementById('connectionSuggestion');
        const formData = new FormData(dailyChecklistForm);
        const mood = formData.get('mood');
        const observations = document.getElementById('diaryMessage').value;
        const activities = formData.getAll('activity');

        if (observations.trim() !== '') {
            highlightIcon.textContent = '📝';
            highlightMessage.textContent = observations;
        } else if (mood) {
            const moodMap = { feliz: { icon: '😊', text: 'Hoje foi um dia feliz!' }, calmo: { icon: '😐', text: 'O dia foi calmo e sereno.' }, agitado: { icon: '😟', text: 'Hoje o dia foi um pouco mais agitado.' }, triste: { icon: '😢', text: 'Hoje o humor esteve um pouco mais para baixo.' } };
            highlightIcon.textContent = moodMap[mood].icon;
            highlightMessage.textContent = moodMap[mood].text;
        } else {
            highlightIcon.textContent = '📋';
            highlightMessage.textContent = 'Registro do dia salvo.';
        }
        
        const suggestions = { caminhada: "Que tal perguntar como foi a caminhada e o que ela viu de interessante no caminho?", fisioterapia: "Pergunte como ela está se sentindo após a fisioterapia e se algum exercício foi novidade.", alongamento: "Uma boa ideia é perguntar se ela se sentiu mais disposta depois de se alongar.", nenhuma: "Talvez seja uma boa ideia sugerir uma atividade leve para amanhã, como ouvir uma música juntos por telefone.", default: "Pergunte qual foi a parte favorita do dia dela hoje!" };
        let finalSuggestion = suggestions.default;
        if (activities.length > 0 && suggestions[activities[0]]) {
            finalSuggestion = suggestions[activities[0]];
        }
        connectionSuggestion.textContent = finalSuggestion;

        // --- LÓGICA CENTRAL: Cria e adiciona a nova entrada na timeline ---
        const timelineUl = document.querySelector('.timeline');
        if (timelineUl) {
            const newEntry = createTimelineEntry(formData, mediaFileContent);
            timelineUl.prepend(newEntry);
            initTimeline(); // Re-inicializa a timeline para que o novo item funcione
        }

        // Limpa o formulário e a pré-visualização
        dailyChecklistForm.reset();
        mediaPreview.innerHTML = '';
        mediaFileContent = null;
        
        // Animação do botão de sucesso
        submitBtn.classList.add('is-success');
        setTimeout(() => {
            submitBtn.classList.remove('is-success');
        }, 2000);
    });
}
function initInteractiveCharts() {
    const tooltip = document.getElementById('chartTooltip');
    const charts = document.querySelectorAll('.bar-chart, .line-chart');
    if (!tooltip || charts.length === 0) return;

    charts.forEach(chart => {
        chart.addEventListener('mousemove', (e) => {
            const title = chart.closest('.chart-container').querySelector('h4').textContent;
            const mockValue = `${title}: Valor do Dia (Exemplo)`;
            tooltip.style.display = 'block';
            tooltip.textContent = mockValue;
            tooltip.style.left = e.pageX + 15 + 'px';
            tooltip.style.top = e.pageY - 30 + 'px';
        });
        chart.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
}

function initTimeline() {
    const allHeaders = document.querySelectorAll('.timeline-header');

    allHeaders.forEach(header => {
        header.addEventListener('click', () => {
            triggerVibration();
            
            // Encontra o 'pai' do cabeçalho que foi clicado
            const clickedItem = header.closest('.timeline-item');
            
            // Verifica se o item clicado já estava aberto
            const wasAlreadyActive = clickedItem.classList.contains('active');

            // Antes de qualquer coisa, fecha TODOS os itens da timeline
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.classList.remove('active');
            });

            // AGORA, a decisão final:
            // Se o item que clicamos NÃO estava ativo, nós o ativamos.
            if (!wasAlreadyActive) {
                clickedItem.classList.add('active');
            }
            
            // Se ele já estava ativo, a ação de fechar todos os itens já resolveu.
            // O resultado é que clicar em um item aberto apenas o fecha.
        });
    });
}
function initHealthProfileAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            triggerVibration();
            const isActive = item.classList.contains('active');
            // Remove a lógica de fechar os outros para um acordeão mais livre
            // accordionItems.forEach(otherItem => {
            //     if (otherItem !== item) otherItem.classList.remove('active')
            // });
            item.classList.toggle('active');
        });
    });
}

function initProfileEditing() {
    const editBtn = document.getElementById('editProfileBtn');
    const accordion = document.getElementById('healthAccordion');
    if (!editBtn || !accordion) return;

    editBtn.addEventListener('click', () => {
        triggerVibration();
        const isEditing = accordion.classList.contains('editing');
        const allItems = accordion.querySelectorAll('.accordion-item');

        if (isEditing) {
            // MODO DE SALVAR
            allItems.forEach(item => {
                item.querySelectorAll('.profile-item').forEach(profileItem => {
                    const valueSpan = profileItem.querySelector('.item-value');
                    const input = profileItem.querySelector('.item-input');
                    if (valueSpan && input) {
                        if (input.type === 'date' && input.value) {
                            const [year, month, day] = input.value.split('-');
                            valueSpan.textContent = `${day}/${month}/${year}`;
                        } else {
                            valueSpan.textContent = input.value;
                        }
                    }
                });
            });
            accordion.classList.remove('editing');
            editBtn.textContent = 'Editar Perfil';
            alert('Perfil atualizado com sucesso!');
        } else {
            // MODO DE EDIÇÃO (e expande todos os acordeões)
            allItems.forEach(item => {
                item.classList.add('active'); 
                item.querySelectorAll('.profile-item').forEach(profileItem => {
                    const valueSpan = profileItem.querySelector('.item-value');
                    const input = profileItem.querySelector('.item-input');
                    if (valueSpan && input && input.type !== 'date') {
                        input.value = valueSpan.textContent;
                    }
                });
            });
            accordion.classList.add('editing');
            editBtn.textContent = 'Salvar Alterações';
        }
    });
}
function initMessageBoard() {
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messageInput = document.getElementById('morningMessageInput');
    const displayArea = document.getElementById('messageDisplayArea');
    if (!sendMessageBtn || !messageInput || !displayArea) return;

    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message === '') return;
        triggerVibration();
        displayArea.innerHTML = `<p class="sent-message">${message}</p>`;
        messageInput.value = '';
        alert('Recado enviado para a cuidadora!');
    });
}

function initExportButton() {
    const exportBtn = document.getElementById('exportPdfBtn');
    const letterModal = document.getElementById('letterModal');
    if (!exportBtn || !letterModal) return;

    // Função para abrir o modal
    exportBtn.addEventListener('click', () => {
        triggerVibration();
        
        // **Lógica para popular o modal dinamicamente (exemplo)**
        // Em um app real, você pegaria os dados dos gráficos aqui.
        // Por agora, vamos copiar o mosaico de humor existente como demonstração.
        const mainMosaic = document.querySelector('#weekly-analysis .mood-mosaic');
        const letterMosaicContainer = letterModal.querySelector('.letter-mood-mosaic');
        
        if (mainMosaic && letterMosaicContainer) {
            letterMosaicContainer.innerHTML = mainMosaic.innerHTML;
        }

        letterModal.classList.add('visible');
    });

    // Função para fechar o modal
    const closeBtn = letterModal.querySelector('[data-close-modal="letterModal"]');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            letterModal.classList.remove('visible');
        });
    }

    // Fechar clicando fora do modal (opcional, mas bom para UX)
    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) {
            letterModal.classList.remove('visible');
        }
    });
}
function initDynamicHeader(userData) {
    const diaryTitle = document.getElementById('diaryTitle');
    const diarySubtitle = document.getElementById('diarySubtitle');

    if (!diaryTitle || !diarySubtitle) return;

    // Define o nome da avó no título principal
    diaryTitle.textContent = `Diário de Bordo da Vó ${userData.avo}`;

    // Lógica para a saudação dinâmica
    const horaAtual = new Date().getHours();
    let saudacao;
    if (horaAtual >= 5 && horaAtual < 12) {
        saudacao = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = "Boa tarde";
    } else {
        saudacao = "Boa noite";
    }
        diarySubtitle.textContent = `${saudacao}, ${userData.familia}. Aqui estão as últimas atualizações.`;
}

function initWellnessFlower() {
    const form = document.getElementById('dailyChecklistForm');
    if (!form) return;

    const petals = {
        mood: document.getElementById('petal-mood'),
        sleep: document.getElementById('petal-sleep'),
        eating: document.getElementById('petal-eating'),
        activity: document.getElementById('petal-activity')
    };

    // Função para atualizar uma pétala
    const updatePetal = (key, value) => {
        const petal = petals[key];
        if (!petal) return;

        if (value) {
            petal.classList.add('filled');
            // Condições para o estado "vibrante"
            if ((key === 'mood' && value === 'feliz') ||
                (key === 'sleep' && value === 'bom') ||
                (key === 'eating' && value === 'boa') ||
                (key === 'activity' && (value !== 'nenhuma' && value !== ''))) {
                petal.classList.add('vibrant');
            } else {
                petal.classList.remove('vibrant');
            }
        } else {
            petal.classList.remove('filled', 'vibrant');
        }
    };

    // Adiciona os listeners aos campos do formulário
    form.addEventListener('change', (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'radio') {
            updatePetal(name, value);
        } else if (type === 'checkbox' && name === 'activity') {
            const activities = Array.from(form.querySelectorAll('input[name="activity"]:checked')).map(cb => cb.value);
            updatePetal('activity', activities.length > 0 ? activities[0] : '');
        }
    });

    // Reseta a flor quando o formulário é resetado
    form.addEventListener('reset', () => {
        Object.keys(petals).forEach(key => updatePetal(key, ''));
    });
}

// ===================================================================
// ======   FUNÇÃO NOVA PARA CRIAR ENTRADAS NA TIMELINE         ======
// ===================================================================
function createTimelineEntry(formData, mediaSrc) {
    const item = document.createElement('li');
    item.className = 'timeline-item';

    // Se houver mídia, adiciona a classe para o estilo "Polaroid"
    if (mediaSrc && mediaSrc.startsWith('data:image/')) {
        item.classList.add('has-media');
    }

    const mood = formData.get('mood') || 'calmo';
    const moodMap = {
        feliz: '😊 Feliz',
        calmo: '😐 Calmo',
        agitado: '😟 Agitado',
        triste: '😢 Triste'
    };

    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    let mediaHTML = '';
    if (mediaSrc) {
        if (mediaSrc.startsWith('data:image/')) {
            mediaHTML = `<div class="timeline-media"><img src="${mediaSrc}" alt="Memória do dia"></div>`;
        } else if (mediaSrc.startsWith('data:audio/')) {
            mediaHTML = `<div class="timeline-media"><audio controls src="${mediaSrc}"></audio></div>`;
        }
    }

    const summaryText = formData.get('diaryMessage') || 'Nenhuma observação registrada para este dia.';
    const sleepText = formData.get('sleep') ? formData.get('sleep').charAt(0).toUpperCase() + formData.get('sleep').slice(1) : '

    
// --- EXECUÇÃO DO SCRIPT QUANDO A PÁGINA CARREGA ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se há um usuário logado
    const loggedInUserData = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserData) {
        alert('Você precisa fazer o login para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Personaliza a página com dados do login
    const userData = JSON.parse(loggedInUserData);
    
    // 3. Inicializa todas as funcionalidades da página
    initDynamicHeader(userData);
    initTabs();
    initWellnessFlower();
    initDiary();
    initInteractiveCharts();
    initTimeline();
    initHealthProfileAccordion();
    initProfileEditing();
    initMessageBoard();
    initExportButton();
});
