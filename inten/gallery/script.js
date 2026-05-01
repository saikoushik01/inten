// script.js
const images = [
    { id: 1, src: "https://picsum.photos/id/1015/1200/800", category: "nature", title: "Mountain Lake at Dawn" },
    { id: 2, src: "https://picsum.photos/id/133/1200/800", category: "city", title: "Tokyo Neon Nights" },
    { id: 3, src: "https://picsum.photos/id/201/1200/800", category: "abstract", title: "Fluid Abstract Art" },
    { id: 4, src: "https://picsum.photos/id/251/1200/800", category: "travel", title: "Santorini Blue Hour" },
    { id: 5, src: "https://picsum.photos/id/1018/1200/800", category: "nature", title: "Misty Forest Path" },
    { id: 6, src: "https://picsum.photos/id/870/1200/800", category: "city", title: "New York Skyline" },
    { id: 7, src: "https://picsum.photos/id/133/1200/800", category: "abstract", title: "Geometric Neon Glow" },
    { id: 8, src: "https://picsum.photos/id/1016/1200/800", category: "travel", title: "Bali Rice Terraces" },
    { id: 9, src: "https://picsum.photos/id/866/1200/800", category: "nature", title: "Golden Hour in the Alps" },
    { id: 10, src: "https://picsum.photos/id/201/1200/800", category: "city", title: "Dubai at Night" }
];

let currentIndex = 0;

// DOM Elements
const galleryEl = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const imageTitle = document.getElementById('imageTitle');
const imageCounter = document.getElementById('imageCounter');
const spinner = document.getElementById('spinner');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderGallery(filteredImages) {
    galleryEl.innerHTML = '';

    filteredImages.forEach(img => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${img.src}" alt="${img.title}" loading="lazy">
        `;
        div.onclick = () => {
            currentIndex = images.findIndex(item => item.id === img.id);
            openLightbox();
        };
        galleryEl.appendChild(div);
    });
}

function openLightbox() {
    const current = images[currentIndex];
    
    spinner.style.display = 'block';
    lightboxImg.classList.remove('loaded');
    lightboxImg.src = current.src;

    imageTitle.textContent = current.title;
    imageCounter.textContent = `${currentIndex + 1} of ${images.length}`;

    lightbox.style.display = 'flex';

    lightboxImg.onload = () => {
        spinner.style.display = 'none';
        lightboxImg.classList.add('loaded');
    };
}

function closeLightbox() {
    lightbox.style.display = 'none';
}

// Download Image
function downloadImage() {
    const current = images[currentIndex];
    const a = document.createElement('a');
    a.href = current.src;
    a.download = current.title.toLowerCase().replace(/ /g, '-') + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Copy image link
function copyLink() {
    const current = images[currentIndex];
    navigator.clipboard.writeText(current.src).then(() => {
        const original = shareBtn.innerHTML;
        shareBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => shareBtn.innerHTML = original, 1800);
    });
}

// Filter & Search
function filterImages() {
    const term = searchInput.value.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    const filtered = images.filter(img => {
        const matchSearch = img.title.toLowerCase().includes(term) || 
                           img.category.toLowerCase().includes(term);
        if (activeFilter === 'all') return matchSearch;
        return matchSearch && img.category === activeFilter;
    });

    renderGallery(filtered);
}

// Event Listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterImages();
    });
});

searchInput.addEventListener('input', filterImages);

closeBtn.addEventListener('click', closeLightbox);
downloadBtn.addEventListener('click', downloadImage);
shareBtn.addEventListener('click', copyLink);
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox();
});
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox();
});

document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox();
    }
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox();
    }
});

// Initialize
renderGallery(images);