// Fetch clips from the backend API
async function fetchClips() {
    const response = await fetch('http://localhost:5000/api/clips');
    if (!response.ok) {
        throw new Error('Failed to fetch clips');
    }
    return await response.json();
}

// Update a clip in the backend API
async function updateClip(id, updatedClip) {
    const response = await fetch(`http://localhost:5000/api/clips/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClip),
    });
    if (!response.ok) {
        throw new Error('Failed to update clip');
    }
    return await response.json();
}

// Dom elements
const editForm = document.getElementById('editForm');
const editSelect = document.getElementById('editSelect');
const editArtist = document.getElementById('editArtist');
const editSong = document.getElementById('editSong');
const editLength = document.getElementById('editLength');
const editViews = document.getElementById('editViews');

const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalText = document.getElementById('modalText');
const closeModalBtn = document.getElementById('closeModal');

// Show modal with a message
function showModal(message) {
    modalText.textContent = message;
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scrolling
}

// Hide modal
function hideModal() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
}

// Populate select options with clips
async function populateEditOptions() {
    try {
        const clips = await fetchClips();
        editSelect.innerHTML = '<option value="" disabled selected>Select a clip</option>'; // Default option
        clips.forEach((clip) => {
            const option = document.createElement('option');
            option.value = clip._id; // Use clip's ID for selection
            option.textContent = `${clip.artist} - ${clip.song}`;
            editSelect.appendChild(option);
        });
    } catch (error) {
        showModal('Failed to load clips for editing.');
    }
}

populateEditOptions();

// Event listener for select change to fill the form with selected clip's details
editSelect.addEventListener('change', async function() {
    const selectedId = editSelect.value;
    if (selectedId === "") return;

    try {
        const clips = await fetchClips();
        const clip = clips.find(c => c._id === selectedId);
        editArtist.value = clip.artist;
        editSong.value = clip.song;
        editLength.value = clip.length;
        editViews.value = clip.views;
    } catch (error) {
        showModal('Failed to load clip details.');
    }
});

// Event listener for form submission to update the clip
editForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const selectedId = editSelect.value;
    if (selectedId === "") {
        showModal('Будь ласка, виберіть кліп для редагування.');
        return;
    }

    const artist = editArtist.value.trim();
    const song = editSong.value.trim();
    const length = parseInt(editLength.value);
    const views = parseInt(editViews.value);

    // Validation
    if (!artist || !song) {
        showModal('Artist та Song не можуть бути порожніми.');
        return;
    }
    if (isNaN(length) || length <= 0) {
        showModal('Length повинен бути позитивним числом.');
        return;
    }
    if (isNaN(views) || views < 0) {
        showModal('Views повинен бути невід’ємним числом.');
        return;
    }

    const updatedClip = { artist, song, length, views };

    try {
        await updateClip(selectedId, updatedClip);  // Update clip in the backend
        showModal('Музичний кліп успішно відредаговано!');

        // Clear the form
        editForm.reset();
        populateEditOptions();  // Refresh the select options
    } catch (error) {
        showModal('Failed to update clip.');
    }
});

// Modal handlers
closeModalBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', hideModal);
