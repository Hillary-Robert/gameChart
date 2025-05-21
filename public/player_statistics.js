document.addEventListener('DOMContentLoaded', function () {
  const statsTable = document.getElementById('statsTable');
  const ctx = document.getElementById('statsChart')?.getContext('2d');
  const addPlayerForm = document.createElement('form');

  // Create Add Player Form
  addPlayerForm.innerHTML = `
    <h3>Add New Player</h3>
    <label>Name: <input type="text" id="newPlayerName" required /></label>
    <label>Matches: <input type="number" id="newPlayerMatches" required min="1" /></label>
    <label>Wins: <input type="number" id="newPlayerWins" required min="0" /></label>
    <button type="submit">Add Player</button>
    <button type="button" id="sortByWin">Sort by Win %</button>
    <button type="button" id="sortByName">Sort by Name</button>
    <button type="button" id="sortByMatches">Sort by Matches</button>
    <hr>
  `;
  statsTable.closest('.card').prepend(addPlayerForm);

  let statsData = JSON.parse(localStorage.getItem('statsData')) || [
    { name: 'Alice', matches: 10, wins: 7 },
    { name: 'Ben', matches: 12, wins: 5 },
    { name: 'Chika', matches: 8, wins: 6 },
    { name: 'Dana', matches: 6, wins: 4 }
  ];

  function updateTable() {
    statsTable.innerHTML = '';
    statsData.forEach((player, index) => {
      const losses = player.matches - player.wins;
      const winPercent = ((player.wins / player.matches) * 100).toFixed(1);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td contenteditable="true" data-field="name" data-index="${index}">${player.name}</td>
        <td contenteditable="true" data-field="matches" data-index="${index}">${player.matches}</td>
        <td contenteditable="true" data-field="wins" data-index="${index}">${player.wins}</td>
        <td>${losses}</td>
        <td>${winPercent}%</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      statsTable.appendChild(row);
    });
    updateChart();
    localStorage.setItem('statsData', JSON.stringify(statsData));
  }

  function updateChart() {
    if (ctx.chart) ctx.chart.destroy();
    ctx.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: statsData.map(p => p.name),
        datasets: [{
          label: 'Win %',
          data: statsData.map(p => ((p.wins / p.matches) * 100).toFixed(1)),
          backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545', '#6610f2', '#17a2b8'],
          borderColor: ['#0056b3', '#e0a800', '#1e7e34', '#c82333', '#520dc2', '#117a8b'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Player Win Rate %',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Win Percentage'
            }
          }
        }
      }
    });
  }

  addPlayerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('newPlayerName').value.trim();
    const matches = parseInt(document.getElementById('newPlayerMatches').value);
    const wins = parseInt(document.getElementById('newPlayerWins').value);

    if (!name || isNaN(matches) || isNaN(wins) || wins > matches) return;

    statsData.push({ name, matches, wins });
    updateTable();
    addPlayerForm.reset();
  });

  document.getElementById('sortByWin').addEventListener('click', function () {
    statsData.sort((a, b) => (b.wins / b.matches) - (a.wins / a.matches));
    updateTable();
  });

  document.getElementById('sortByName').addEventListener('click', function () {
    statsData.sort((a, b) => a.name.localeCompare(b.name));
    updateTable();
  });

  document.getElementById('sortByMatches').addEventListener('click', function () {
    statsData.sort((a, b) => b.matches - a.matches);
    updateTable();
  });

  statsTable.addEventListener('blur', function (e) {
    const cell = e.target;
    const field = cell.dataset.field;
    const index = parseInt(cell.dataset.index);
    if (!field || isNaN(index)) return;

    let value = cell.textContent.trim();
    if (field === 'matches' || field === 'wins') value = parseInt(value);
    statsData[index][field] = value;
    updateTable();
  }, true);

  statsTable.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.dataset.index);
      if (!isNaN(index) && confirm('Are you sure you want to delete this player?')) {
        statsData.splice(index, 1);
        updateTable();
      }
    }
  });

  updateTable();
});