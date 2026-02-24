
(function (w) {
  const { SELECTORS, STORAGE_KEY } = w.CartConfig;
  const { renderCart } = w.CartRender;
  const { updateCartBadge } = w.CartBadge;
  const { addToCart, setItemQty, removeFromCart } = w.CartOps;
  const { openCart, closeCart, bindCartButton } = w.CartUI;
  const { bindAddButtons, bindImageClicks, bindContinueButton } = w.CartBindings;

  function createModal(item) {
    const old = document.getElementById('product-modal');
    if (old) old.remove();
    const previousActive = document.activeElement;

    const overlay = document.createElement('div');
    overlay.id = 'product-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const titleId = `product-modal-title-${encodeURIComponent(item.sku)}`;
    const descId  = `product-modal-desc-${encodeURIComponent(item.sku)}`;
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
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeModal(); });
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', onEsc);
      }
    });

    const focusable = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const els = Array.from(dialog.querySelectorAll(focusable));
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function syncUI() {
    renderCart({ setItemQty, removeFromCart });
    updateCartBadge();
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncUI();
    window.addEventListener('pageshow', () => syncUI());

    const panel = document.querySelector(SELECTORS.cartPanel);
    if (panel) {
      if (!panel.id) panel.id = 'cart-panel';
      panel.style.display = 'block';
    }

    bindCartButton();

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

    const purchaseBtn = document.querySelector(SELECTORS.purchaseBtn);
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.openAuthModal === 'function') {
          window.openAuthModal();
        } else {
          console.warn('openAuthModal() não está definido.');
        }
      });
    }

    bindAddButtons(document, addToCart);
    bindImageClicks(createModal);
    bindContinueButton();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) syncUI();
    });
    document.addEventListener('cart:changed', () => syncUI());
  });
})(window);
