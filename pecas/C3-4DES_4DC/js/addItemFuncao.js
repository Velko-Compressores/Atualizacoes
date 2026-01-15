(() => {
  const STORAGE_KEY = 'compressor_cart_v1';
  const SELECTORS = {
    addButton: '.add-product[data-id]',
    tableBody: '.cart-table tbody',
    cartPanel: '.content',
    cartBtn: '#cart-btn',
  };

  // Catálogo de produtos (exemplo). Adapte conforme necessário; pode adicionar 'desc'.
  const PRODUCT_CATALOG = {
    1:  { id: 1,  name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png',  desc: 'Conjunto de juntas para compressores C3-4CES-4CC.' },
    5:  { id: 5,  name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png',  desc: 'Conjunto de juntas para manutenção preventiva.' },
    9:  { id: 9,  name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png',  desc: 'Peça de reposição original.' },
    11: { id: 11, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Compatível com linha C4-4VES-6.' },
    13: { id: 13, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Alta durabilidade e vedação.' },
    24: { id: 24, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Recomendado para revisões programadas.' },
    30: { id: 30, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Item compatível com diversos modelos.' },
    33: { id: 33, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Aplicação em compressores C4-4PES-10.' },
    34: { id: 34, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Ótima vedação e performance.' },
    55: { id: 55, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Peça original de reposição.' },
    57: { id: 57, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Instalação simples e rápida.' },
    75: { id: 75, name: 'Item-Gasket set - C3-4DES-4DC', img: 'images/1 - Gasket set.png', desc: 'Confiabilidade comprovada.' },
    // ...adicione os demais
  };


  /* ----------------------------
   * Persistência
   * ---------------------------- */
  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function setCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartBadge();
  }

  /* ----------------------------
   * Operações do carrinho
   * ---------------------------- */
  function addToCart(productId, qty = 1) {
    const id = String(productId);
    if (!PRODUCT_CATALOG[id]) {
      console.warn(`Produto ${id} não encontrado no catálogo.`);
      return;
    }
    const cart = getCart();
    cart[id] = cart[id] || { id, qty: 0 };
    cart[id].qty += qty;
    if (cart[id].qty <= 0) delete cart[id];
    setCart(cart);
    renderCart();
    announce(`Item ${PRODUCT_CATALOG[id]?.name || id} adicionado ao carrinho`);
  }

  function setItemQty(productId, qty) {
    const id = String(productId);
    const cart = getCart();
    if (qty <= 0) {
      delete cart[id];
    } else {
      cart[id] = { id, qty };
    }
    setCart(cart);
    renderCart();
  }

  function removeFromCart(productId) {
    const id = String(productId);
    const cart = getCart();
    delete cart[id];
    setCart(cart);
    renderCart();
  }

  /* ----------------------------
   * Badge e contagem
   * ---------------------------- */
  function getCartCount() {
    const cart = getCart();
    return Object.values(cart).reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  }

  function updateCartBadge() {
    const btn = document.querySelector(SELECTORS.cartBtn);
    if (!btn) return;

    let badge = btn.querySelector('.cart-badge');
    const count = getCartCount();

    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.cssText = 'position:absolute;top:-6px;right:-6px;background:#e11d48;color:#fff;border-radius:999px;padding:0 6px;font-size:11px;line-height:18px;min-width:18px;text-align:center;';
      const styles = getComputedStyle(btn);
      if (styles.position === 'static') btn.style.position = 'relative';
      btn.appendChild(badge);
    }

    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  /* ----------------------------
   * Acessibilidade (live region)
   * ---------------------------- */
  function announce(message) {
    let live = document.getElementById('cart-live-region');
    if (!live) {
      live = document.createElement('div');
      live.id = 'cart-live-region';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.style.position = 'absolute';
      live.style.left = '-9999px';
      document.body.appendChild(live);
    }
    live.textContent = message;
  }

  /* ----------------------------
   * Renderização da tabela
   * ---------------------------- */
  function renderCart() {
    const tbody = document.querySelector(SELECTORS.tableBody);
    if (!tbody) return;

    const cart = getCart();
    const ids = Object.keys(cart);

    tbody.innerHTML = '';

    if (ids.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.textContent = 'Seu carrinho está vazio.';
      td.style.opacity = '0.8';
      tr.appendChild(td);
      tbody.appendChild(tr);
      updateCartBadge();
      return;
    }

    ids.forEach((id) => {
      const { qty } = cart[id];
      const meta = PRODUCT_CATALOG[id] || { name: `Item ${id}`, img: '' };

      const tr = document.createElement('tr');

      // Coluna: Item (nome)
      const tdItem = document.createElement('td');
      tdItem.textContent = meta.name || `Item ${id}`;
      tdItem.setAttribute('data-label', 'Item');

      // Coluna: Quantidade (controles)
      const tdQty = document.createElement('td');
      tdQty.setAttribute('data-label', 'Quantidade');
      const wrap = document.createElement('div');
      wrap.style.display = 'inline-flex';
      wrap.style.gap = '8px';
      wrap.style.alignItems = 'center';

      const btnMinus = document.createElement('button');
      btnMinus.type = 'button';
      btnMinus.textContent = '−';
      btnMinus.title = 'Diminuir';
      btnMinus.setAttribute('aria-label', `Diminuir ${meta.name}`);
      btnMinus.addEventListener('click', () => addToCart(id, -1));

      const inputQty = document.createElement('input');
      inputQty.type = 'number';
      inputQty.min = '1';
      inputQty.value = qty;
      inputQty.style.width = '64px';
      inputQty.inputMode = 'numeric';
      inputQty.setAttribute('aria-label', `Quantidade de ${meta.name}`);
      inputQty.addEventListener('change', () => {
        const val = parseInt(inputQty.value, 10);
        if (Number.isNaN(val) || val <= 0) {
          removeFromCart(id);
        } else {
          setItemQty(id, val);
        }
      });

      const btnPlus = document.createElement('button');
      btnPlus.type = 'button';
      btnPlus.textContent = '+';
      btnPlus.title = 'Aumentar';
      btnPlus.setAttribute('aria-label', `Aumentar ${meta.name}`);
      btnPlus.addEventListener('click', () => addToCart(id, +1));

      const btnRemove = document.createElement('button');
      btnRemove.type = 'button';
      btnRemove.textContent = 'Remover';
      btnRemove.title = `Remover ${meta.name}`;
      btnRemove.setAttribute('aria-label', `Remover ${meta.name}`);
      btnRemove.style.marginLeft = '8px';
      btnRemove.addEventListener('click', () => removeFromCart(id));

      wrap.appendChild(btnMinus);
      wrap.appendChild(inputQty);
      wrap.appendChild(btnPlus);
      wrap.appendChild(btnRemove);
      tdQty.appendChild(wrap);

      // Coluna: Imagem (clicável para modal)
      const tdImg = document.createElement('td');
      tdImg.setAttribute('data-label', 'Imagem');
      if (meta.img) {
        const img = document.createElement('img');
        img.src = meta.img;
        img.alt = meta.name ? `Imagem de ${meta.name}` : `Imagem do item ${id}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.maxWidth = '80px';
        img.style.maxHeight = '80px';
        img.style.objectFit = 'contain';
        img.style.cursor = 'zoom-in';
        img.setAttribute('data-id', id); // importante para o modal recuperar o produto
        tdImg.appendChild(img);
      } else {
        tdImg.textContent = '—';
        tdImg.style.textAlign = 'center';
        tdImg.style.opacity = '0.6';
      }

      tr.appendChild(tdItem);
      tr.appendChild(tdQty);
      tr.appendChild(tdImg);
      tbody.appendChild(tr);
    });

    updateCartBadge();
  }

  /* ----------------------------
   * Modal de imagem + descrição
   * ---------------------------- */
  function createModal(product) {
    // Remove instância anterior
    const old = document.getElementById('product-modal');
    if (old) old.remove();

    const previousActive = document.activeElement;

    const overlay = document.createElement('div');
    overlay.id = 'product-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const titleId = `product-modal-title-${product.id}`;
    const descId = `product-modal-desc-${product.id}`;
    overlay.setAttribute('aria-labelledby', titleId);
    overlay.setAttribute('aria-describedby', descId);

    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: #fff; color: #111827; width: min(900px, 96vw); max-height: 92vh;
      border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,.25);
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px; position: relative;
    `;

    // Mobile: ocupa uma coluna
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 800px) {
        #product-modal > div { grid-template-columns: 1fr; }
      }
    `;

    const imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;';

    const img = document.createElement('img');
    img.src = product.img;
    img.alt = product.name || `Produto ${product.id}`;
    img.style.cssText = 'max-width:100%;max-height:70vh;object-fit:contain;';

    const info = document.createElement('div');
    info.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

    const h2 = document.createElement('h2');
    h2.id = titleId;
    h2.textContent = product.name || `Produto ${product.id}`;
    h2.style.cssText = 'font-size:1.25rem;margin:8px 0;';

    const p = document.createElement('p');
    p.id = descId;
    p.textContent = product.desc || product.name || '';
    p.style.cssText = 'line-height:1.5;color:#374151;';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Fechar';
    closeBtn.setAttribute('aria-label', 'Fechar modal');

    closeBtn.style.cssText = `
      position:absolute;top:10px;right:10px;cursor:pointer;
      border: none; background:#ef4444; color:#fff; border-radius:8px; padding:8px 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,.15);
    `;

    // Montagem
    imgWrap.appendChild(img);
    info.appendChild(h2);
    info.appendChild(p);
    dialog.appendChild(closeBtn);
    dialog.appendChild(imgWrap);
    dialog.appendChild(info);
    overlay.appendChild(style);
    overlay.appendChild(dialog);

    function closeModal() {
      overlay.remove();
      document.body.style.overflow = '';
      if (previousActive && previousActive.focus) {
        previousActive.focus();
      }
    }

    // Fechar por clique fora
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) closeModal();
    });
    // Fechar por botão
    closeBtn.addEventListener('click', closeModal);
    // Fechar por ESC
    document.addEventListener('keydown', onEscOnce);
    function onEscOnce(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', onEscOnce);
      }
    }

    // Foco e rolagem
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    closeBtn.focus();

    // Trap de foco básico no modal
    const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = () => dialog.querySelectorAll(focusableSelectors);
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const els = Array.from(focusables());
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Delegação: clique nas imagens da tabela abre modal
  document.addEventListener('click', (e) => {
    const img = e.target && e.target.closest && e.target.closest('.cart-table td img');
    if (img && img.getAttribute) {
      const id = img.getAttribute('data-id');
      if (!id) return;
      const product = PRODUCT_CATALOG[id];
      if (product) {
        createModal(product);
      }
    }
  });

  /* ----------------------------
   * Abrir/fechar painel do carrinho
   * ---------------------------- */
  function toggleCartVisibility(forceState) {
    const panel = document.querySelector(SELECTORS.cartPanel);
    if (!panel) return;

    if (!panel.id) panel.id = 'cart-panel';

    const isHidden = panel.style.display === 'none' || getComputedStyle(panel).display === 'none';
    const shouldOpen = typeof forceState === 'boolean' ? forceState : isHidden;

    panel.style.display = shouldOpen ? 'block' : 'none';

    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (cartBtn) {
      cartBtn.setAttribute('aria-controls', panel.id);
      cartBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
  }
  function openCart() { toggleCartVisibility(true); }
  function closeCart() { toggleCartVisibility(false); }

  /* ----------------------------
   * Bind dos botões .add-product (inclusive no SVG)
   * ---------------------------- */
  function bindAddButtons(root = document) {
    const buttons = root.querySelectorAll(SELECTORS.addButton);
    buttons.forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const id = btn.getAttribute('data-id');
        if (!id) return;
        addToCart(id, 1);
        btn.classList.add('adding');
        setTimeout(() => btn.classList.remove('adding'), 250);
      });
    });
  }

  /* ----------------------------
   * Sincronização entre abas
   * ---------------------------- */
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      renderCart();
      updateCartBadge();
    }
  });

  /* ----------------------------
   * Inicialização
   * ---------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartBadge();

    const panel = document.querySelector(SELECTORS.cartPanel);
    if (panel) {
      if (!panel.id) panel.id = 'cart-panel';
      panel.style.display = 'block'; // painel ABERTO ao entrar na página
    }

    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (cartBtn) {
      cartBtn.setAttribute('aria-controls', panel?.id || 'cart-panel');
      cartBtn.setAttribute('aria-expanded', 'true');
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCartVisibility();
      });
    }

    // Fecha painel com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const panel = document.querySelector(SELECTORS.cartPanel);
        if (panel && getComputedStyle(panel).display !== 'none') {
          closeCart();
          const cartBtn = document.querySelector(SELECTORS.cartBtn);
          if (cartBtn) cartBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    bindAddButtons(document);
  });

  // API Global opcional
  window.CartAPI = {
    getCart,
    setCart,
    addToCart,
    setItemQty,
    removeFromCart,
    clearCart,
    renderCart,
    openCart,
    closeCart,
    getCartCount,
  };
})();
