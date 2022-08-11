import { openNav, closeNav, openTab } from './modules/nav';
import { logout } from './modules/auth';
import { populateCharts } from './modules/charts';
import * as forms from './modules/forms';

/// DOM ELEMENTS ///
// Global elements
const menuBtn = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');
const sideNav = document.getElementById('side-nav');
const navBar = document.querySelector('.nav-bar');
const backBtn = document.querySelector('.btn--back');
const editForm = document.querySelector('.btn--edit');
const saveForm = document.querySelectorAll('.btn--save');
const deleteForm = document.querySelectorAll('.btn--delete');
const logoutBtn = document.getElementById('logout');
// Dashboard
const currentReports = document.getElementsByClassName('chart-current-report');
// Product elements
const addRow = document.getElementById('add-row');
const removeRow = document.querySelectorAll('.btn--delete-icon');
// const sizeToggle = document.getElementById('size-toggle');
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

// Bar Navigation
if (navBar) {
  navBar.childNodes.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
      openTab(tab, index);
    });
  });
}

if (backBtn) {
  backBtn.addEventListener('click', (e) => {
    window.location = document.referrer;
  });
}

// Account Actions
if (logoutBtn) logoutBtn.addEventListener('click', (e) => logout());

// Dashboard
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) populateCharts(currentReports);

// Global Form Actions
if (editForm) {
  editForm.addEventListener('click', (e) => {
    e.preventDefault();
    forms.enableForm(editForm);
  });
}
if (saveForm) {
  saveForm.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      forms.submitRequest(btn);
    });
  });
}
if (deleteForm) {
  deleteForm.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      forms.submitRequest(btn);
    });
  });
}

// Product Form Actions
if (addRow) {
  addRow.addEventListener('click', (e) => {
    forms.addStoreRow();
  });
}
if (removeRow) {
  removeRow.forEach((row) => {
    row.addEventListener('click', (e) => {
      forms.removeStoreRow(e);
    });
  });
}
