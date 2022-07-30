import { populateCharts } from './modules/charts';
import { openNav, closeNav } from './modules/sideNav';

// DOM ELEMENTS
const menuBtn = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');
const sideNav = document.getElementById('side-nav');
const currentReports = document.getElementsByClassName('chart-current-report');

// DELEGATION
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) {
  populateCharts(currentReports);
}

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
