document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorElement = document.getElementById('loginError');

    // Defina aqui as credenciais "corretas" para o protótipo
    const correctEmail = 'familia@email.com';
    const correctPassword = '1234';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === correctEmail && password === correctPassword) {
            // Sucesso no login!
            const userData = {
                avo: 'Dona Tereca',
                familia: 'Família Silva'
            };

            // Salva os dados na "sessão" do navegador
            sessionStorage.setItem('loggedInUser', JSON.stringify(userData));

            // Redireciona para a página do diário
            window.location.href = 'diario.html';

        } else {
            // Erro no login
            errorElement.textContent = 'Email ou senha inválidos. Tente novamente.';
        }
    });
});
