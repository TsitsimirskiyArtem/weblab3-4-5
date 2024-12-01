const createForm = document.getElementById('createForm');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modalOverlay');
const modalText = document.getElementById('modalText');
const closeModalBtn = document.getElementById('closeModal');

async function saveClip(clip) {
    await fetch('http://localhost:5000/api/clips', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clip),
    });
}

function showModal(message) {
    modalText.textContent = message;
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

createForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const artist = createForm.artist.value.trim();
    const song = createForm.song.value.trim();
    const length = parseInt(createForm.length.value);
    const views = parseInt(createForm.views.value);

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

    const clip = { artist, song, length, views };
    await saveClip(clip);  // Save clip to the backend
    showModal('Новий музичний кліп успішно створено!');

    createForm.reset();
});

closeModalBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', hideModal);
