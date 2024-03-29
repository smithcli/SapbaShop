/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import apiFetch from './apiFetch';
import { showAlert } from './alerts';

/// DOM ELEMENTS ///
// Global elements
const fields = document.getElementsByClassName('form__group');
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

// User elements
const active = document.getElementById('active');

// Product elements
const productTable = document.getElementById('product-table');
const tableRow = document.getElementById('hidden-add');
const deletedRow = []; // Holds row that contains document data to be removed
const newRows = []; // Holds rows that are to add new docs

/// FORM FUNCTIONS //

// Model specific form functions

// User Form Functions
// Check for active selection, checkbox unchecked is not added to formData
const prepareUserObj = (obj) => {
  if (active && !active.checked) obj.active = false;
};

// Product Form Functions
// Pull out the fields common to all the product documents
const extractCommonProductData = (productForm) => {
  const data = new FormData(productForm);
  data.delete('store');
  data.delete('size');
  data.delete('price');
  data.delete('count');
  return data;
};

const extractProductData = (productForm) => {
  const data = new FormData(productForm);
  data.delete('name.en');
  data.delete('name.th');
  data.delete('description.en');
  data.delete('description.th');
  data.delete('department.en');
  data.delete('unit.en');
  data.delete('unit.th');
  return data;
};

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

// Adds a new row to product-table in product-details
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
  editBtn.form.reset();
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

/// Submitting Form Functions ///

// Build object model from FormData object
const buildObj = (formData) => {
  const obj = {};
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

// Product form is different as it contains multiple objects / documents in one page.
const getProductValues = (form) => {
  const { model, route } = form.dataset;
  const ids = route ? JSON.parse(route) : [];
  const productValues = []; // will return all objects with reqType and endpoint embedded.

  // 1) parse deletedRows, get index of deleted
  const toDelete = []; // holds row index of rows to be deleted
  deletedRow.forEach((el, i) => {
    if (i % 5 === 0) toDelete.push(el.id);
  });
  toDelete.forEach((i) => {
    productValues.push({
      reqType: 'DELETE',
      endpoint: `/${model}/${ids[i]}`,
    });
  });
  // 2) Parse common lines from form to make obj base.
  const objBase = buildObj(extractCommonProductData(form));

  // 3) filter out the common form data
  const formData = extractProductData(form);

  // track object count, starts at -1 to keep with index number as its incremented at beginning.
  let p = -1;
  let obj; // needed to hold outside the loop
  const totalRows = formData.getAll('store').length - 1; // discard last row, it is a template.
  for (const [key, value] of formData) {
    // count table rows, will make first row 0.
    if (key === 'store') p += 1;
    if (p === totalRows) break; // stop at last valid row, last one is the template.
    if (toDelete.includes(p.toString())) continue; // don't process rows marked to delete.

    // Building objects with body starts here
    if (key === 'store') obj = {};
    obj[key] = value;

    // finish object build and push at end of row, patch/post is determined by ids
    if (key === 'count' && p <= ids.length - 1) {
      obj = Object.assign(obj, objBase);
      productValues.push({
        reqType: 'PATCH',
        endpoint: `/${model}/${ids[p]}`,
        obj,
      });
    } else if (key === 'count' && p > ids.length - 1) {
      obj = Object.assign(obj, objBase);
      productValues.push({
        reqType: 'POST',
        endpoint: `/${model}`,
        obj,
      });
    }
  }
  return productValues;
};

// Dynamically build fetch req return as object
// Buttons will determine if 'DELETE' req type
const buildFetchValues = (model, route) => {
  // In HTML Form the form must have data attributes
  // model = endpoint, and the id of object to modify if PATCH
  const reqType = route ? 'PATCH' : 'POST';
  const endpoint = route ? `/${model}/${route}` : `/${model}`;
  return {
    endpoint,
    reqType,
  };
};

const buildSaveRequest = (form) => {
  const { model, route } = form.dataset;
  if (model === 'products') return getProductValues(form);
  const obj = buildObj(new FormData(form));
  if (model === 'users') prepareUserObj(obj); // after object build
  const { endpoint, reqType } = buildFetchValues(model, route);
  return { reqType, endpoint, obj };
};

const buildDeleteRequest = (form) => {
  const { model, route } = form.dataset;
  if (model === 'products') {
    const ids = JSON.parse(route);
    return ids.map((prodId) => ({
      endpoint: `/${model}/${prodId}`,
      reqType: 'DELETE',
    }));
  }
  return {
    endpoint: `/${model}/${route}`,
    reqType: 'DELETE',
  };
};

// Submit Form data
export const submitRequest = async (btn) => {
  const formRequest = btn.classList.contains('btn--save')
    ? buildSaveRequest(btn.form)
    : buildDeleteRequest(btn.form);
  if (!Array.isArray(formRequest)) {
    try {
      const { endpoint, reqType, obj } = formRequest;
      const res = await apiFetch(endpoint, reqType, obj);
      if (res.status === 'success' || res.status === 204) {
        const action = reqType === 'DELETE' ? 'Deleted' : 'Saved';
        showAlert('pass', `${action} successfully!`);
        if (reqType === 'DELETE' && endpoint === '/users/me') {
          window.setTimeout(() => {
            window.location.assign('/login');
          }, 1000);
        } else if (reqType === 'DELETE' || reqType === 'POST') {
          window.setTimeout(() => {
            window.location = document.referrer;
          }, 1000);
        } else {
          window.setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (err) {
      showAlert('fail', err);
    }
  } else {
    try {
      const apiCalls = [];
      for (const doc of formRequest) {
        const { endpoint, reqType, obj } = doc;
        apiCalls.push(apiFetch(endpoint, reqType, obj));
      }
      const res = await Promise.all(apiCalls);
      if (res[0].status === 'success' || res[0].status === 204) {
        const action = btn.classList.contains('btn--delete')
          ? 'Deleted'
          : 'Saved';
        showAlert('pass', `${action} successfully!`);
        window.setTimeout(() => {
          window.location = document.referrer;
        }, 1500);
      }
    } catch (err) {
      showAlert('fail', err);
    }
  }
};
