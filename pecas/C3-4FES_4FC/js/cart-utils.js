
// js/cart-utils.js
(function (window) {
  const CartKeys = {
    page01: 'cart_c34fes4fc',
    page02: 'cart_page02',
    master: 'cart_master',
  };

  function safeParse(json, fallback) {
    try { return JSON.parse(json) || fallback; } catch { return fallback; }
  }

  function loadCart(key) {
    return safeParse(localStorage.getItem(key), []);
  }

  function saveCart(key, cart) {
    localStorage.setItem(key, JSON.stringify(cart));
  }

  /**
   * Recalcula o carrinho master a partir dos dois carrinhos.
   * Mantém a origem do item com a propriedade `page` para sincronizar de volta.
   */
  function recomputeMaster() {
    const c1 = loadCart(CartKeys.c34fes4fc);
    const c2 = loadCart(CartKeys.page02);

    const master = [
      ...c1.map(i => ({ ...i, page: 'c34fes4fc' })),
      ...c2.map(i => ({ ...i, page: 'page02' })),
    ];

    saveCart(CartKeys.master, master);
    return master;
  }

  /**
   * Aplica uma alteração iniciada no carrinho master ao carrinho da página de origem.
   * newQty <= 0 remove o item do carrinho de origem.
   */
  function applyChangeFromMaster(id, page, newQty) {
    const key = page === 'c34fes4fc' ? CartKeys.c34fes4fc : CartKeys.page02;
    let cart = loadCart(key);
    const idx = cart.findIndex(i => i.id === id);

    if (idx > -1) {
      if (newQty <= 0) {
        cart.splice(idx, 1);
      } else {
        cart[idx].quantity = newQty;
      }
    } else {
      // Em geral não haverá item faltante, mas caso exista, ignore ou adicione se você preferir.
      // Para adicionar, seria necessário ter {name, image} no master — aqui recomputamos apenas de fontes.
    }

    saveCart(key, cart);
    recomputeMaster(); // mantém master sincronizado
  }

  /**
   * Helper: após qualquer alteração nos carrinhos de página, sempre chame este método
   * para manter o master atualizado.
   */
  function afterPageCartChange() {
    recomputeMaster();
  }

  window.CartUtils = {
    CartKeys,
    loadCart,
    saveCart,
    recomputeMaster,
    applyChangeFromMaster,
    afterPageCartChange,
  };
})(window);

