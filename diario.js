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
            // Se o link clicado já está ativo, não faz nada
            if (link.classList.contains('active')) {
                return;
            }

            triggerVibration();
            const tabId = link.getAttribute('data-tab');

            // Atualiza os links das abas
            tabLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            // Atualiza a visibilidade do conteúdo
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

        // Em uma aplicação real, aqui você coletaria os dados do formulário
        // e enviaria para um servidor.

        // Para nosso protótipo, apenas damos um feedback
        alert('Registro diário salvo com sucesso!');
        dailyChecklistForm.reset();
    });
}


// --- PASSO 2: EXECUÇÃO DO SCRIPT QUANDO A PÁGINA CARREGA ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. VERIFICA SE HÁ UM USUÁRIO LOGADO
    const loggedInUserData = sessionStorage.getItem('loggedInUser');

    if (!loggedInUserData) {
        // Se não houver, redireciona para a página de login
        alert('Você precisa fazer o login para acessar esta página.');
        window.location.href = 'login.html';
        return; // Impede que o resto do script execute
    }

    // 2. PERSONALIZA A PÁGINA
    const userData = JSON.parse(loggedInUserData);
    const diaryTitle = document.getElementById('diaryTitle');
    if (diaryTitle) {
        diaryTitle.textContent = `Diário de Bordo da Vó ${userData.avo}`;
    }
    
    // 3. INICIALIZA AS FUNÇÕES DA PÁGINA (agora que já foram declaradas)
    initTabs();
    initDiary();
});
