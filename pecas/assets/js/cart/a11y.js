
(function (w) {
  function announce(message) {
    let live = document.getElementById('cart-live-region');
    if (!live) {
      live = document.createElement('div');
      live.id = 'cart-live-region';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.style.position = 'absolute';
      live.style.left = '-9999px';
      document.body.appendChild(live);
    }
    live.textContent = message;
  }
  w.CartA11y = { announce };
})(window);
