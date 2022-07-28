import { populateCharts } from './modules/charts';

// DOM ELEMENTS
const currentReports = document.getElementsByClassName('chart-current-report');

// DELEGATION
// TODO: Develop client side storage or better version for this expensive call / operation
if (currentReports.length !== 0) {
  populateCharts(currentReports);
}
