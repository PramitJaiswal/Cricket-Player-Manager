// public/script.js
window.onload = async () => {
  const addPlayerForm = document.getElementById('addPlayerForm');
  const playersList = document.getElementById('playersList');

  addPlayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addPlayerForm);
    const playerData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
      });

      if (!response.ok) {
        throw new Error('Failed to add player');
      }

      const newPlayer = await response.json();
      addPlayerToList(newPlayer);
      addPlayerForm.reset();
    } catch (error) {
      console.error(error.message);
    }
  });

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const players = await response.json();
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
          <button onclick="deletePlayer('${player._id}')">Delete</button>
        </div>
      </div>
    `;
    playersList.appendChild(playerElement);
  };

  window.deletePlayer = async (id) => {
    try {
      const response = await fetch(`/api/players/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete player');
      }
      fetchPlayers();
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchPlayers();
};
