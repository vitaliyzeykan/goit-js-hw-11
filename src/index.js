import Notiflix from 'notiflix';
import axios from 'axios';
import './css/styles.css';

const API_KEY = '35939413-aadbcae9ca0602d59bc54c500';
// let searchQuery = '';
let page = 1;

const searchForm = document.querySelector('form#search-form');
// const searchInput = document.querySelector('form[searchQuery]');
const galleryList = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSubmitForm);

async function onSubmitForm(evt) {
  evt.preventDefault();
  galleryList.innerHTML = '';
  const { searchQuery } = evt.currentTarget.elements;
  // console.log(searchQuery.value);
  const input = await inputRequest(searchQuery.value.trim());
  const gallery = await layoutGalery(input);
  return gallery;
}

async function inputRequest(inputValue) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${inputValue}s&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
  try {
    const response = await axios.get(URL);
    // console.log(response);
    if (!response.status === 200) {
      throw new Error(response.status);
    }
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(error.message);
  }
  const data = await layoutGalery(data);
}

function layoutGalery(data) {
  // console.log(data);
  // let images = '';
  const marcupGallery = data.hits
    .map(item => {
      console.log(item);
      return `
    <div class="photo-card">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
        </p>
  </div>
</div>`;
    })
    .join(' ');
  galleryList.innerHTML = marcupGallery;
  // galleryList.insertAdjacentHTML('afterbegin', marcupGallery);
}
