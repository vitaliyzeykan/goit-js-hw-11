import './css/styles.css';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '35939413-aadbcae9ca0602d59bc54c500';
const lightBox = new SimpleLightbox('.gallery .photo-card img', {
  sourceAttr: 'href',
});
const loadMoreBtn = document.querySelector('.load-more');
const axios = require('axios').default;
const searchForm = document.querySelector('form#search-form');
const galleryList = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
let page = 1;
let searchQuery = '';

const observer = new IntersectionObserver(onPagination, options);

searchForm.addEventListener('submit', onSubmitForm);

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  const data = await inputRequest(searchQuery);
  if (!data) return;
  layoutGalery(data);
});

async function onSubmitForm(evt) {
  evt.preventDefault();

  galleryList.innerHTML = '';
  loadMoreBtn.hidden = true;
  guard.hidden = true;
  page = 1;

  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return;
  }
  const input = await inputRequest(searchQuery);

  layoutGalery(input);
  lightBox.refresh();
  if (input.totalHits !== 0) {
    Notiflix.Notify.info(`Hooray! We found ${input.totalHits} images.`);
  }
}

async function inputRequest(searchQuery) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}s&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  try {
    const response = await axios.get(URL);
    if (!response.status === 200) {
      throw new Error(response.statusText);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}

function layoutGalery(data) {
  console.log(data);

  const marcupGallery = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card">
    <img src="${webformatURL}" href="${largeImageURL}" alt="${tags}" loading="lazy" />
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
      }
    )
    .join(' ');
  // galleryList.innerHTML = marcupGallery;

  galleryList.insertAdjacentHTML('beforeend', marcupGallery);
  if (data.hits.length === 0) {
    guard.hidden = true;
    loadMoreBtn.hidden = true;
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (data.hits.length < 40) {
    guard.hidden = true;
    loadMoreBtn.hidden = true;
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMoreBtn.hidden = false;
    guard.hidden = false;
  }

  observer.observe(guard);

  // console.log(data.page);

  if (data.page !== data.totalHits) {
    observer.observe(guard);
  }
}

async function onPagination(entries, observer) {
  console.log(entries);

  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      page += 1;
      const data = await inputRequest(searchQuery);
      layoutGalery(data);
      lightBox.refresh();
    }
  });
}
