// Função para vibrar (opcional, mas mantém a consistência)
function triggerVibration() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

// Função principal do diário
function initDiary() {
    const diaryForm = document.getElementById('diaryForm');
    const diaryEntries = document.getElementById('diaryEntries');

    if (!diaryForm) return;

    // Lógica para adicionar uma nova entrada
    diaryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerVibration();

        const message = document.getElementById('diaryMessage').value;
        const authorType = document.getElementById('diaryAuthor').value;
        
        if (!message.trim()) return;

        const authorName = authorType === 'familia' ? 'Família' : 'Cuidadora';
        const authorClass = authorType === 'familia' ? 'author-family' : '';
        const now = new Date();
        const timestamp = `${now.toLocaleDateString('pt-BR')}, ${now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;

        const newEntry = document.createElement('div');
        newEntry.className = `diary-entry ${authorClass}`;
        newEntry.innerHTML = `
            <p class="entry-meta"><strong>${authorName}</strong> em ${timestamp}</p>
            <p class="entry-text">${message}</p>
        `;

        diaryEntries.prepend(newEntry);

        document.getElementById('diaryMessage').value = '';
    });
}

// Inicializa a funcionalidade quando a página carregar
document.addEventListener('DOMContentLoaded', initDiary);
