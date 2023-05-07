import './css/styles.css';
import Notiflix from 'notiflix';
import { lightBox } from './js/lightbox';
import { inputRequest } from './js/api-service';

// const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.querySelector('form#search-form');
const galleryList = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

const options = {
  root: null,
  rootMargin: '350px',
  threshold: 0,
};

let page = 1;
let searchQuery = '';

const observer = new IntersectionObserver(onPagination, options);

searchForm.addEventListener('submit', onSubmitForm);

//------- function of Button for load more pictures -------
// loadMoreBtn.addEventListener('click', async () => {
//   page += 1;
//   const data = await inputRequest(searchQuery, page);
//   if (!data) return;
//   layoutGalery(data);
// });

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

  const input = await inputRequest(searchQuery, page);
  layoutGalery(input);
  lightBox.refresh();

  if (input.totalHits !== 0) {
    Notiflix.Notify.info(`Hooray! We found ${input.totalHits} images.`);
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

  galleryList.insertAdjacentHTML('beforeend', marcupGallery);

  if (data.hits.length === 0) {
    guard.hidden = true;
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
      // loadMoreBtn.hidden = true;
    );
  } else if (data.hits.length < 40) {
    guard.hidden = true;
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
      // loadMoreBtn.hidden = true;
    );
  } else {
    guard.hidden = false;
    // loadMoreBtn.hidden = false;
  }
  // observer.observe(guard);
  if (data.page !== data.totalHits) {
    observer.observe(guard);
  }
}

async function onPagination(entries, observer) {
  console.log(entries);

  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      page += 1;
      const data = await inputRequest(searchQuery, page);
      layoutGalery(data);
      lightBox.refresh();
    }
  });
}
