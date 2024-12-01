// DOM Elements
const clipsList = document.getElementById('clipsList');
const searchInput = document.getElementById('search');
const sortViewsBtn = document.getElementById('sortViews');
const sortLengthBtn = document.getElementById('sortLength');
const totalViewsBtn = document.getElementById('totalViews');
const totalDiv = document.getElementById('total');

const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalText = document.getElementById('modalText');
const closeModalBtn = document.getElementById('closeModal');

// Fetch clips from the backend
async function fetchClips() {
    const response = await fetch('http://localhost:5000/api/clips');
    return await response.json();
}

// Delete a clip by ID
async function deleteClip(id) {
    await fetch(`http://localhost:5000/api/clips/${id}`, { method: 'DELETE' });
}

// Render clips 
async function renderClips() {
    const clips = await fetchClips();
    clipsList.innerHTML = ''; // Clear the list
    if (clips.length === 0) {
        clipsList.innerHTML = '<p>Кліпи не знайдено.</p>';
        return;
    }
    clips.forEach((clip, index) => {
        clipsList.insertAdjacentHTML('beforeend', `
            <div class="clip">
                <p><strong>Artist:</strong> ${clip.artist}</p>
                <p><strong>Song:</strong> ${clip.song}</p>
                <p><strong>Length:</strong> ${clip.length} seconds</p>
                <p><strong>Views:</strong> ${clip.views.toLocaleString()}</p>
                <button class="deleteBtn" data-id="${clip._id}">Видалити</button>
            </div>
        `);
    });

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const clipId = event.target.getAttribute('data-id');
            await deleteClip(clipId);  // Delete clip from backend
            renderClips();  // Re-render clips
        });
    });
}

// Show modal window
function showModal(message) {
    modalText.textContent = message;
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Hide modal window
function hideModal() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Initial render of clips
renderClips();

// Event handler for search input
searchInput.addEventListener('input', async function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const clips = await fetchClips();
    const filteredClips = clips.filter(clip =>
        clip.artist.toLowerCase().includes(searchTerm) ||
        clip.song.toLowerCase().includes(searchTerm)
    );
    renderClips(filteredClips);
});

// Event handler for sorting by views
sortViewsBtn.addEventListener('click', async function () {
    const clips = await fetchClips();
    const sortedClips = [...clips].sort((a, b) => b.views - a.views);
    renderClips(sortedClips);
});

// Event handler for sorting by length
sortLengthBtn.addEventListener('click', async function () {
    const clips = await fetchClips();
    const sortedClips = [...clips].sort((a, b) => b.length - a.length);
    renderClips(sortedClips);
});

// Event handler for calculating total views
totalViewsBtn.addEventListener('click', async function () {
    const clips = await fetchClips();
    const totalViews = clips.reduce((acc, clip) => acc + clip.views, 0);
    totalDiv.textContent = `Total Views: ${totalViews.toLocaleString()}`;
});

// Modal handlers
closeModalBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', hideModal);

// Initial render of clips
renderClips();
