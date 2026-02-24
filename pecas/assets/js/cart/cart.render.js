
(function (w) {
  const { SELECTORS } = w.CartConfig;
  const { getCart } = w.CartStore;
  const { updateCartBadge } = w.CartBadge;

  function renderCart(callbacks) {
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
      tdItem.textContent = it.name || `Item ${sku}`;
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
      btnMinus.addEventListener('click', () => callbacks.setItemQty(sku, it.qty - 1));

      const inputQty = document.createElement('input');
      inputQty.type = 'number';
      inputQty.min = '1';
      inputQty.value = it.qty;
      inputQty.style.width = '64px';
      inputQty.inputMode = 'numeric';
      inputQty.setAttribute('aria-label', `Quantidade de ${it.name}`);
      inputQty.addEventListener('change', () => {
        const val = parseInt(inputQty.value, 10);
        if (Number.isNaN(val) || val <= 0) callbacks.removeFromCart(sku);
        else callbacks.setItemQty(sku, val);
      });

      const btnPlus = document.createElement('button');
      btnPlus.type = 'button';
      btnPlus.textContent = '+';
      btnPlus.title = 'Aumentar';
      btnPlus.setAttribute('aria-label', `Aumentar ${it.name}`);
      btnPlus.addEventListener('click', () => callbacks.setItemQty(sku, it.qty + 1));

      const btnRemove = document.createElement('button');
      btnRemove.type = 'button';
      btnRemove.textContent = 'Remover';
      btnRemove.title = `Remover ${it.name}`;
      btnRemove.setAttribute('aria-label', `Remover ${it.name}`);
      btnRemove.style.marginLeft = '8px';
      btnRemove.addEventListener('click', () => callbacks.removeFromCart(sku));

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

  w.CartRender = { renderCart };
})(window);
