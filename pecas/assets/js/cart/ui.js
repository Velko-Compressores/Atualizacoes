
(function (w) {
  const { SELECTORS } = w.CartConfig;

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
  }

  function openCart()  { toggleCartVisibility(true); }
  function closeCart() { toggleCartVisibility(false); }

  function bindCartButton() {
    const cartBtn = document.querySelector(SELECTORS.cartBtn);
    if (!cartBtn) return;
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCartVisibility();
    });
  }

  w.CartUI = { openCart, closeCart, bindCartButton, toggleCartVisibility };
})(window);
