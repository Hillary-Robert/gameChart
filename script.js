document.addEventListener('DOMContentLoaded', function () {
  // Role-based menu visibility
  const userRole = document.body.getAttribute('data-role');
  function showMenuForRole(role) {
    const allMenus = document.querySelectorAll('.menu');
    allMenus.forEach(menu => menu.style.display = 'none');
    const roleMenu = document.querySelector(`.menu-${role}`);
    if (roleMenu) roleMenu.style.display = 'block';
  }
  if (userRole) showMenuForRole(userRole);

  // Navigation handler
  const menuItems = document.querySelectorAll('.top-menu ul li a, .sidebar ul li a');
  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const target = e.target.getAttribute('href');
      if (target) window.location.href = target;
    });
  });

  // Login logic
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const role = document.querySelector('input[name="role"]:checked').value;
      if (username && password) {
        alert(`Logged in as ${role}`);
        window.location.href = `${role}_dashboard.html`;
      } else {
        alert('Please enter both username and password.');
      }
    });
  }

  // Tournament form logic
  const numPlayersInput = document.getElementById('numPlayers');
  const playerIdsDiv = document.getElementById('playerIds');
  const form = document.querySelector('form');

  if (numPlayersInput) {
    numPlayersInput.addEventListener('change', updatePlayerInputs);
  }

  function updatePlayerInputs() {
    const numPlayers = parseInt(numPlayersInput.value);
    playerIdsDiv.innerHTML = '';
    for (let i = 1; i <= numPlayers; i++) {
      const label = document.createElement('label');
      label.setAttribute('for', 'player' + i);
      label.textContent = 'Player ' + i + ' User ID:';
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'player' + i;
      input.name = 'player' + i;
      input.placeholder = 'Enter User ID';
      input.required = true;
      playerIdsDiv.appendChild(label);
      playerIdsDiv.appendChild(input);
      playerIdsDiv.appendChild(document.createElement('br'));
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const tournamentType = document.getElementById('tournamentType').value;
      const players = [];
      const inputs = playerIdsDiv.querySelectorAll('input[type="text"]');
      inputs.forEach(input => {
        const value = input.value.trim();
        if (value !== '') players.push(value);
      });
      if (players.length < 2) {
        alert('Please enter at least 2 valid player IDs.');
        return;
      }
      if (tournamentType === 'elimination') {
        generateCupBracket(players);
      } else {
        const rounds = generateRoundRobin(players);
        displaySchedule(rounds);
      }
    });
  }

  function generateCupBracket(players) {
    players = players.sort(() => Math.random() - 0.5);
    let nextPowerOfTwo = 1;
    while (nextPowerOfTwo < players.length) nextPowerOfTwo *= 2;
    while (players.length < nextPowerOfTwo) players.push('BYE');
    const totalRounds = Math.log2(players.length);
    const rounds = [];

    // Round 1
    const baseRound = [];
    for (let i = 0; i < players.length; i += 2) {
      baseRound.push({ p1: players[i], p2: players[i + 1], winner: null });
    }
    rounds.push(baseRound);

    // Future rounds
    for (let r = 1; r < totalRounds; r++) {
      const prevLength = rounds[r - 1].length;
      const round = [];
      for (let j = 0; j < prevLength / 2; j++) {
        round.push({ p1: null, p2: null, winner: null });
      }
      rounds.push(round);
    }

    renderBracket(rounds);
  }

  function renderBracket(rounds) {
    const old = document.getElementById('bracket-container');
    if (old) old.remove();

    const container = document.createElement('div');
    container.id = 'bracket-container';
    container.innerHTML = '<h2>Elimination Bracket</h2>';

    const roundNames = ['Base Matches', 'Quarterfinals', 'Semifinals', 'Finals'];
    rounds.forEach((round, roundIndex) => {
      const roundDiv = document.createElement('div');
      roundDiv.className = 'bracket-round';

      const title = document.createElement('h3');
      title.textContent = roundNames[roundIndex] || `Round ${roundIndex + 1}`;
      roundDiv.appendChild(title);

      round.forEach((match, matchIndex) => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';

        const p1 = document.createElement('div');
        const p2 = document.createElement('div');
        const vs = document.createElement('div');

        p1.textContent = match.p1 || 'TBD';
        p2.textContent = match.p2 || 'TBD';
        vs.textContent = 'vs';

        if (match.p1 && match.p2 && match.winner === null) {
          p1.className = 'clickable';
          p2.className = 'clickable';
          p1.addEventListener('click', () => handleWin(rounds, roundIndex, matchIndex, match.p1));
          p2.addEventListener('click', () => handleWin(rounds, roundIndex, matchIndex, match.p2));
        } else if (match.winner) {
          matchDiv.classList.add('completed');
        }

        matchDiv.appendChild(p1);
        matchDiv.appendChild(vs);
        matchDiv.appendChild(p2);
        roundDiv.appendChild(matchDiv);
      });

      container.appendChild(roundDiv);
    });

    document.body.appendChild(container);
  }

  function handleWin(rounds, roundIndex, matchIndex, winner) {
    rounds[roundIndex][matchIndex].winner = winner;
    const nextRound = rounds[roundIndex + 1];
    if (nextRound) {
      const targetMatch = Math.floor(matchIndex / 2);
      if (matchIndex % 2 === 0) {
        nextRound[targetMatch].p1 = winner;
      } else {
        nextRound[targetMatch].p2 = winner;
      }
    }
    renderBracket(rounds);
  }

  function generateRoundRobin(teams) {
    const schedule = [];
    const numTeams = teams.length;
    let teamList = [...teams];

    if (numTeams % 2 !== 0) {
      teamList.push("Bye");
    }

    const totalRounds = teamList.length - 1;
    const matchesPerRound = teamList.length / 2;

    for (let round = 0; round < totalRounds; round++) {
      const roundMatches = [];
      for (let i = 0; i < matchesPerRound; i++) {
        const home = teamList[i];
        const away = teamList[teamList.length - 1 - i];
        if (home !== "Bye" && away !== "Bye") {
          roundMatches.push(home + " vs " + away);
        }
      }
      schedule.push(roundMatches);
      teamList.splice(1, 0, teamList.pop());
    }

    return schedule;
  }

  function displaySchedule(schedule) {
    const old = document.getElementById('bracket-container');
    if (old) old.remove();

    const outputDiv = document.createElement("div");
    outputDiv.id = "bracket-container";
    outputDiv.innerHTML = "<h2>Round Robin Schedule</h2>";

    schedule.forEach((round, index) => {
      const roundHeader = document.createElement("h3");
      roundHeader.textContent = "Round " + (index + 1);
      outputDiv.appendChild(roundHeader);
      const ul = document.createElement("ul");
      round.forEach(match => {
        const li = document.createElement("li");
        li.textContent = match;
        ul.appendChild(li);
      });
      outputDiv.appendChild(ul);
    });

    document.body.appendChild(outputDiv);
  }
});