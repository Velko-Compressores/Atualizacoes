
(() => {
  'use strict';

  // ======================
  // Configurações básicas
  // ======================
  const STORAGE_KEY = 'compressor_cart_v3';
  const SELECTORS = {
    addButton: '.add-product[data-id]',
    tableBody: '.cart-table tbody',
    cartPanel: '.content',
    cartBtn: '#cart-btn',
    purchaseBtn: '#purchaseButton',
  };

  // ======================
  // Utilitários
  // ======================
  function getPagePrefix() {
    const viaWindow = (typeof window !== 'undefined' && window.PAGE_PREFIX) ? String(window.PAGE_PREFIX) : '';
    const viaDataset = (document.documentElement.dataset && document.documentElement.dataset.pagePrefix) ? String(document.documentElement.dataset.pagePrefix) : '';
    const val = (viaWindow || viaDataset || 'GLOBAL').trim();
    return val || 'GLOBAL';
  }

  function makeSku(localId) {
    return `${getPagePrefix()}:${String(localId)}`;
  }

  function normalizeSku(idOrSku) {
    const s = String(idOrSku);
    return s.includes(':') ? s : makeSku(s);
  }

  // Gera URL absoluta com base no baseURI da página onde o item é adicionado
  function toAbsoluteUrl(path) {
    try {
      if (!path) return '';
      return new URL(path, document.baseURI).href;
    } catch (e) {
      return path || '';
    }
  }

  function normalizeMetaImage(img) {
    return img ? toAbsoluteUrl(img) : '';
  }

  // ======================
  // Catálogo local por página (opcional)
  // ======================
  const PAGE_CATALOG = (() => {
    const local = (typeof window !== 'undefined' && window.PRODUCT_CATALOG) ? window.PRODUCT_CATALOG : {};
    const entries = Object.entries(local || {});
    const mapped = entries.map(([id, p]) => {
      const img = p && p.img ? normalizeMetaImage(p.img) : '';
      const sku = makeSku(id);
      return [sku, { ...p, id: String(id), sku, img }];
    });
    return Object.fromEntries(mapped);
  })();

  // ======================
  // Persistência (localStorage)
  // ======================
  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch (e) {
      return {};
    }
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

  // ======================
  // Operações no carrinho
  // ======================
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
      // Atualiza metadados se override trouxer algo novo
      cart[sku].name = name;
      cart[sku].img = img;
      cart[sku].desc = desc;
    }

    cart[sku].qty += qty;
    if (cart[sku].qty <= 0) {
      delete cart[sku];
    }

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

  // ======================
  // Badge no botão do carrinho
  // ======================
  const getCartCount = () => Object.values(getCart()).reduce((s, it) => s + (Number(it.qty) || 0), 0);

  function updateCartBadge() {
    const btn = document.querySelector(SELECTORS.cartBtn);
    if (!btn) return;

    let badge = btn.querySelector('.cart-badge');
    const count = getCartCount();

    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.cssText = 'position:absolute;top:-6px;right:-6px;background:#e11d48;color:#fff;border-radius:999px;padding:0 6px;font-size:11px;line-height:18px;min-width:18px;text-align:center;';
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.appendChild(badge);
    }

    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  // ======================
  // Acessibilidade: região viva
  // ======================
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

  // ======================
  // Renderização da tabela do carrinho
  // ======================
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
      td.textContent = 'Seu carrinho está vazio.';
      td.style.opacity = '0.8';
      tr.appendChild(td);
      tbody.appendChild(tr);
      updateCartBadge();
      return;
    }

    skus.forEach((sku) => {
      const it = cart[sku];
      const tr = document.createElement('tr');

      const tdItem = document.createElement('td');
      tdItem.textContent = it.name || `Item {sku}`;
      tdItem.setAttribute('data-label', 'Item');

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
      btnMinus.setAttribute('aria-label', `Diminuir ${it.name}`);
      btnMinus.addEventListener('click', () => setItemQty(sku, it.qty - 1));

      const inputQty = document.createElement('input');
      inputQty.type = 'number';
      inputQty.min = '1';
      inputQty.value = it.qty;
      inputQty.style.width = '64px';
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
      btnRemove.textContent = 'Remover';
      btnRemove.title = `Remover ${it.name}`;
      btnRemove.setAttribute('aria-label', `Remover ${it.name}`);
      btnRemove.style.marginLeft = '8px';
      btnRemove.addEventListener('click', () => removeFromCart(sku));

      wrap.append(btnMinus, inputQty, btnPlus, btnRemove);
      tdQty.appendChild(wrap);

      const tdImg = document.createElement('td');
      tdImg.setAttribute('data-label', 'Imagem');
      if (it.img) {
        const img = document.createElement('img');
        img.src = it.img;
        img.alt = it.name ? `Imagem de ${it.name}` : `Imagem do item ${sku}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.maxWidth = '80px';
        img.style.maxHeight = '80px';
        img.style.objectFit = 'contain';
        img.style.cursor = 'zoom-in';
        img.setAttribute('data-sku', sku);
        tdImg.appendChild(img);
      } else {
        tdImg.textContent = '—';
        tdImg.style.textAlign = 'center';
        tdImg.style.opacity = '0.6';
      }

      tr.append(tdItem, tdQty, tdImg);
      tbody.appendChild(tr);
    });

    updateCartBadge();
  }

  // ======================
  // Modal para imagem + descrição
  // ======================
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
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:24px;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background:#fff;color:#111827;width:min(900px,96vw);max-height:92vh;border-radius:12px;box-shadow:0 20px 50px rgba(0,0,0,.25);display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;position:relative;';
    const style = document.createElement('style');
    style.textContent = '@media (max-width:800px){#product-modal > div {grid-template-columns:1fr;}}';

    const imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;';
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name || `Produto ${item.sku}`;
    img.style.cssText = 'max-width:100%;max-height:70vh;object-fit:contain;';

    const info = document.createElement('div');
    info.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    const h2 = document.createElement('h2');
    h2.id = titleId;
    h2.textContent = item.name || `Produto ${item.sku}`;
    h2.style.cssText = 'font-size:1.25rem;margin:8px 0;';
    const p = document.createElement('p');
    p.id = descId;
    p.textContent = item.desc || '';
    p.style.cssText = 'line-height:1.5;color:#374151;';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Fechar';
    closeBtn.setAttribute('aria-label', 'Fechar modal');
    closeBtn.style.cssText = 'position:absolute;top:10px;right:10px;cursor:pointer;border:none;background:#ef4444;color:#fff;border-radius:8px;padding:8px 12px;box-shadow:0 2px 6px rgba(0,0,0,.15);';

    imgWrap.appendChild(img);
    info.append(h2, p);
    dialog.append(closeBtn, imgWrap, info);
    overlay.append(style, dialog);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    closeBtn.focus();

    function closeModal() {
      overlay.remove();
      document.body.style.overflow = '';
      if (previousActive && previousActive.focus) previousActive.focus();
    }

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) closeModal();
    });
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
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Clique em imagem dentro da tabela => abre modal
  document.addEventListener('click', (e) => {
    const img = e.target && e.target.closest && e.target.closest('.cart-table td img');
    if (!img || !img.getAttribute) return;
    const sku = img.getAttribute('data-sku');
    if (!sku) return;
    const item = getMetaForSku(sku);
    createModal(item);
  });

  // ======================
  // Painel do carrinho (abrir/fechar)
  // ======================
  function toggleCartVisibility(forceState) {
    const panel = document.querySelector(SELECTORS.cartPanel);
    if (!panel) return;
    if (!panel.id) panel.id = 'cart-panel';

    const isHidden = panel.style.display === 'none' || getComputedStyle(panel).display === 'none';
    const shouldOpen = (typeof forceState === 'boolean') ? forceState : isHidden;
    panel.style.display = shouldOpen ? 'block' : 'none';

    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (cartBtn) {
      cartBtn.setAttribute('aria-controls', panel.id);
      cartBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
    // Renderiza sob demanda ao abrir
    if (shouldOpen) {
      renderCart();
    }
  }

  function openCart() { toggleCartVisibility(true); }
  function closeCart() { toggleCartVisibility(false); }

  // ======================
  // Bind de botões de "adicionar"
  // ======================
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

  // ======================
  // Sincronização e inicialização
  // ======================
  // Quando outra aba/página alterar o localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      renderCart();
      updateCartBadge();
    }
  });

  // Quando este próprio script altera o carrinho
  document.addEventListener('cart:changed', () => {
    renderCart();
  });

  function syncUI() {
    renderCart();
    updateCartBadge();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Render inicial (badge, etc.)
    syncUI();

    // Re-render ao retornar via bfcache (ex.: iOS Safari / voltar)
    window.addEventListener('pageshow', () => syncUI());

    // Cart panel
    const panel = document.querySelector(SELECTORS.cartPanel);
    if (panel) {
      if (!panel.id) panel.id = 'cart-panel';
      // Garante que inicia fechado
      panel.style.display = 'none';
    }

    // Botão do carrinho abre/fecha painel
    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCartVisibility();
      });
    }

    // Esc fecha painel, se visível
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const p = document.querySelector(SELECTORS.cartPanel);
        if (p && getComputedStyle(p).display !== 'none') {
          closeCart();
          const cb = document.querySelector(SELECTORS.cartBtn);
          if (cb) cb.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Botão de finalizar compra (placeholder)
    const purchaseBtn = document.querySelector(SELECTORS.purchaseBtn);
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', () => {
        alert('Ir para checkout…');
      });
    }

    // Ativa os botões/links de adicionar produto
    bindAddButtons(document);
  });

  // ======================
  // API global para debug/integração
  // ======================
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
    _internals: {
      toAbsoluteUrl,
      normalizeMetaImage,
      getPagePrefix,
      makeSku,
      normalizeSku,
      PAGE_CATALOG,
      STORAGE_KEY,
    }
  };
})();
