
(function (w) {
  const { getCart, setCart, clearCart } = w.CartStore;
  const { addToCart, setItemQty, removeFromCart } = w.CartOps;
  const { openCart, closeCart } = w.CartUI;
  const { renderCart } = w.CartRender;
  const { getCartCount } = w.CartBadge;

  w.CartAPI = {
    getCart,
    setCart,
    addToCart,
    setItemQty,
    removeFromCart,
    clearCart,
    renderCart: () => renderCart({ setItemQty, removeFromCart }),
    openCart,
    closeCart,
    getCartCount,
  };
})(window);
