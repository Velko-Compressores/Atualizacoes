
// Funções globais para integração com outros scripts (ex.: botão "Finalizar Compra")
window.openAuthModal = function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  modal.classList.add('is-open');       // mostra o modal (CSS cuida do display)
  document.body.classList.add('modal-open'); // trava o scroll no body

  // Estado inicial: aba de login ativa
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('form-login');
  const registerForm = document.getElementById('form-register');

  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('is-active');
    registerForm.classList.remove('is-active');
  }

  // Opcional: foco inicial acessível
  try {
    const firstInput = loginForm?.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
    firstInput?.focus();
  } catch {}
};

window.closeAuthModal = function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  modal.classList.remove('is-open');        // esconde o modal
  document.body.classList.remove('modal-open'); // libera o scroll
};

document.addEventListener('DOMContentLoaded', () => {
  // Referências
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const closeBtn = document.querySelector('.auth-close');
  const overlay = document.querySelector('#auth-modal .auth-overlay');

  // Alternância de abas
  if (tabLogin && tabRegister && formLogin && formRegister) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.classList.add('is-active');
      formRegister.classList.remove('is-active');
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.classList.add('is-active');
      formLogin.classList.remove('is-active');
    });
  }

  // Fechar por botão X e overlay
  if (closeBtn) closeBtn.addEventListener('click', window.closeAuthModal);
  if (overlay) overlay.addEventListener('click', window.closeAuthModal);

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('auth-modal');
      if (modal && modal.classList.contains('is-open')) {
        window.closeAuthModal();
      }
    }
  });

  // Submissões (placeholders)
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login efetuado (placeholder)');
      window.closeAuthModal();
    });
  }
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Conta criada (placeholder)');
      window.closeAuthModal();
    });
  }
});
