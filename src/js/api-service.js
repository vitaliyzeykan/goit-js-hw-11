export { inputRequest };
import Notiflix from 'notiflix';

const API_KEY = '35939413-aadbcae9ca0602d59bc54c500';
const BASE_URL = 'https://pixabay.com/api/';
const axios = require('axios').default;

async function inputRequest(searchQuery, page) {
  const URL = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
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
