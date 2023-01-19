import { login, forgotPassword } from './modules/auth';

const loginForm = document.querySelector('.form-login');
const forgotPass = document.querySelector('.forgotPassword-form');
const adminLogin = document.getElementById('admin-login');
const managerLogin = document.getElementById('manager-login');
const employeeLogin = document.getElementById('employee-login');

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

if (adminLogin) {
  adminLogin.addEventListener('click', (e) => {
    e.preventDefault();
    login('admin@sapbashop.com', 'pass1234');
  });
}
if (managerLogin) {
  managerLogin.addEventListener('click', (e) => {
    e.preventDefault();
    login('manager@sapbashop.com', 'pass1234');
  });
}
if (employeeLogin) {
  employeeLogin.addEventListener('click', (e) => {
    e.preventDefault();
    login('employee@sapbashop.com', 'pass1234');
  });
}
