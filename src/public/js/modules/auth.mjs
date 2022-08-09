import apiFetch from './apiFetch';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await apiFetch('/users/login', 'POST', { email, password });
    if (res.status === 'success') {
      window.location.assign('/dashboard');
    }
  } catch (err) {
    showAlert('fail', err);
  }
};

export const logout = async () => {
  try {
    const res = await apiFetch('/users/logout', 'GET');
    if (res.status === 'success') {
      showAlert('pass', 'Logging out');
      window.setTimeout(() => {
        window.location.assign('/login');
      }, 1000);
    }
  } catch (err) {
    showAlert('fail', `Error: ${err}. Please try again.`);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await apiFetch('/users/forgotPassword', 'POST', { email });
    if (res.status === 'success') {
      // TODO: set a modal to allow longer read time and have user press a button.
      showAlert('pass', `Success!, ${res.message}`);
      window.setTimeout(() => {
        window.location.assign('/login');
      }, 3000);
    }
  } catch (err) {
    showAlert('fail', `Error: ${err}. Please try again.`);
  }
};
