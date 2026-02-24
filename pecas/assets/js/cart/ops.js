
(function (w) {
  const { normalizeSku } = w.CartSku;
  const { getBaseMetaForSku } = w.CartCatalog;
  const { getCart, setCart } = w.CartStore;
  const { renderCart } = w.CartRender;
  const { announce } = w.CartA11y;

  function getMetaForSku(sku) {
    const cart = getCart();
    if (cart[sku]) return cart[sku];
    return getBaseMetaForSku(sku);
  }

  function addToCart(idOrSku, qty = 1, metaOverride) {
    const sku = normalizeSku(idOrSku);
    const cart = getCart();

    const override = metaOverride || {};
    const base = getMetaForSku(sku);

    const name = override.name ?? base.name ?? `Item ${sku}`;
    const img  = override.img  ?? base.img  ?? '';
    const desc = override.desc ?? base.desc ?? '';

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
    renderCart({ setItemQty, removeFromCart });
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
        img: meta.img || '',
        desc: meta.desc || '',
      };
    }

    setCart(cart);
    renderCart({ setItemQty, removeFromCart });
  }

  function removeFromCart(idOrSku) {
    const sku = normalizeSku(idOrSku);
    const cart = getCart();

    delete cart[sku];
    setCart(cart);
    renderCart({ setItemQty, removeFromCart });
  }

  w.CartOps = { addToCart, setItemQty, removeFromCart };
})(window);
