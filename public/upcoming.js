document.addEventListener('DOMContentLoaded', function () {
  const matchForm = document.getElementById('matchForm');
  const matchList = document.getElementById('matchList');
  let editRow = null;

  if (matchForm && matchList) {
    matchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const player1 = document.getElementById('player1').value.trim();
      const player2 = document.getElementById('player2').value.trim();
      const matchTime = document.getElementById('matchTime').value;
      const location = document.getElementById('location').value.trim();

      if (!player1 || !player2 || !matchTime || !location) {
        alert('❌ Please fill in all fields.');
        return;
      }

      const rowHTML = `
        <td>${player1} vs ${player2}</td>
        <td>${new Date(matchTime).toLocaleString()}</td>
        <td>${location}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      if (editRow) {
        editRow.innerHTML = rowHTML;
        editRow = null;
      } else {
        const tr = document.createElement('tr');
        tr.innerHTML = rowHTML;
        matchList.appendChild(tr);
      }

      matchForm.reset();
    });

    // Event Delegation for Edit/Delete
    matchList.addEventListener('click', function (e) {
      const btn = e.target;
      const row = btn.closest('tr');
      if (!row) return;

      if (btn.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this match?')) {
          row.remove();
        }
      }

      if (btn.classList.contains('edit-btn')) {
        const cells = row.querySelectorAll('td');
        const [matchCell, dateCell, locationCell] = cells;
        const [player1, player2] = matchCell.textContent.split(' vs ');

        document.getElementById('player1').value = player1.trim();
        document.getElementById('player2').value = player2.trim();
        document.getElementById('matchTime').value = new Date(dateCell.textContent).toISOString().slice(0, 16);
        document.getElementById('location').value = locationCell.textContent.trim();

        editRow = row;
      }
    });
  } else {
    console.warn('⚠️ matchForm or matchList not found in DOM.');
  }
});
