// Adicione todo este bloco no TOPO do seu arquivo diario.js
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

    // 3. INICIALIZA AS FUNÇÕES DA PÁGINA (código que já tínhamos)
    initTabs();
    initDiary();
});

}// Função para vibrar (opcional, mas mantém a consistência)
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
            const tabId = link.getAttribute('data-tab');

            // Atualiza os links
            tabLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            // Atualiza o conteúdo
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


// Função principal do diário (agora lida com o novo formulário)
function initDiary() {
    const dailyChecklistForm = document.getElementById('dailyChecklistForm');

    if (!dailyChecklistForm) return;

    dailyChecklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerVibration();

        // Em uma aplicação real, aqui você coletaria os dados do formulário:
        // const formData = new FormData(dailyChecklistForm);
        // const data = Object.fromEntries(formData.entries());
        // console.log(data); // E enviaria para um servidor

        // Para nosso protótipo, apenas damos um feedback
        alert('Registro diário salvo com sucesso!');
        dailyChecklistForm.reset();
    });
}

// Inicializa tudo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initDiary();
});
