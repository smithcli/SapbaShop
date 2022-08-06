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
// const sizeToggle = document.getElementById('size-toggle');
// const sizeFields = document.getElementsByClassName('product-size');

/// FORM FUNCTIONS //

// Model specific form functions

// Store Form Functions
// Store Form preparation to submit
const prepareStoreForm = () => {
  zip.value = parseInt(zip.value, 10);
  phone.value = parseInt(phone.value.split('-').join(''), 10);
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

// TODO: add size toggle, that also resets when cancel is pressed.
// export const toggleSizeFields = (toggle) => {
//   if (toggle.checked) {
//     for (const el of sizeFields) {
//       el.classList.remove('size-disabled');
//     }
//   } else {
//     for (const el of sizeFields) {
//       el.classList.add('size-disabled');
//     }
//   }
// };

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
const getProductValues = () => {
  const { id, model } = form.dataset;
  const ids = JSON.parse(id);
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
const buildFetchValues = () => {
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

const buildSaveRequest = () => {
  const { model } = form.dataset;
  if (model === 'stores') {
    prepareStoreForm();
    const obj = buildObj(new FormData(form));
    const { endpoint, reqType } = buildFetchValues();
    return { reqType, endpoint, obj };
  }
  if (model === 'products') {
    return getProductValues();
  }
};

const buildDeleteRequest = () => {
  const { id, model } = form.dataset;
  if (model === 'products') {
    const ids = JSON.parse(id);
    return ids.map((prodId) => ({
      endpoint: `/${model}/${prodId}`,
      reqType: 'DELETE',
    }));
  }
  return {
    endpoint: `/${model}/${id}`,
    reqType: 'DELETE',
  };
};

// Submit Form data
export const submitRequest = async (button) => {
  const formRequest = button === 'SAVE'
    ? buildSaveRequest()
    : buildDeleteRequest();
  if (!Array.isArray(formRequest)) {
    try {
      const { endpoint, reqType, obj } = formRequest;
      const res = await apiFetch(endpoint, reqType, obj);
      if (res.status === 'success' || res.status === 204) {
        const action = reqType === 'DELETE' ? 'Deleted' : 'Saved';
        showAlert('pass', `${action} successfully!`);
        window.setTimeout(() => {
          window.location = document.referrer;
        }, 1500);
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
        const action = button === 'DELETE' ? 'Deleted' : 'Saved';
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
