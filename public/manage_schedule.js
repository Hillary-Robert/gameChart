document.addEventListener('DOMContentLoaded', () => {
  const matchForm = document.getElementById('matchForm');
  const matchList = document.getElementById('matchList');
  let editItem = null;

  if (matchForm && matchList) {
    matchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const player1 = document.getElementById('player1').value.trim();
      const player2 = document.getElementById('player2').value.trim();
      const matchTime = document.getElementById('matchTime').value;
      const location = document.getElementById('location').value.trim();

      if (!player1 || !player2 || !matchTime || !location) return;

      const formattedTime = new Date(matchTime).toLocaleString();

      const html = `
        <strong>${player1}</strong> vs <strong>${player2}</strong><br/>
        <small>${formattedTime} @ ${location}</small>
        <div class="actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      if (editItem) {
        editItem.innerHTML = html;
        editItem = null;
      } else {
        const li = document.createElement('li');
        li.className = 'match-entry';
        li.innerHTML = html;
        matchList.appendChild(li);
      }

      matchForm.reset();
    });

    matchList.addEventListener('click', function (e) {
      const btn = e.target;
      const li = btn.closest('li');

      if (btn.classList.contains('delete-btn')) {
        if (confirm('Delete this match?')) li.remove();
      }

      if (btn.classList.contains('edit-btn')) {
        const text = li.querySelector('strong').textContent;
        const players = li.innerHTML.match(/<strong>(.*?)<\/strong> vs <strong>(.*?)<\/strong>/);
        const timeLoc = li.querySelector('small').textContent;

        if (players && timeLoc) {
          document.getElementById('player1').value = players[1];
          document.getElementById('player2').value = players[2];

          const [dateTimeStr, loc] = timeLoc.split(' @ ');
          const dateTime = new Date(dateTimeStr);
          const isoDateTime = dateTime.toISOString().slice(0, 16);

          document.getElementById('matchTime').value = isoDateTime;
          document.getElementById('location').value = loc;
          editItem = li;
        }
      }
    });
  }
});