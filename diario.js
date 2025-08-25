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
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.classList.contains('active')) return;
            triggerVibration();
            const tabId = link.getAttribute('data-tab');

            // Desativa todas as abas e conteúdos
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Ativa a aba e o conteúdo clicado
            link.classList.add('active');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.add('active');
            }

            // **NOVA LÓGICA DE ANIMAÇÃO**
            // Se a aba de análise for ativada, aciona as animações
            if (tabId === 'weekly-analysis') {
                const moodMosaic = activeContent.querySelector('.mood-mosaic');
                const lineCharts = activeContent.querySelectorAll('.line-chart');

                // Remove a classe para 'resetar' a animação e depois a adiciona novamente
                if (moodMosaic) {
                    moodMosaic.classList.remove('animated');
                    // Usamos um pequeno timeout para garantir que o navegador processe a remoção da classe antes de adicioná-la de novo
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

function initDiary() {
    const dailyChecklistForm = document.getElementById('dailyChecklistForm');
    if (!dailyChecklistForm) return;

    dailyChecklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerVibration();

        const submitBtn = dailyChecklistForm.querySelector('.submit-btn');

        // Lógica dos cards de Destaque e Conexão (inalterada)
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
     
        // LÓGICA DA ANIMAÇÃO DO BOTÃO APRIMORADA
        submitBtn.classList.add('is-success');

        // Após a animação, apenas reseta o botão, mantendo os dados no formulário
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
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    timelineItems.forEach(item => {
        const header = item.querySelector('.timeline-header');
        if (header) {
            header.addEventListener('click', () => {
                triggerVibration();
                const isActive = item.classList.contains('active');
                timelineItems.forEach(otherItem => otherItem.classList.remove('active'));
               if (!isActive) {
    item.classList.add('active');
    // Adicione esta lógica:
    const moodSpan = item.querySelector('.timeline-mood');
    if (moodSpan) {
        const mood = moodSpan.dataset.mood;
        const dot = item.querySelector('.timeline-dot');
        if(dot) dot.dataset.activeMood = mood;
    }
} else {
    const dot = item.querySelector('.timeline-dot');
    if(dot) delete dot.dataset.activeMood;
}
            });
        }
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


// --- PASSO 2: EXECUÇÃO DO SCRIPT QUANDO A PÁGINA CARREGA (ÚNICO BLOCO) ---
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
    const diaryTitle = document.getElementById('diaryTitle');
    const diarySubtitle = document.getElementById('diarySubtitle');
    const profileImage = document.getElementById('profileImage');
    
    if (diaryTitle) diaryTitle.textContent = `Diário de Bordo da Vó ${userData.avo}`;
    if (diarySubtitle) diarySubtitle.textContent = `Registros de cuidado e bem-estar da ${userData.familia}`;
    if (profileImage) profileImage.alt = `Foto da Vó ${userData.avo}`;
    
    // 3. Inicializa todas as funcionalidades da página
    initDynamicHeader(userData);
    initTabs();
    initDiary();
    initInteractiveCharts();
    initTimeline();
    initHealthProfileAccordion();
    initProfileEditing();
    initMessageBoard(); 
    initExportButton();
});
