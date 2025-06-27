function loadImages() {
  fetch('images.json')
    .then(response => response.json())
    .then(images => {
      const gallery = document.getElementById('gallery');
      gallery.innerHTML = '';
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        gallery.appendChild(img);
      });
    })
    .catch(err => {
      console.error('Error loading images:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadImages();

  const form = document.getElementById('uploadForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const files = document.getElementById('imageInput').files;
    if (!files.length) return;
    const data = new FormData();
    for (const file of files) {
      data.append('images', file);
    }
    fetch('/upload', { method: 'POST', body: data })
      .then(r => r.json())
      .then(() => loadImages())
      .catch(err => console.error('Upload failed:', err));
  });
});


