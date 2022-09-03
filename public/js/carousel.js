/* eslint-disable */
let slideIndex = 0;

function showSlides() {
  let i;
  let slides = document.getElementsByClassName('mySlides');
  let dots = document.getElementsByClassName('dot');
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    // slides[i].className = 'mySlides';
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[slideIndex - 1].style.display = 'block';
  // slides[slideIndex - 1].className = 'mySlides--active';
  dots[slideIndex - 1].className += ' active';
  setTimeout(showSlides, 3500); // Change image every 2 seconds
}

export const autoShowSlides = () => {
  showSlides();
};
