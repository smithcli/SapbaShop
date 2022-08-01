import { populateCharts } from './modules/charts';
import { openNav, closeNav } from './modules/sideNav';
import { enableForm } from './modules/forms';

/// DOM ELEMENTS ///
const menuBtn = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');
const sideNav = document.getElementById('side-nav');
const currentReports = document.getElementsByClassName('chart-current-report');
const editForm = document.querySelector('.btn--edit');

/// DELEGATION ///
if (currentReports.length !== 0) {
  // TODO: Develop client side storage or better version for this expensive call / operation
  populateCharts(currentReports);
}

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

if (editForm) {
  editForm.addEventListener('click', (e) => {
    enableForm(editForm);
  });
}
