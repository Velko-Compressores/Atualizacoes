
(function (w) {
  const { SELECTORS, STORAGE_KEY } = w.CartConfig;
  const { getCart } = w.CartStore;

  function getCartCount() {
    return Object.values(getCart()).reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
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
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.appendChild(badge);
    }

    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  document.addEventListener('cart:changed', updateCartBadge);
  window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) updateCartBadge(); });

  w.CartBadge = { getCartCount, updateCartBadge };
})(window);
