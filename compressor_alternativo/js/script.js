document.addEventListener('DOMContentLoaded', function () {
  const image = document.getElementById('tabela-img');
  const panzoom = Panzoom(image, {
      minScale: 0.1,
      maxScale: 1000,
      contain: 'false',
      canvas: true // permite arrastar livremente
  });
  image.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
});
function showInfo(part) {
  const info = {
    motor: "<strong>Motor Embutido</strong><br>Artigo: 1001<br>Peso: 12kg<br>Ano: 2020",
    valvula: "<strong>Placa de Válvula</strong><br>Artigo: 1002<br>Peso: 3kg<br>Ano: 2021"
  };
  document.getElementById('info-content').innerHTML = info[part] || "Informações não disponíveis.";
}
