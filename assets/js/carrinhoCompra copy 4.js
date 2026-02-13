(() => {
  'use strict';

  const STORAGE_KEY = 'compressor_cart_v3';
  const SELECTORS = {
    addButton: '.add-product[data-id]',
    tableBody: '.cart-table tbody',
    cartPanel: '.content',
    cartBtn: '#cart-btn',
    purchaseBtn: '#purchaseButton',
    continueBtn: '#continueShoppingButton',
  };

  // Utilitários
  function getPagePrefix() {
    const viaWindow = (typeof window !== 'undefined' && window.PAGE_PREFIX) ? String(window.PAGE_PREFIX) : '';
    const viaDataset = (document.documentElement.dataset && document.documentElement.dataset.pagePrefix) ? String(document.documentElement.dataset.pagePrefix) : '';
    const val = (viaWindow || viaDataset || 'GLOBAL').trim();
    return val || 'GLOBAL';
  }
  function makeSku(localId) { return `${getPagePrefix()}:${String(localId)}`; }
  function normalizeSku(idOrSku) { const s = String(idOrSku); return s.includes(':') ? s : makeSku(s); }
  function toAbsoluteUrl(path) { try { if (!path) return ''; return new URL(path, document.baseURI).href; } catch { return path || ''; } }
  function normalizeMetaImage(img) { return img ? toAbsoluteUrl(img) : ''; }

  // Catálogo local opcional
  const PAGE_CATALOG = (() => {
    const local = (typeof window !== 'undefined' && window.PRODUCT_CATALOG) ? window.PRODUCT_CATALOG : {};
    return Object.fromEntries(
      Object.entries(local || {}).map(([id, p]) => {
        const img = p && p.img ? normalizeMetaImage(p.img) : '';
        const sku = makeSku(id);
        return [sku, { ...p, id: String(id), sku, img }];
      })
    );
  })();

  // Persistência
  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch { return {}; }
  }
  function setCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: { cart } }));
    updateCartBadge();
  }
  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    updateCartBadge();
    renderCart();
  }
  function getMetaForSku(sku) {
    const cart = getCart();
    if (cart[sku]) return cart[sku];
    if (PAGE_CATALOG[sku]) {
      const { name, img, desc } = PAGE_CATALOG[sku];
      return { sku, name, img, desc };
    }
    return { sku, name: `Item ${sku}`, img: '', desc: '' };
  }

  // Operações
  function addToCart(idOrSku, qty = 1, metaOverride) {
    const sku = normalizeSku(idOrSku);
    const cart = getCart();

    const override = metaOverride || {};
    const base = PAGE_CATALOG[sku] || getMetaForSku(sku);
    const name = (override.name ?? base.name ?? `Item ${sku}`);
    const img = normalizeMetaImage(override.img ?? base.img ?? '');
    const desc = (override.desc ?? base.desc ?? '');

    if (!cart[sku]) {
      cart[sku] = { sku, qty: 0, name, img, desc };
    } else if (override && (override.name || override.img || override.desc)) {
      cart[sku].name = name;
      cart[sku].img = img;
      cart[sku].desc = desc;
    }

    cart[sku].qty += qty;
    if (cart[sku].qty <= 0) delete cart[sku];

    setCart(cart);
    renderCart();
    announce(`Item ${name} adicionado ao carrinho`);
  }

  function setItemQty(idOrSku, qty) {
    const sku = normalizeSku(idOrSku);
    const cart = getCart();

    if (qty <= 0) {
      delete cart[sku];
    } else {
      const meta = getMetaForSku(sku);
      cart[sku] = {
        sku,
        qty: Number(qty) || 1,
        name: meta.name || `Item ${sku}`,
        img: normalizeMetaImage(meta.img || ''),
        desc: meta.desc || ''
      };
    }

    setCart(cart);
    renderCart();
  }

  function removeFromCart(idOrSku) {
    const sku = normalizeSku(idOrSku);
    const cart = getCart();
    delete cart[sku];
    setCart(cart);
    renderCart();
  }

  // Badge
  const getCartCount = () => Object.values(getCart()).reduce((s, it) => s + (Number(it.qty) || 0), 0);

  function updateCartBadge() {
    const btn = document.querySelector(SELECTORS.cartBtn);
    if (!btn) return;

    let badge = btn.querySelector('.cart-badge');
    const count = getCartCount();

    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      btn.appendChild(badge);
    }

    badge.textContent = String(count);
    badge.classList.toggle('is-visible', count > 0);
  }

  // A11y live region
  function announce(message) {
    let live = document.getElementById('cart-live-region');
    if (!live) {
      live = document.createElement('div');
      live.id = 'cart-live-region';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      document.body.appendChild(live);
    }
    live.textContent = message;
  }

  // Render tabela (com ícone de lixeira no remover)
  function renderCart() {
    const tbody = document.querySelector(SELECTORS.tableBody);
    if (!tbody) { updateCartBadge(); return; }

    const cart = getCart();
    const skus = Object.keys(cart);
    tbody.innerHTML = '';

    if (!skus.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.classList.add('cart-empty');
      td.textContent = 'Seu carrinho está vazio.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      updateCartBadge();
      return;
    }

    skus.forEach((sku) => {
      const it = cart[sku];
      const tr = document.createElement('tr');

      // Item
      const tdItem = document.createElement('td');
      tdItem.textContent = it.name || `Item ${sku}`;
      tdItem.setAttribute('data-label', 'Item');

      // Quantidade
      const tdQty = document.createElement('td');
      tdQty.setAttribute('data-label', 'Quantidade');
      const wrap = document.createElement('div');
      wrap.className = 'qty-controls';

      const btnMinus = document.createElement('button');
      btnMinus.type = 'button';
      btnMinus.textContent = '−';
      btnMinus.title = 'Diminuir';
      btnMinus.setAttribute('aria-label', `Diminuir ${it.name}`);
      btnMinus.addEventListener('click', () => setItemQty(sku, it.qty - 1));

      const inputQty = document.createElement('input');
      inputQty.type = 'number';
      inputQty.min = '1';
      inputQty.value = it.qty;
      inputQty.inputMode = 'numeric';
      inputQty.setAttribute('aria-label', `Quantidade de ${it.name}`);
      inputQty.addEventListener('change', () => {
        const val = parseInt(inputQty.value, 10);
        if (Number.isNaN(val) || val <= 0) removeFromCart(sku); else setItemQty(sku, val);
      });

      const btnPlus = document.createElement('button');
      btnPlus.type = 'button';
      btnPlus.textContent = '+';
      btnPlus.title = 'Aumentar';
      btnPlus.setAttribute('aria-label', `Aumentar ${it.name}`);
      btnPlus.addEventListener('click', () => setItemQty(sku, it.qty + 1));

      const btnRemove = document.createElement('button');
      btnRemove.type = 'button';
      btnRemove.className = 'btn-remove btn-icon';
      btnRemove.title = `Remover ${it.name}`;
      btnRemove.setAttribute('aria-label', `Remover ${it.name}`);
      // Ícone de lixeira (Font Awesome já é usado no header)
      btnRemove.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';
      btnRemove.addEventListener('click', () => removeFromCart(sku));

      wrap.append(btnMinus, inputQty, btnPlus, btnRemove);
      tdQty.appendChild(wrap);

      // Imagem
      const tdImg = document.createElement('td');
      tdImg.setAttribute('data-label', 'Imagem');
      if (it.img) {
        const img = document.createElement('img');
        img.src = it.img;
        img.alt = it.name ? `Imagem de ${it.name}` : `Imagem do item ${sku}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.setAttribute('data-sku', sku);
        tdImg.appendChild(img);
      } else {
        tdImg.textContent = '—';
        tdImg.classList.add('no-image');
      }

      tr.append(tdItem, tdQty, tdImg);
      tbody.appendChild(tr);
    });

    updateCartBadge();
  }

  // Modal de Produto (ao clicar na imagem)
  function createModal(item) {
    const old = document.getElementById('product-modal');
    if (old) old.remove();
    const previousActive = document.activeElement;

    const overlay = document.createElement('div');
    overlay.id = 'product-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const titleId = `product-modal-title-${encodeURIComponent(item.sku)}`;
    const descId = `product-modal-desc-${encodeURIComponent(item.sku)}`;
    overlay.setAttribute('aria-labelledby', titleId);
    overlay.setAttribute('aria-describedby', descId);

    const dialog = document.createElement('div');
    dialog.className = 'product-modal__dialog';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'product-modal__img-wrap';
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name || `Produto ${item.sku}`;
    img.className = 'product-modal__img';

    const info = document.createElement('div');
    info.className = 'product-modal__info';
    const h2 = document.createElement('h2');
    h2.id = titleId;
    h2.textContent = item.name || `Produto ${item.sku}`;
    h2.className = 'product-modal__title';
    const p = document.createElement('p');
    p.id = descId;
    p.textContent = item.desc || '';
    p.className = 'product-modal__desc';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Fechar';
    closeBtn.setAttribute('aria-label', 'Fechar modal');
    closeBtn.className = 'product-modal__close';

    imgWrap.appendChild(img);
    info.append(h2, p);
    dialog.append(closeBtn, imgWrap, info);
    overlay.append(dialog);
    document.body.appendChild(overlay);
    closeBtn.focus();

    function closeModal() {
      overlay.remove();
      if (previousActive && previousActive.focus) previousActive.focus();
    }

    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeModal(); });
    closeBtn.addEventListener('click', closeModal);

    function onEsc(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', onEsc);
      }
    }
    document.addEventListener('keydown', onEsc);

    // Trap de foco
    const focusable = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const els = Array.from(dialog.querySelectorAll(focusable));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  // Abrir modal de produto ao clicar na imagem
  document.addEventListener('click', (e) => {
    const img = e.target && e.target.closest && e.target.closest('.cart-table td img');
    if (!img || !img.getAttribute) return;
    const sku = img.getAttribute('data-sku');
    if (!sku) return;
    const item = getMetaForSku(sku);
    createModal(item);
  });

  // Painel do carrinho — abrir/fechar (classe .is-open)
  function toggleCartVisibility(forceState) {
    const panel = document.querySelector(SELECTORS.cartPanel);
    if (!panel) return;
    if (!panel.id) panel.id = 'cart-panel';

    const isOpen = panel.classList.contains('is-open');
    const shouldOpen = (typeof forceState === 'boolean') ? forceState : !isOpen;
    panel.classList.toggle('is-open', shouldOpen);

    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (cartBtn) {
      cartBtn.setAttribute('aria-controls', panel.id);
      cartBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
    if (shouldOpen) renderCart();
  }
  function openCart() { toggleCartVisibility(true); }
  function closeCart() { toggleCartVisibility(false); }

  // Botões “adicionar”
  function bindAddButtons(root = document) {
    root.querySelectorAll(SELECTORS.addButton).forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const localId = btn.getAttribute('data-id');
        if (!localId) return;
        const metaOverride = {
          name: btn.getAttribute('data-name') || undefined,
          img: btn.getAttribute('data-img') || undefined,
          desc: btn.getAttribute('data-desc') || undefined,
        };
        addToCart(localId, 1, metaOverride);
        btn.classList.add('adding');
        setTimeout(() => btn.classList.remove('adding'), 250);
      });
    });
  }

  // Inicialização
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) { renderCart(); updateCartBadge(); }
  });
  document.addEventListener('cart:changed', () => renderCart());

  function syncUI() { renderCart(); updateCartBadge(); }

  document.addEventListener('DOMContentLoaded', () => {
    syncUI();
    window.addEventListener('pageshow', () => syncUI());

    const panel = document.querySelector(SELECTORS.cartPanel);
    if (panel && !panel.id) panel.id = 'cart-panel';

    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCartVisibility();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const p = document.querySelector(SELECTORS.cartPanel);
        if (p && p.classList.contains('is-open')) {
          closeCart();
          const cb = document.querySelector(SELECTORS.cartBtn);
          if (cb) cb.setAttribute('aria-expanded', 'false');
        }
      }
    });

    const purchaseBtn = document.querySelector(SELECTORS.purchaseBtn);
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.openAuthModal === 'function') window.openAuthModal();
      });
    }

    const continueBtn = document.querySelector(SELECTORS.continueBtn);
    if (continueBtn) {
      continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'pecas/index.html';
      });
    }

    bindAddButtons(document);
  });

  // API pública
  window.CartAPI = {
    getCart, setCart, addToCart, setItemQty, removeFromCart, clearCart,
    renderCart, openCart, closeCart, getCartCount,
    _internals: { toAbsoluteUrl, normalizeMetaImage, getPagePrefix, makeSku, normalizeSku, PAGE_CATALOG, STORAGE_KEY }
  };
})();


