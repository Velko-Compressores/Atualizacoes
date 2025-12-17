
document.addEventListener('DOMContentLoaded', () => {
    if (!window.CartUtils) {
        console.error('CartUtils não encontrado. Inclua cart-utils.js antes deste arquivo.');
        return;
    }

    const { CartKeys, loadCart } = window.CartUtils;

    // Elementos do DOM
    const cartBody = document.querySelector('.cart-table tbody');
    const confirmBtn = document.getElementById('confirm-checkout');
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const phoneInput = document.getElementById('user-phone');

    // Carrega carrinho master
    let masterCart = loadCart(CartKeys.master);

    // Renderiza itens na tabela
    function renderMasterCart() {
        cartBody.innerHTML = '';
        if (!Array.isArray(masterCart) || masterCart.length === 0) {
            cartBody.innerHTML = '<tr><td colspan="3">Carrinho está vazio.</td></tr>';
            return;
        }
        masterCart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name} <small style="opacity:.7">(${item.page})</small></td>
                <td>Quantidade: ${item.quantity}</td>
                <td>${item.image ? `${item.image}` : '<span style="opacity:.6">Sem imagem</span>'}</td>
            `;
            cartBody.appendChild(row);
        });
    }

    // Validação simples de e-mail
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Normaliza telefone
    function normalizePhone(phone) {
        return String(phone).replace(/[^\d+]/g, '');
    }

    // Monta mensagem do pedido
    function buildOrderMessage({ nome, email, telefone, cart }) {
        let message = `Pedido de ${nome}\n`;
        message += `Email: ${email}\n`;
        message += `Telefone: ${telefone}\n\nItens:\n`;
        cart.forEach(item => {
            message += `- ${item.name} (${item.page}) | Quantidade: ${item.quantity}\n`;
        });
        return message;
    }

    // Enviar pedido
    function handleSendOrder() {
        const nome = nameInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = phoneInput.value.trim();

        if (!nome || !email || !telefone) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('Informe um e-mail válido.');
            emailInput.focus();
            return;
        }

        const telefoneNormalizado = normalizePhone(telefone);
        masterCart = loadCart(CartKeys.master);

        if (!Array.isArray(masterCart) || masterCart.length === 0) {
            alert('Seu carrinho master está vazio.');
            return;
        }

        const message = buildOrderMessage({ nome, email, telefone: telefoneNormalizado, cart: masterCart });
        const destinatario = 'diegojfsr@gmail.com';
        const mailtoLink = `mailto:${destinatario}?subject=${encodeURIComponent('Pedido - ' + nome)}&body=${encodeURIComponent(message)}`;

        // Limpa TODOS os carrinhos ANTES do mailto
        localStorage.removeItem(CartKeys.c34fes4fc);
        localStorage.removeItem(CartKeys.page02);
        localStorage.removeItem(CartKeys.master);

        // Abre cliente de e-mail
        window.location.href = mailtoLink;

        // Redireciona para página de produtos após 2 segundos
        setTimeout(() => {
            window.location.href = '../../index.html#products'; // ou index.html
        }, 2000);
    }

    // Inicializa
    renderMasterCart();
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleSendOrder);
    }
});
