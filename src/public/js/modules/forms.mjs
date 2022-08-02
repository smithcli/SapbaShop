/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import apiFetch from './apiFetch';
import { showAlert } from './alerts';

/// DOM ELEMENTS ///
// Global elements
const fields = document.getElementsByClassName('form__group');
const form = document.getElementsByClassName('form')[0];
const formBtns = document.querySelector('.btn-bar');
// Store elements
const zip = document.getElementById('zip');
const phone = document.getElementById('phone');

/// FORM FUNCTIONS //

// Model specific form functions

// Store Form preparation to submit
const prepareStoreForm = () => {
  zip.value = parseInt(zip.value, 10);
  phone.value = parseInt(phone.value.split('-').join(''), 10);
};

// Global form Functions //

// Cancels editing a form
export const disableForm = (editBtn) => {
  form.reset();
  for (const el of fields) {
    el.setAttribute('disabled', null);
  }
  editBtn.innerHTML = 'Edit';
  formBtns.classList.add('btn--hidden');
};

// Enables editing on form
export const enableForm = (editBtn) => {
  if (editBtn.innerHTML === 'Edit') {
    for (const el of fields) {
      el.removeAttribute('disabled');
    }
    editBtn.innerHTML = 'Cancel';
    formBtns.classList.remove('btn--hidden');
  } else {
    disableForm(editBtn);
  }
};

// Build object from form
export const getFormValues = () => {
  const obj = {};
  prepareStoreForm();
  const formData = new FormData(form);
  for (const [key, value] of formData) {
    if (key.includes('.')) {
      const [key1, key2] = key.split('.');
      if (!obj[key1]) obj[key1] = {};
      obj[key1][key2] = value;
    } else {
      obj[key] = value;
    }
  }
  return obj;
};

// Dynamically build fetch req return as object
// Buttons will determine if 'DELETE' req type
export const buildFetchValues = () => {
  // In HTML Form the form must have data attributes
  // model = endpoint, and the id of object to modify if PATCH
  const { id, model } = form.dataset;
  const reqType = form.dataset.id ? 'PATCH' : 'POST';
  return {
    endpoint: `/${model}/${id}`,
    reqType,
  };
};

// Submit Form data
export const submitForm = async (endpoint, req, obj) => {
  try {
    const res = await apiFetch(endpoint, req, obj);
    if (res.status === 'success' || res.status === 204) {
      const action = req === 'DELETE' ? 'Deleted' : 'Saved';
      showAlert('pass', `${action} successfully!`);
      window.setTimeout(() => {
        window.location = document.referrer;
      }, 1500);
    }
  } catch (err) {
    showAlert('fail', err);
  }
};
