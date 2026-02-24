
(function (w) {
  const { SELECTORS } = w.CartConfig;
  const { getBaseMetaForSku } = w.CartCatalog;

  function bindAddButtons(root, addToCart) {
    (root || document).querySelectorAll(SELECTORS.addButton).forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        const localId = btn.getAttribute('data-id');
        if (!localId) return;

        const metaOverride = {
          name: btn.getAttribute('data-name') || undefined,
          img:  btn.getAttribute('data-img')  || undefined,
          desc: btn.getAttribute('data-desc') || undefined,
        };

        addToCart(localId, 1, metaOverride);
        btn.classList.add('adding');
        setTimeout(() => btn.classList.remove('adding'), 250);
      });
    });
  }

  function bindImageClicks(createModal) {
    document.addEventListener('click', (e) => {
      const img = e.target && e.target.closest && e.target.closest('.cart-table td img');
      if (!img || !img.getAttribute) return;

      const sku = img.getAttribute('data-sku');
      if (!sku) return;

      const item = w.CartStore.getCart()[sku] || getBaseMetaForSku(sku);
      if (!item || !item.img) return;

      createModal(item);
    });
  }

  function bindContinueButton() {
    const btn = document.querySelector(SELECTORS.continueBtn);
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.location.href = '../pecas.html';
    });
  }

  w.CartBindings = { bindAddButtons, bindImageClicks, bindContinueButton };
})(window);
