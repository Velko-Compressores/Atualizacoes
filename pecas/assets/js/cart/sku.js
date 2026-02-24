
(function (w) {
  function getPagePrefix() {
    const explicit = w.PAGE_PREFIX || '';
    const fromAttr = (document.documentElement.dataset && document.documentElement.dataset.pagePrefix) || '';
    return (explicit || fromAttr || 'GLOBAL').trim();
  }
  function makeSku(localId) {
    return `${getPagePrefix()}:${String(localId)}`;
  }
  function normalizeSku(idOrSku) {
    const s = String(idOrSku);
    return s.includes(':') ? s : makeSku(s);
  }
  w.CartSku = { getPagePrefix, makeSku, normalizeSku };
})(window);
