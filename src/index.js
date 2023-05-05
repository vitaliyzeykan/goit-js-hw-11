import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const API_KEY = '35939413-aadbcae9ca0602d59bc54c500';
const galleryLightBox = new SimpleLightbox('.gallery div');
const loadMoreBtn = document.querySelector('.load-more');
// const axios = require('axios').default;
const searchForm = document.querySelector('form#search-form');
const galleryList = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const options = {
  root: null,
  rootMargin: '500px',
  threshold: 0,
};
let page = 1;
let searchQuery = '';

const observer = new IntersectionObserver(onPagination, options);

searchForm.addEventListener('submit', onSubmitForm);

loadMoreBtn.addEventListener('click', async () => {
  const data = await inputRequest(searchQuery);
  if (!data) return;
  layoutGalery(data);
});

async function onSubmitForm(evt) {
  evt.preventDefault();
  galleryList.innerHTML = '';
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  const input = await inputRequest(searchQuery);
  layoutGalery(input);
  galleryLightBox.refresh();
}

async function inputRequest(searchQuery) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}s&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  try {
    const response = await axios.get(URL);
    if (!response.status === 200) {
      throw new Error(response.statusText);
    }
    console.log(response.data);
    page += 1;
    return response.data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
  // const data = await layoutGalery(data);
}

function layoutGalery(data) {
  // console.log(data);
  // let images = '';
  const marcupGallery = data.hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      // console.log(item);
      return `
    <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
        </p>
  </div>
</div>`;
    })
    .join(' ');
  // galleryList.innerHTML = marcupGallery;

  galleryList.insertAdjacentHTML('beforeend', marcupGallery);
  loadMoreBtn.hidden = false;
  // observer.observe(guard);
  // console.log(data.page);

  // if (data.page !== data.totalHits) {
  //   observer.observe(guard);
  // }
}

function onPagination(entries, observer) {
  console.log(entries);
}

// function onLoadMoreBtn() {
//   page += 1;
//   // console.log(page);
//   inputRequest(page);
// }
