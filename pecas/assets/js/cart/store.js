
(function (w) {
  const { STORAGE_KEY } = w.CartConfig;

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
    } catch {
      return {};
    }
  }

  function setCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: { cart } }));
  }

  function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    document.dispatchEvent(new CustomEvent('cart:changed', { detail: { cart: {} } }));
  }

  w.CartStore = { getCart, setCart, clearCart };
})(window);
