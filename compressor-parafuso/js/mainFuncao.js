
(function () {
  // ======= Configuração / Dados de exemplo =======
  // Troque pelos seus produtos reais. As imagens podem ser relativas ao seu projeto.
  const PRODUCTS = [
    { id: 'c1', name: 'Compressor Sanden SD7',             price: 899.90,  image: '../images/product-1.jpg', rating: 4.7 },
    // { id: 'c2', name: 'Compressor Denso 10PA',             price: 979.00,  image: 'assets/products/product-2.jpg', rating: 4.6 },
    // { id: 'c3', name: 'Compressor Delphi CVC',             price: 849.00,  image: 'assets/products/product-3.jpg', rating: 4.4 },
    // { id: 'c4', name: 'Compressor Delphi V5',              price: 799.90,  image: 'assets/products/product-4.jpg', rating: 4.3 },
    // { id: 'c5', name: 'Compressor Denso 7SBH',             price: 1059.00, image: 'assets/products/product-5.jpg', rating: 4.8 },
    // { id: 'c6', name: 'Compressor Valeo TM',               price: 1189.00, image: 'assets/products/product-6.jpg', rating: 4.5 },
    // { id: 'c7', name: 'Compressor Sanden PXE',             price: 949.00,  image: 'assets/products/product-7.jpg', rating: 4.2 },
    // { id: 'c8', name: 'Compressor Denso 6SEU (Reman.)',    price: 999.00,  image: 'assets/products/product-8.jpg', rating: 4.6 },
  ];

  // ======= Utils =======
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function starRating(r = 0) {
    const full = Math.round(r);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  // ======= Renderização =======
  function createProductCard(p) {
    const article = document.createElement('article');
    article.className = 'card';
    article.setAttribute('role', 'listitem');
    article.setAttribute('data-id', p.id);

    article.innerHTML = `
      <div class="card__media">
        ${p.image}
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <div class="card__meta">
          <span class="price">${formatBRL(p.price)}</span>
          <span class="rating" aria-label="Avaliação ${p.rating} de 5">${starRating(p.rating)}</span>
        </div>
      </div>
      <div class="card__actions">
        <button class="btn btn--primary" type="button">Adicionar</button>
      </div>
    `;

    // Clique em "Adicionar" emite um evento para integração com carrinho (opcional)
    const addBtn = article.querySelector('.btn--primary');
    addBtn.addEventListener('click', () => {
      const event = new CustomEvent('product:add', {
        bubbles: true,
        detail: { id: p.id, qty: 1, product: p }
      });
      article.dispatchEvent(event);
    });

    return article;
  }

  /**
   * Renderiza os produtos na grade.
   * @param {Array} list - Lista de produtos
   * @param {HTMLElement} mountEl - Elemento onde renderizar (default #productsGrid)
   */
  function renderProducts(list = PRODUCTS, mountEl = $('#productsGrid')) {
    if (!mountEl) return;

    mountEl.innerHTML = '';
    if (!list.length) {
      mountEl.innerHTML = `<p style="grid-column:1/-1; color:#94a3b8">Nenhum produto disponível.</p>`;
      return;
    }

    list.forEach(p => mountEl.appendChild(createProductCard(p)));
  }

  // ======= Inicialização =======
  document.addEventListener('DOMContentLoaded', () => {
    // Garante que o container existe antes de renderizar
    const grid = $('#productsGrid');
    if (!grid) return;

    renderProducts(PRODUCTS, grid);

    // Exemplo de como "escutar" o evento de adicionar produto (opcional):
    // Você pode mover este listener para outro arquivo onde está seu carrinho.
    grid.addEventListener('product:add', (e) => {
      const { product, qty } = e.detail;
      // Aqui você integra com seu carrinho (localStorage, estado global etc.)
      // Exemplo rápido (apenas demonstração):
      console.log('Adicionar ao carrinho:', product.name, 'x', qty);
      // alert(`${product.name} adicionado ao carrinho!`);
    });
  });

  // Exponha funções, se quiser controlar de fora (opcional)
  window.ProdutosPainel = {
    render: renderProducts,
    setData(newProducts) {
      if (Array.isArray(newProducts)) {
        // substitui produtos e re-renderiza
        renderProducts(newProducts);
      }
    }
  };
})();

