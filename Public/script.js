window.onload = async () => {
  const addPlayerForm = document.getElementById('addPlayerForm');
  const playersList = document.getElementById('playersList');

  addPlayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addPlayerForm);
    const playerData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post('/api/players', playerData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error('Failed to add player');
      }

      const newPlayer = response.data;
      addPlayerToList(newPlayer);
      addPlayerForm.reset();
    } catch (error) {
      console.error(error.message);
    }
  });

  window.searchPlayers = async () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput === '') {
      fetchPlayers();
      return;
    }

    try {
      const response = await axios.get(`/api/players?name=${encodeURIComponent(searchInput)}`);
      const players = response.data;
      playersList.innerHTML = '';
      players.forEach(player => addPlayerToList(player));
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('/api/players');
      const players = response.data;
      playersList.innerHTML = '';
      players.forEach(player => addPlayerToList(player));
    } catch (error) {
      console.error(error.message);
    }
  };

  const addPlayerToList = (player) => {
    const playerElement = document.createElement('div');
    playerElement.innerHTML = `
      <div class="player">
        <img src="${player.photoURL}" alt="${player.name}">
        <div>
          <h2>${player.name}</h2>
          <p>Date of Birth: ${player.dob}</p>
          <p>Career Info: ${player.careerInfo}</p>
          <p>Matches Played: ${player.matchesPlayed}</p>
          <p>Runs Scored: ${player.runsScored}</p>
          <p>Wickets Taken: ${player.wicketsTaken}</p>
          <button onclick="editPlayer('${player._id}')">Edit</button>
          <button onclick="deletePlayer('${player._id}')">Delete</button>
        </div>
      </div>
    `;
    playersList.appendChild(playerElement);
  };

  window.deletePlayer = async (id) => {
    try {
      const response = await axios.delete(`/api/players/${id}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete player');
      }
      fetchPlayers();
    } catch (error) {
      console.error(error.message);
    }
  };

  window.editPlayer = async (id) => {
    try {
      const response = await axios.get(`/api/players/${id}`);
      if (response.status === 200) {
        const player = response.data;
        populateEditForm(player);
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'block';
      } else {
        throw new Error('Failed to fetch player data');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const populateEditForm = (player) => {
    const editForm = document.getElementById('editForm');
    editForm.elements['id'].value = player._id;
    editForm.elements['name'].value = player.name;
    editForm.elements['photoURL'].value = player.photoURL;
    editForm.elements['dob'].value = player.dob.split('T')[0];
    editForm.elements['careerInfo'].value = player.careerInfo;
    editForm.elements['matchesPlayed'].value = player.matchesPlayed;
    editForm.elements['runsScored'].value = player.runsScored;
    editForm.elements['wicketsTaken'].value = player.wicketsTaken;
  };

  const closeEditModal = () => {
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'none';
  };

  const editForm = document.getElementById('editForm');
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const playerData = Object.fromEntries(formData.entries());

    try {
      const response = await axios.put(`/api/players/${playerData.id}`, playerData);
      if (response.status === 200) {
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'none';
        fetchPlayers();
      } else {
        throw new Error('Failed to update player');
      }
    } catch (error) {
      console.error(error.message);
    }
  });

  fetchPlayers();
};