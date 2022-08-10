/* eslint-disable no-param-reassign */
export const openNav = (nav) => {
  nav.style.width = '250px';
};

export const closeNav = (nav) => {
  nav.style.width = '0';
};

// Tabs open by matching index order
export const openTab = (tab, tabIndex) => {
  const navBarTabs = document.getElementsByClassName('nav-bar-tab');
  const prevSelected = document.querySelector('.nav-bar__item--selected');
  prevSelected.classList.remove('nav-bar__item--selected');
  tab.classList.add('nav-bar__item--selected');
  for (let i = 0; i < navBarTabs.length; i++) {
    const el = navBarTabs[i];
    if (i !== tabIndex && !el.classList.contains('hidden')) {
      el.classList.add('hidden');
    } else if (i === tabIndex) {
      el.classList.remove('hidden');
    }
  }
};
