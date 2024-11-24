const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const overlay = document.getElementById('modalOverlay');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const startGameBtn = document.getElementById('startGameBtn');
const userInfo = document.querySelector('.user-info');
const authButtons = document.querySelector('.auth-buttons');

function showModal(modal) {
  modal.classList.add('show');
  overlay.classList.add('show');
}

function hideModal(modal) {
  modal.classList.remove('show');
  overlay.classList.remove('show');
}

loginBtn.addEventListener('click', () => showModal(loginModal));
registerBtn.addEventListener('click', () => showModal(registerModal));
overlay.addEventListener('click', () => {
  hideModal(loginModal);
  hideModal(registerModal);
});

document.getElementById('loginSubmitBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      userInfo.style.display = 'block';
      authButtons.style.display = 'none';
      document.getElementById('username').textContent = data.nickname;
      hideModal(loginModal);
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    alert('Error logging in');
  }
});

document.getElementById('registerSubmitBtn').addEventListener('click', async () => {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const nickname = document.getElementById('registerNickname').value;
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname }),
    });
    const data = await response.json();
    if (response.ok) {
      userInfo.style.display = 'block';
      authButtons.style.display = 'none';
      document.getElementById('username').textContent = nickname;
      hideModal(registerModal);
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    alert('Error registering');
  }
});

startGameBtn.addEventListener('click', () => {
  if (authButtons.style.display !== 'none') {
    alert('Please log in to start the game.');
  } else {
    alert('Starting game...');
  }
});