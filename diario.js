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

// Função principal do diário (lida com o formulário)

function initDiary() {
    const dailyChecklistForm = document.getElementById('dailyChecklistForm');
    if (!dailyChecklistForm) return;

    dailyChecklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerVibration();

        // Pega os elementos do card de destaque
        const highlightIcon = document.querySelector('.highlight-icon');
        const highlightMessage = document.getElementById('highlightMessage');

        // Pega os dados do formulário
        const formData = new FormData(dailyChecklistForm);
        const mood = formData.get('mood');
        const observations = formData.get('diaryMessage');

        // Lógica para atualizar o destaque
        if (observations.trim() !== '') {
            // Se houver uma observação, ela tem prioridade
            highlightIcon.textContent = '📝';
            highlightMessage.textContent = observations;
        } else if (mood) {
            // Se não, usa o humor selecionado
            const moodMap = {
                feliz: { icon: '😊', text: 'Hoje foi um dia feliz!' },
                calmo: { icon: '😐', text: 'O dia foi calmo e sereno.' },
                agitado: { icon: '😟', text: 'Hoje o dia foi um pouco mais agitado.' },
                triste: { icon: '😢', text: 'Hoje o humor esteve um pouco mais para baixo.' }
            };
            highlightIcon.textContent = moodMap[mood].icon;
            highlightMessage.textContent = moodMap[mood].text;
        } else {
            // Mensagem padrão se nada for preenchido
            highlightIcon.textContent = '📋';
            highlightMessage.textContent = 'Registro do dia salvo.';
        }

        alert('Registro diário salvo com sucesso!');
        dailyChecklistForm.reset();
    });
}

// NOVA FUNÇÃO para controlar a edição do Perfil de Saúde
function initProfileEditing() {
    const editBtn = document.getElementById('editProfileBtn');
    const profileGrid = document.getElementById('profileGrid');

    if (!editBtn || !profileGrid) return;

    editBtn.addEventListener('click', () => {
        triggerVibration();
        const isEditing = profileGrid.classList.contains('editing');

        if (isEditing) {
            // Se ESTÁ editando, vamos SALVAR
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
            // Se NÃO ESTÁ editando, vamos entrar no MODO DE EDIÇÃO
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
    if (diaryTitle) {
        diaryTitle.textContent = `Diário de Bordo da Vó ${userData.avo}`;
    }
    
    // 3. INICIALIZA TODAS AS FUNÇÕES DA PÁGINA
    initTabs();
    initDiary();
    initProfileEditing(); // Chamada da nova função
});

function initInteractiveCharts() {
    const tooltip = document.getElementById('chartTooltip');
    const charts = document.querySelectorAll('.bar-chart, .line-chart');

    if (!tooltip || charts.length === 0) return;

    charts.forEach(chart => {
        chart.addEventListener('mousemove', (e) => {
            // Pega o título do gráfico mais próximo
            const title = chart.closest('.chart-container').querySelector('h4').textContent;
            
            // Simula um valor para o protótipo
            const mockValue = `${title}: Valor do Dia`;

            tooltip.style.display = 'block';
            tooltip.textContent = mockValue;
            // Posiciona o tooltip um pouco acima e à direita do cursor do mouse
            tooltip.style.left = e.pageX + 15 + 'px';
            tooltip.style.top = e.pageY - 30 + 'px';
        });

        chart.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
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
    initInteractiveCharts(); // <-- ADICIONE ESTA LINHA
});
