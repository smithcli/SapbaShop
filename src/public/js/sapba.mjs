import { openNav, closeNav } from './modules/sideNav';
import { logout } from './modules/auth';
import { populateCharts } from './modules/charts';
import * as forms from './modules/forms';

/// DOM ELEMENTS ///
// Global elements
const menuBtn = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');
const sideNav = document.getElementById('side-nav');
const currentReports = document.getElementsByClassName('chart-current-report');
const editForm = document.querySelector('.btn--edit');
const saveForm = document.querySelector('.btn--save');
const deleteForm = document.querySelector('.btn--delete');
const logoutBtn = document.getElementById('logout');
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

// Account Actions
if (logoutBtn) logoutBtn.addEventListener('click', (e) => logout());

// Dashboard
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) populateCharts(currentReports);

// Global Form Actions
if (editForm) {
  editForm.addEventListener('click', (e) => forms.enableForm(editForm));
}
if (saveForm) {
  saveForm.addEventListener('click', (e) => {
    const formData = forms.getFormValues();
    const { endpoint, reqType } = forms.buildFetchValues();
    forms.submitForm(endpoint, reqType, formData);
  });
}
if (deleteForm) {
  deleteForm.addEventListener('click', (e) => {
    const { endpoint } = forms.buildFetchValues();
    forms.submitForm(endpoint, 'DELETE');
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

// TODO: add size toggle to clean UI.
// if (sizeToggle) {
//  sizeToggle.addEventListener('change', (e) => {
//    forms.toggleSizeFields(sizeToggle);
//  });
// }
