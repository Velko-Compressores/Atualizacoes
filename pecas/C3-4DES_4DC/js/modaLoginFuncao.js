

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Tabs
document.getElementById('tab-login').addEventListener('click', () => {
  document.getElementById('tab-login').classList.add('active');
  document.getElementById('tab-register').classList.remove('active');
  document.getElementById('form-login').style.display = 'block';
  document.getElementById('form-register').style.display = 'none';
});

document.getElementById('tab-register').addEventListener('click', () => {
  document.getElementById('tab-register').classList.add('active');
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('form-register').style.display = 'block';
  document.getElementById('form-login').style.display = 'none';
});

// Fechar
document.querySelector('.auth-close').addEventListener('click', closeAuthModal);
document.querySelector('#auth-modal .auth-overlay').addEventListener('click', closeAuthModal);

// 🔥 Apenas exibe alert por enquanto — login real será implementado depois
document.getElementById('form-login').addEventListener('submit', e => {
  e.preventDefault();
  alert('Login efetuado (placeholder)');
  closeAuthModal();
});
document.getElementById('form-register').addEventListener('submit', e => {
  e.preventDefault();
  alert('Conta criada (placeholder)');
  closeAuthModal();
});

