
/*====================================================================================== */
/*==============  ESCRIPT DESATIVADO /   ESCRIPT DESATIVADO  ============== */
/*====================================================================================== */

/*====================================================================================== */
/*==============  ESCRIPT DESATIVADO /   ESCRIPT DESATIVADO  ============== */
/*====================================================================================== */

/*====================================================================================== */
/*==============  ESCRIPT DESATIVADO /   ESCRIPT DESATIVADO  ============== */
/*====================================================================================== */



/*====================================================================================== */
/*==============  Inicio function para adicionar produtos no carrinho lateral  ============== */
/*====================================================================================== */

// js/page01.js
document.addEventListener('DOMContentLoaded', () => {
    const { CartKeys, loadCart, saveCart, afterPageCartChange } = window.CartUtils;

    // const purchaseButton = document.getElementById('purchaseButton');
    const cartBody = document.querySelector('.cart-table tbody');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalInfo = document.getElementById('modal-info');
    const closeBtn = document.querySelector('.close-btn');

    // Carrega carrinho persistido da Página 01
    // const CURRENT_PAGE_KEY = CartKeys.page01;
    const CURRENT_PAGE_KEY = CartKeys.c34fes4fc;
    let cart = loadCart(CURRENT_PAGE_KEY);
    

    // Lista de produtos da Página 01 (mantenha/complete conforme sua página)
    
    const products = {
        1: { name: 'JOGO DE VEDACOES - 4FC/4FES', image: 'images/1 - Gasket set.png', description: 'Peça de vedação para compressores.' },
        4: { name: 'CHAVETA ROTOR - A10 X 6 X 56 C3/CE3', image: 'images/4 - Parallel key.png', description: 'Chave paralela para fixação segura.' },
        5: { name: 'ARRUELA FX CV ROTOR - 45 X 12,5 X 3,5 C2/C3/CE2/CE3', image: 'images/5 - Washer.png', description: 'Arruela para suporte mecânico.' },
        9: { name: 'ARRUELA LISA - A10 X 16 X 2 DIN7603 C2/3/4 CE2/3/4', image: 'images/9 - Gasket ring.png', description: 'Descrição do item.' },
        11: { name: 'BUCHA MANCAL - 40 X 36 X 30 2EL..2CL/C2/C3/CE2/CE3', image: 'images/11 - Bearing bush.png', description: 'Descrição do item.' },
        13: { name: 'CJ DISCO DINÂMICO DE ÓLEO - C3/CE3', image: 'images/13 - Oil splasher plate.png', description: 'Descrição do item.' },
        16: { name: 'CJ BIELA-PISTÃO - 041 4FC/4FES', image: 'images/16-1 - Connecting rod - piston.png', description: 'Descrição do item.' },
        23: { name: 'CJ VIRABREQUIM - 4FC-3.2..4DC-5.2/4FES-3..4DES-5', image: 'images/23 - Eccentric shaft.png', description: 'Descrição do item.' },
        24: { name: 'ANEL DE ENCOSTO DU - 46 X 37,5 X 3 C2/C3 CE2/CE3', image: 'images/24 - Thrust washer.png', description: 'Descrição do item.' },
        25: { name: 'BUCHA MANCAL - 40 X 36 X 30 2EL..2CL/C2/C3/CE2/CE3', image: 'images/25 - Bearing bush.png', description: 'Descrição do item.' },
        26: { name: 'ARRUELA LISA VIRABREQUIM - 45 X 33 X 2 C2/C3 CE2/CE3', image: 'images/26 - Adjusting washer.png', description: 'Descrição do item.' },
        27: { name: 'CJ VÁLVULA DE SERVIÇO DESCARGA - 5/8" C2/3 CE2/3', image: 'images/27 - Shut-off valve.png', description: 'Descrição do item.' },
        30: { name: 'CJ CABEÇOTE AR - CE2/CE3', image: 'images/30 - Cylinder head.png', description: 'Descrição do item.' },
        33: { name: 'PLACA DE VÁLVULAS COM VEDACOES - 041 4FC/4FES', image: 'images/33 - Valve plate.png', description: 'Descrição do item.' },
        34: { name: 'VEDAÇÕES PLACA DE VÁLVULA - 041 4FC/4FES', image: 'images/33 - Valve plate.png', description: 'Descrição do item.' },
        36: { name: 'CJ VÁLVULA DE SERVIÇO SUCÇÃO ROSCA - 7/8" C3', image: 'images/36 - Shut-off valve.png', description: 'Descrição do item.' },
        39: { name: 'FILTRO DE SUCÇÃO - C3/CE3', image: 'images/39 - Suction gas filter.png', description: 'Descrição do item.' },
        41: { name: 'CJ FLANGE ELÉTRICA - CE3', image: 'images/40.1 - Terminal plate.png', description: 'Descrição do item.' },
        42: { name: 'CJ FLANGE ELÉTRICA - C1/C2 (C3 ANTIGO) CE1/CE2', image: 'images/40.1 - Terminal plate.png', description: 'Descrição do item.' },
        47: { name: 'ANEL DE TEFLON - 31,9 X 1,6 X 1,8 C1/2/3 CE1/2/3', image: 'images/47 - Gasket ring.png', description: 'Descrição do item.' },
        48: { name: 'CJ VISOR DE ÓLEO - C1/2/3 CE1/2/3', image: 'images/48 - Sight glass.png', description: 'Descrição do item.' },
        51: { name: 'Terminal box', image: 'images/50 - Terminal box.png', description: 'Descrição do item.' },
        51: { name: 'CJ CAIXA ELÉTRICA - CE3', image: 'images/50 - Terminal box.png', description: 'Descrição do item.' },
        52: { name: 'CJ CAIXA ELÉTRICA - C1/C2 (C3 ANTIGO) CE1/CE2', image: 'images/50.1 - Compressor protection device.png', description: 'Descrição do item.' },
        53: { name: 'UNIDADE DE CONTROLE - SE-B3 115/230V 50/60Hz', image: 'images/50 - Terminal box.png', description: 'Descrição do item.' },
        55: { name: 'CJ TAMPA MOTOR - PEQ C2/C3 CE2/CE3', image: 'images/50 - Terminal box.png', description: 'Descrição do item.' },
        57: { name: 'CJ RESISTÊNCIA DE CÁRTER - 0..120W-PTC/200..260V C2/3 CE2/3', image: 'images/55 - Housing cover.png', description: 'Descrição do item.' },
        59: { name: 'CJ COXIM PRETO - C2/C3 CE2/CE3', image: 'images/59 - Kit damper elements.png', description: 'Descrição do item.' },
        60: { name: 'SUPORTE LEVANTAMENTO - C1/2/3 CE1/2/3', image: 'images/59 - Kit damper elements.png', description: 'Descrição do item.' },
        75: { name: 'CJ TAMPA MANCAL - C3/CE3', image: 'images/75 - Retrofit kit oil control.png', description: 'Descrição do item.' },
        76: { name: 'CJ BUJÃO C/ARRUELA VEDAÇÃO - M20 X 1,5 C3/CE3 C4/CE4', image: 'images/76 - Sealing screw.png', description: 'Descrição do item.' },
        80: { name: 'CJ MONITORADOR NÍVEL ÓLEO - OLC-K1 220V 50/60Hz', image: 'images/80.1 - Opto-electronic unit.png', description: 'Descrição do item.' },
        91: { name: 'BUJÃO - 1/8"NPTF', image: 'images/91 - Plug.png', description: 'Descrição do item.' },
        92: { name: 'BUJÃO - 1/4"NPTF', image: 'images/92 - Schrader valve.png', description: 'Descrição do item.' },
        130: { name: 'Cylinder liner - left', image: 'images/130- Cylinder liner - left.png', description: 'Descrição do item.' },
        140: { name: 'Cylinder liner - right', image: 'images/140 - Cylinder liner - right.png', description: 'Descrição do item.' }
    };


  function renderCart() {
    cartBody.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>Item ${item.id}, ${item.name}</td>
        <td>
          <div class="quantity-controls">
            <button class="decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
        </td>
        <td>
          ${item.image}
        </td>
      `;
      cartBody.appendChild(row);
    });

    // Persistir e sincronizar master
    saveCart(CURRENT_PAGE_KEY, cart);
    afterPageCartChange();
  }

  function addToCart(id) {
    const prod = products[id];
    if (!prod) return; // segurança caso id não exista
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name: prod.name, image: prod.image, quantity: 1 });
    }
    renderCart();
  }

  // Botões de "Adicionar" nas listagens
  document.querySelectorAll('.add-product').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = parseInt(link.dataset.id, 10);
      addToCart(id);
    });
  });

  // Controles de quantidade no carrinho
  cartBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase')) {
      const id = parseInt(e.target.dataset.id, 10);
      const item = cart.find(i => i.id === id);
      if (item) {
        item.quantity++;
        renderCart();
      }
    }
    if (e.target.classList.contains('decrease')) {
      const id = parseInt(e.target.dataset.id, 10);
      const item = cart.find(i => i.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart = cart.filter(i => i.id !== id);
        }
        renderCart();
      }
    }
  });

  // Modal de imagem
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-img')) {
      const id = parseInt(e.target.dataset.id, 10);
      const product = products[id];
      if (!product) return;
      modalImg.src = product.image;
      modalInfo.textContent = `${product.name} | ${product.description} | 4FES-3/4FES-5/4FC-3.2/4FC-5.2`;
      modal.style.display = 'flex';
    }
  });

  // Fechar modal
  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Render inicial a partir do localStorage
  renderCart();

  // Recarrega carrinho da página e re-renderiza(para todas as paginas de produtos)
  window.addEventListener('cartUpdated', () => {
    cart = CartUtils.loadCart(CURRENT_PAGE_KEY);
    renderCart();
  });
});
/*=== Final function para adicionar produtos no carrinho lateral ==== */


/*=== Inicio function Modal do carrinho master ==== */
const cartBtn = document.getElementById('cart-btn');
const masterModal = document.getElementById('master-modal');
const masterModalBody = document.getElementById('master-modal-body');
const closeMasterModalBtn = masterModal.querySelector('.close-btn');

cartBtn.addEventListener('click', () => {
  renderMasterModal();
  masterModal.style.display = 'flex';
});

function renderMasterModal() {
  const master = CartUtils.loadCart(CartUtils.CartKeys.master);
  masterModalBody.innerHTML = '';
  if (master.length === 0) {
    masterModalBody.innerHTML = '<p>Carrinho master está vazio.</p>';
    return;
  }
  master.forEach(item => {
    const div = document.createElement('div');
    div.className = 'master-item';
    div.innerHTML = `
      <p>${item.name} (${item.page})</p>
      ${item.image}
      <div class="quantity-controls">
        <button class="decrease" data-id="${item.id}" data-page="${item.page}">-</button>
        <span>${item.quantity}</span>
        <button class="increase" data-id="${item.id}" data-page="${item.page}">+</button>
      </div>
    `;
    masterModalBody.appendChild(div);
  });
}

// Eventos para aumentar/diminuir quantidade
masterModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('increase') || e.target.classList.contains('decrease')) {
    const id = parseInt(e.target.dataset.id);
    const page = e.target.dataset.page;
    const master = CartUtils.loadCart(CartUtils.CartKeys.master);
    const item = master.find(i => i.id === id && i.page === page);
    if (!item) return;
    const newQty = e.target.classList.contains('increase') ? item.quantity + 1 : item.quantity - 1;
    CartUtils.applyChangeFromMaster(id, page, newQty);
    renderMasterModal();

    // Dispara evento para atualizar carrinhos nas páginas
    window.dispatchEvent(new Event('cartUpdated'));
  }
});

// Fechar modal
closeMasterModalBtn.addEventListener('click', () => {
  masterModal.style.display = 'none';
  
});

masterModal.addEventListener('click', (e) => {
  if (e.target === masterModal) masterModal.style.display = 'none';
});
/*=== Final function Modal do carrinho master ==== */



