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

function onSubmitForm(evt) {
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget.elements;
  // console.log(searchQuery.value);
  inputRequest(searchQuery.value.trim());
}

async function inputRequest(inputValue) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${inputValue}s&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Qui timide rogat docet negare');
    return null;
  }
}

function layoutGalery(data) {
  let images = '';
  const marcupGallery = data.hits
    .map(item => {
      return `
    <div class="photo-card">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>`;
    })
    .join('');
  galleryList.innerHTML = marcupGallery;
}
