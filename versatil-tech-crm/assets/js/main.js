/*
 * ARQUIVO DE JAVASCRIPT PRINCIPAL
 * --------------------------------
 * Contém a lógica global da aplicação, como o menu mobile.
*/

document.addEventListener('DOMContentLoaded', () => {

    // Primeiro, tentamos encontrar os elementos na página.
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // A MÁGICA ESTÁ AQUI:
    // Este 'if' verifica se TODOS os três elementos foram encontrados.
    // Se a página for a de login (onde eles не existem), o código dentro do 'if'
    // simplesmente não será executado, evitando erros.
    if (mobileMenuToggle && sidebar && mobileOverlay) {
        
        // Função para fechar o menu
        const closeMenu = () => {
            sidebar.classList.remove('is-open');
            mobileOverlay.classList.remove('is-visible');
        };

        // Adiciona evento de clique no botão hambúrguer
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            mobileOverlay.classList.toggle('is-visible');
        });

        // Adiciona evento de clique no overlay para fechar o menu
        mobileOverlay.addEventListener('click', closeMenu);
    }
    
    // Podemos adicionar outras lógicas globais aqui no futuro, fora do if.
});

