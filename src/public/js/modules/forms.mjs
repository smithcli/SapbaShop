/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import apiFetch from './apiFetch';
import { showAlert } from './alerts';

/// DOM ELEMENTS ///
// Global elements
const fields = document.getElementsByClassName('form__group');
const form = document.getElementsByClassName('form')[0];
const hiddenFeatures = document.getElementsByClassName('hidden');
const cancel = document.createElement('img');
cancel.setAttribute('src', '/img/icons/icons8-close-window-48.png');
cancel.setAttribute('alt', 'Cancel editing button');
const edit = document.createElement('img');
edit.setAttribute('src', '/img/icons/icons8-edit-48.png');
edit.setAttribute('alt', 'Pencil as an edit button');
// Store elements
const zip = document.getElementById('zip');
const phone = document.getElementById('phone');
// Product elements
const productTable = document.getElementById('product-table');
const tableRow = document.getElementById('hidden-add');
const deletedRow = []; // Holds row that contains document data to be removed
const newRows = []; // Holds rows that are to add new docs

/// FORM FUNCTIONS //

// Model specific form functions

// Store Form Functions
// Store Form preparation to submit
const prepareStoreForm = () => {
  zip.value = parseInt(zip.value, 10);
  phone.value = parseInt(phone.value.split('-').join(''), 10);
};

// Product Form Functions
// Hides product table row if contains data, else deletes it.
export const removeStoreRow = (e) => {
  let el = e.target;
  for (let i = 0; i < 5; i++) {
    if (e.target.classList.contains('display')) {
      deletedRow.push(el); // Store row in array for later use to reset or api call.
      el.style.display = 'none'; // hide row items
      el = el.previousSibling; // move to next item
    } else {
      el = el.previousSibling; // move to next before deleteing
      el.nextSibling.remove();
    }
  }
};

// Adds a new row to product-table
export const addStoreRow = () => {
  const newRow = tableRow.cloneNode(true);
  const rowNum = productTable.childNodes.length / 5;
  newRow.childNodes.forEach((child) => {
    child.id += `${rowNum}`;
  });
  newRow.childNodes.item(4).addEventListener('click', (e) => removeStoreRow(e));
  newRows.push(...newRow.childNodes); // Store row in array for later use to reset or api call.
  productTable.append(...newRow.childNodes);
};

// Global form Functions //

// Cancels editing a form
export const disableForm = (editBtn) => {
  form.reset();
  for (const el of fields) {
    el.setAttribute('disabled', null);
  }
  for (const el of hiddenFeatures) {
    el.style.visibility = 'hidden';
    if (!el.classList.contains('display')) el.style.display = 'none';
  }
  if (deletedRow || newRows) {
    deletedRow.forEach((el) => {
      el.style.display = 'block';
    });
    newRows.forEach((el) => {
      el.remove();
    });
  }
  editBtn.replaceChild(edit, editBtn.lastChild);
  editBtn.classList.remove('btn--close');
};

// Enables editing on form
export const enableForm = (editBtn) => {
  // TODO: loops are slow implement better solution for hiding form elements
  if (!editBtn.classList.contains('btn--close')) {
    for (const el of fields) {
      el.removeAttribute('disabled');
    }
    for (const el of hiddenFeatures) {
      el.style.visibility = 'visible';
      el.style.display = el.classList.contains('grid') ? 'grid' : 'block';
    }
    editBtn.replaceChild(cancel, editBtn.lastChild);
    editBtn.classList.add('btn--close');
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
  const endpoint = id ? `/${model}/${id}` : `/${model}`;
  return {
    endpoint,
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
