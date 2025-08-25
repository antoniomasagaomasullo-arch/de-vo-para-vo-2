// ===================================================================
// ======   ARQUIVO COMPLETO E CORRIGIDO PARA diario.js   ======
// ===================================================================

// --- PASSO 1: DECLARAÇÃO DE TODAS AS FUNÇÕES ---

// Função para vibrar (opcional, mas mantém a consistência)
function triggerVibration() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Função para controlar as abas
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.classList.contains('active')) {
                return;
            }
            triggerVibration();
            const tabId = link.getAttribute('data-tab');

            tabLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

// Função para o formulário de registro e card de destaque
function initDiary() {
    const dailyChecklistForm = document.getElementById('dailyChecklistForm');
    if (!dailyChecklistForm) return;

    dailyChecklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerVibration();

        // Pega os elementos dos cards
        const highlightIcon = document.querySelector('.highlight-icon');
        const highlightMessage = document.getElementById('highlightMessage');
        const connectionSuggestion = document.getElementById('connectionSuggestion');

        // Pega os dados do formulário
        const formData = new FormData(dailyChecklistForm);
        const mood = formData.get('mood');
        const observations = document.getElementById('diaryMessage').value;
        const activities = formData.getAll('activity'); // Pega todas as atividades marcadas

        // --- Lógica para o Destaque do Dia (sem alterações) ---
        if (observations.trim() !== '') {
            highlightIcon.textContent = '📝';
            highlightMessage.textContent = observations;
        } else if (mood) {
            const moodMap = {
                feliz: { icon: '😊', text: 'Hoje foi um dia feliz!' },
                calmo: { icon: '😐', text: 'O dia foi calmo e sereno.' },
                agitado: { icon: '😟', text: 'Hoje o dia foi um pouco mais agitado.' },
                triste: { icon: '😢', text: 'Hoje o humor esteve um pouco mais para baixo.' }
            };
            highlightIcon.textContent = moodMap[mood].icon;
            highlightMessage.textContent = moodMap[mood].text;
        } else {
            highlightIcon.textContent = '📋';
            highlightMessage.textContent = 'Registro do dia salvo.';
        }

        // --- NOVA LÓGICA PARA O MOMENTO CONEXÃO ---
        const suggestions = {
            caminhada: "Que tal perguntar como foi a caminhada e o que ela viu de interessante no caminho?",
            fisioterapia: "Pergunte como ela está se sentindo após a fisioterapia e se algum exercício foi novidade.",
            alongamento: "Uma boa ideia é perguntar se ela se sentiu mais disposta depois de se alongar.",
            nenhuma: "Talvez seja uma boa ideia sugerir uma atividade leve para amanhã, como ouvir uma música juntos por telefone.",
            default: "Pergunte qual foi a parte favorita do dia dela hoje!"
        };

        let finalSuggestion = suggestions.default;
        // Pega a primeira atividade da lista para gerar a sugestão
        if (activities.length > 0 && suggestions[activities[0]]) {
            finalSuggestion = suggestions[activities[0]];
        }
        connectionSuggestion.textContent = finalSuggestion;


        alert('Registro diário salvo com sucesso!');
        dailyChecklistForm.reset();
    });
}

// Função para controlar a edição do Perfil de Saúde
function initProfileEditing() {
    const editBtn = document.getElementById('editProfileBtn');
    const profileGrid = document.getElementById('profileGrid');
    if (!editBtn || !profileGrid) return;

    editBtn.addEventListener('click', () => {
        triggerVibration();
        const isEditing = profileGrid.classList.contains('editing');

        if (isEditing) {
            profileGrid.querySelectorAll('.profile-item').forEach(item => {
                const valueSpan = item.querySelector('.item-value');
                const input = item.querySelector('.item-input');
                if (input.type === 'date') {
                    const [year, month, day] = input.value.split('-');
                    valueSpan.textContent = `${day}/${month}/${year}`;
                } else {
                    valueSpan.textContent = input.value;
                }
            });
            profileGrid.classList.remove('editing');
            editBtn.textContent = 'Editar Perfil';
            alert('Perfil atualizado com sucesso!');
        } else {
            profileGrid.querySelectorAll('.profile-item').forEach(item => {
                const valueSpan = item.querySelector('.item-value');
                const input = item.querySelector('.item-input');
                if (input.type !== 'date') {
                    input.value = valueSpan.textContent;
                }
            });
            profileGrid.classList.add('editing');
            editBtn.textContent = 'Salvar Alterações';
        }
    });
}

// Função para os gráficos interativos
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

// --- PASSO 2: EXECUÇÃO DO SCRIPT QUANDO A PÁGINA CARREGA ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICA SE HÁ UM USUÁRIO LOGADO
    const loggedInUserData = sessionStorage.getItem('loggedInUser');
    if (!loggedInUserData) {
        alert('Você precisa fazer o login para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // 2. PERSONALIZA A PÁGINA
    const userData = JSON.parse(loggedInUserData);
    const diaryTitle = document.getElementById('diaryTitle');
    const diarySubtitle = document.getElementById('diarySubtitle');
    const profileImage = document.getElementById('profileImage');
    
    if (diaryTitle) {
        diaryTitle.textContent = `Diário de Bordo da Vó ${userData.avo}`;
    }
    if (diarySubtitle) {
        diarySubtitle.textContent = `Registros de cuidado e bem-estar da ${userData.familia}`;
    }
    if (profileImage) {
        profileImage.alt = `Foto da Vó ${userData.avo}`;
    }
    
    // 3. INICIALIZA TODAS AS FUNÇÕES DA PÁGINA
    initTabs();
    initDiary();
    initProfileEditing();
    initInteractiveCharts();
});

// Adicione esta nova função ANTES do evento 'DOMContentLoaded' no seu diario.js

function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    timelineItems.forEach(item => {
        const header = item.querySelector('.timeline-header');
        if (header) {
            header.addEventListener('click', () => {
                triggerVibration();
                // Fecha todos os outros itens para manter a interface limpa
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Alterna o estado do item clicado
                item.classList.toggle('active');
            });
        }
    });
}


// AGORA, adicione a chamada da nova função dentro do 'DOMContentLoaded'
// que já existe no seu arquivo.

document.addEventListener('DOMContentLoaded', () => {
    // ... seu código de login e personalização ...

    // 3. INICIALIZA AS FUNÇÕES DA PÁGINA
    initTabs();
    initDiary();
    initProfileEditing();
    initInteractiveCharts();
    initTimeline(); // <-- ADICIONE ESTA LINHA
});
