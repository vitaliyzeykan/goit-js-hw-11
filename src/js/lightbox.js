import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightBox = new SimpleLightbox('.photo-card img', {
  sourceAttr: 'href',
  captions: true,
  captionSelector: 'self',
  captionsData: 'alt',
  captionDelay: 250,
});

export { lightBox };
