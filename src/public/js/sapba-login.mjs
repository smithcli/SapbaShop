import { login, forgotPassword } from './modules/auth';

const loginForm = document.querySelector('.form-login');
const forgotPass = document.querySelector('.forgotPassword-form');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (forgotPass) {
  forgotPass.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}
