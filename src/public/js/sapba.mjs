import { openNav, closeNav } from './modules/sideNav';
import { logout } from './modules/auth';
import { populateCharts } from './modules/charts';
import {
  enableForm,
  getFormValues,
  buildFetchValues,
  submitForm,
} from './modules/forms';

/// DOM ELEMENTS ///
const menuBtn = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');
const sideNav = document.getElementById('side-nav');
const currentReports = document.getElementsByClassName('chart-current-report');
const editForm = document.querySelector('.btn--edit');
const saveForm = document.querySelector('.btn--save');
const deleteForm = document.querySelector('.btn--delete');
const logoutBtn = document.getElementById('logout');

/// DELEGATION ///

// Side Navigation
if (menuBtn && sideNav) {
  menuBtn.addEventListener('click', (e) => {
    openNav(sideNav);
  });
}
if (closeMenu && sideNav) {
  closeMenu.addEventListener('click', (e) => {
    closeNav(sideNav);
  });
}

// Account Actions
if (logoutBtn) logoutBtn.addEventListener('click', (e) => logout());

// Dashboard
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) populateCharts(currentReports);

// Form Actions
if (editForm) editForm.addEventListener('click', (e) => enableForm(editForm));

if (saveForm) {
  saveForm.addEventListener('click', (e) => {
    const formData = getFormValues();
    const { endpoint, reqType } = buildFetchValues();
    submitForm(endpoint, reqType, formData);
  });
}

if (deleteForm) {
  deleteForm.addEventListener('click', (e) => {
    const { endpoint } = buildFetchValues();
    submitForm(endpoint, 'DELETE');
  });
}
