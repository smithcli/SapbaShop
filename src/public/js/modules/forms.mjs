/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
import { apiFetch } from './apiFetch';

/// DOM ELEMENTS ///
const fields = document.getElementsByClassName('form__group');
const form = document.querySelector('form');
const formBtns = document.querySelector('.btn-bar');

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

//export const getFormValues = (eleArray) => {
//  document.getElementsByClassName('form__label')
//}
