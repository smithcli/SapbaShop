export const hideAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) alert.parentElement.removeChild(alert);
};

export const showAlert = (type, msg, location = undefined) => {
  // eslint-disable-next-line no-param-reassign
  if (!location) location = 'body';

  hideAlert();
  const alert = `<div class="alert alert-${type}">${msg}</div>`;
  document.querySelector(location).insertAdjacentHTML('afterbegin', alert);
  window.setTimeout(hideAlert, 3000);
};
