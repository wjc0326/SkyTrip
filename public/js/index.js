/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { resizeImage } from './resizeImage';
import { autoShowSlides } from './carousel';
import { bookTour } from './stripe';
import { createReview } from './review';
import { showAlert } from './alerts';

// Dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const pfpUploadInput = document.getElementById('photo');
const slides = document.querySelectorAll('.mySlides');
const bookBtn = document.getElementById('book-tour');
const reviewBtn = document.querySelector('.btn--review');
const reviewSave = document.querySelector('.review-save');
const closeReview = document.querySelector('.close');
const alertMessage = document.querySelector('body').dataset.alert;

if (slides.length != 0) {
  autoShowSlides();
}

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  pfpUploadInput.addEventListener('change', async (e) => {
    const inputPic = pfpUploadInput.files[0];
    if (inputPic) {
      const userPhotoElement = document.querySelector('.form__user-photo');
      resizeImage(inputPic, 500, 500, userPhotoElement);
    }
  });
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-password').innerHTML = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').innerHTML = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'flex';
  });
}

if (closeReview) {
  closeReview.addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'none';
  });
}

if (reviewSave) {
  reviewSave.addEventListener('click', async (e) => {
    const review = document.getElementById('review').value;
    const rating = document.getElementById('ratings').value;
    const { tourId } = e.target.dataset;
    await createReview(tourId, review, rating);
    // document.querySelector('.bg-modal').style.display = 'none';
  });
}

if (alertMessage) {
  showAlert('success', alertMessage, 20);
}
