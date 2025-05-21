document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tournamentForm');
  const playerIdsDiv = document.getElementById('playerIds');
  const numPlayersInput = document.getElementById('numPlayers');
  const bracketContainer = document.getElementById('bracket-container');

  // Generate input fields based on number of players
  numPlayersInput.addEventListener('change', () => {
    const count = parseInt(numPlayersInput.value);
    playerIdsDiv.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const label = document.createElement('label');
      label.textContent = `Player ${i} ID:`;
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `player${i}`;
      input.required = true;
      label.appendChild(input);
      playerIdsDiv.appendChild(label);
      playerIdsDiv.appendChild(document.createElement('br'));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const format = document.getElementById('tournamentType').value;
    const players = Array.from(playerIdsDiv.querySelectorAll('input'))
      .map(input => input.value.trim())
      .filter(name => name);

    bracketContainer.innerHTML = '';

    if (players.length < 2) {
      alert('Please enter at least two players.');
      return;
    }

    if (format === 'roundrobin') {
      const schedule = generateRoundRobin(players);
      displaySchedule(schedule);
    } else {
      const rounds = generateElimination(players);
      renderBracket(rounds);
    }
  });

  function generateRoundRobin(teams) {
    const schedule = [];
    if (teams.length % 2 !== 0) teams.push('BYE');
    const totalRounds = teams.length - 1;

    for (let round = 0; round < totalRounds; round++) {
      const matches = [];
      for (let i = 0; i < teams.length / 2; i++) {
        const home = teams[i];
        const away = teams[teams.length - 1 - i];
        if (home !== 'BYE' && away !== 'BYE') {
          matches.push(`${home} vs ${away}`);
        }
      }
      schedule.push(matches);
      teams.splice(1, 0, teams.pop());
    }

    return schedule;
  }

  function displaySchedule(schedule) {
    schedule.forEach((round, index) => {
      const h3 = document.createElement('h3');
      h3.textContent = `Round ${index + 1}`;
      bracketContainer.appendChild(h3);
      const ul = document.createElement('ul');
      round.forEach(match => {
        const li = document.createElement('li');
        li.textContent = match;
        ul.appendChild(li);
      });
      bracketContainer.appendChild(ul);
    });
  }

  function generateElimination(players) {
    const rounds = [];
    while ((players.length & (players.length - 1)) !== 0) {
      players.push('BYE');
    }

    const initialRound = [];
    for (let i = 0; i < players.length; i += 2) {
      initialRound.push({ p1: players[i], p2: players[i + 1] });
    }
    rounds.push(initialRound);

    let matches = initialRound.length;
    while (matches > 1) {
      matches = Math.floor(matches / 2);
      const round = Array.from({ length: matches }, () => ({ p1: 'TBD', p2: 'TBD' }));
      rounds.push(round);
    }

    return rounds;
  }

  function renderBracket(rounds) {
    rounds.forEach((round, index) => {
      const div = document.createElement('div');
      div.classList.add('bracket-round');
      const h3 = document.createElement('h3');
      h3.textContent = `Round ${index + 1}`;
      div.appendChild(h3);

      round.forEach(match => {
        const p = document.createElement('p');
        p.textContent = `${match.p1} vs ${match.p2}`;
        div.appendChild(p);
      });

      bracketContainer.appendChild(div);
    });
  }
});