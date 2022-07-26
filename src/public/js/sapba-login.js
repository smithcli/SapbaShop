import { apiFetch } from './modules/apiFetch';
import { showAlert } from './modules/alerts';

const login = async (email, password) => {
  try {
    const res = await apiFetch('/users/login', 'POST', { email, password });
    if (res.status === 'success') {
      location.assign('/dashboard');
    }
  } catch (err) {
    showAlert('fail', err.message);
  }
};

document.querySelector('.form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
