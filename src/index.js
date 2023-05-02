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
  inputRequest(searchQuery.value);
}

async function inputRequest(inputValue) {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${inputValue}s&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(ERROR);
    Notiflix.Notify.failure('Qui timide rogat docet negare');
    return null;
  }
  
}

