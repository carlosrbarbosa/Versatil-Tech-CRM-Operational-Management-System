/*
 * ARQUIVO DE JAVASCRIPT DA PÁGINA DE LOGIN (MODO DEMONSTRAÇÃO)
 * ----------------------------------------
 * Inclui lógica de login e simulação de recuperação de senha.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos da View de Login ---
    const loginView = document.getElementById('loginView');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const loginButton = document.getElementById('loginButton');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // --- Elementos da View de Recuperação ---
    const recoveryView = document.getElementById('recoveryView');
    const recoveryForm = document.getElementById('recoveryForm');
    const recoveryEmailInput = document.getElementById('recoveryEmail');
    const recoveryButton = document.getElementById('recoveryButton');
    const recoveryFeedbackMessage = document.getElementById('recoveryFeedbackMessage');

    // --- Botões de Alternância ---
    const showRecoveryBtn = document.getElementById('showRecoveryBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    // --- MODO DEMO: Pré-preencher os campos ---
    const demoEmail = 'visitante@versatil.demo';
    emailInput.value = demoEmail;
    senhaInput.value = 'demo123';
    rememberMeCheckbox.checked = true;
    
    // Já deixa o e-mail preenchido na tela de recuperação também
    recoveryEmailInput.value = demoEmail;

    // --- Navegação entre Login e Recuperação ---
    showRecoveryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        recoveryView.style.display = 'block';
        recoveryFeedbackMessage.textContent = ''; // Limpa mensagens antigas
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        recoveryView.style.display = 'none';
        loginView.style.display = 'block';
    });

    // --- Evento de Submit do Login ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> Entrando...'; 
        feedbackMessage.textContent = '';

        setTimeout(() => {
            feedbackMessage.textContent = 'Login bem-sucedido! Redirecionando...';
            feedbackMessage.style.color = 'var(--cor-sucesso)';
            
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 800);
            
        }, 1200); 
    });

    // --- Evento de Submit da Recuperação de Senha ---
    recoveryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        recoveryButton.disabled = true;
        recoveryButton.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> Validando...';
        recoveryFeedbackMessage.textContent = '';

        const emailDigitado = recoveryEmailInput.value.trim();

        setTimeout(() => {
            recoveryButton.disabled = false;
            recoveryButton.innerHTML = 'Enviar instruções';

            // Validação simples para a demonstração
            if (emailDigitado === demoEmail || emailDigitado === 'admin@versatil.demo') {
                recoveryFeedbackMessage.textContent = 'Sucesso! As instruções foram enviadas para o seu e-mail.';
                recoveryFeedbackMessage.style.color = 'var(--cor-sucesso, #78C341)'; // Verde
            } else {
                recoveryFeedbackMessage.textContent = 'Erro: E-mail não reconhecido em nossa base de dados.';
                recoveryFeedbackMessage.style.color = 'var(--cor-erro, #dc3545)'; // Vermelho
            }
        }, 1500);
    });
});