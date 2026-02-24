
(function (w) {
  const { makeSku } = w.CartSku;

  function getPageCatalog() {
    const local = w.PRODUCT_CATALOG || {};
    return Object.fromEntries(
      Object.entries(local).map(([id, p]) => [
        makeSku(id),
        { ...p, id: String(id), sku: makeSku(id) }
      ])
    );
  }

  function getBaseMetaForSku(sku) {
    const catalog = getPageCatalog();
    if (catalog[sku]) {
      const { name, img, desc } = catalog[sku];
      return { sku, name, img, desc };
    }
    return { sku, name: `Item ${sku}`, img: '', desc: '' };
  }

  w.CartCatalog = { getPageCatalog, getBaseMetaForSku };
})(window);
