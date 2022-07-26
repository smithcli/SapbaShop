export const showAlert = (type, msg, location = undefined) => {
  hideAlert();
  if (!location) location = 'body';
  const alert = `<div class="alert alert-${type}">${msg}</div>`;
  document.querySelector(location).insertAdjacentHTML('afterbegin', alert);
  window.setTimeout(hideAlert, 5000);
};

export const hideAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) alert.parentElement.removeChild(alert);
};
