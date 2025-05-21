document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('resultForm');
  const resultsTable = document.querySelector('.results-table tbody');

  let editRow = null; // Keep track of the row being edited

  if (form && resultsTable) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const player1 = document.getElementById('player1').value.trim();
      const player2 = document.getElementById('player2').value.trim();
      const score = document.getElementById('score').value.trim();
      const winner = document.getElementById('winner').value.trim();
      const matchDate = document.getElementById('matchDate').value;

      if (!player1 || !player2 || !score || !winner || !matchDate) {
        alert('❌ Please fill in all fields.');
        return;
      }

      const rowHtml = `
        <td>${player1} vs ${player2}</td>
        <td>${matchDate}</td>
        <td>${score}</td>
        <td>${winner}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      if (editRow) {
        editRow.innerHTML = rowHtml;
        editRow = null;
      } else {
        const tr = document.createElement('tr');
        tr.innerHTML = rowHtml;
        resultsTable.appendChild(tr);
      }

      form.reset();
    });

    // Event Delegation for Edit/Delete Buttons
    resultsTable.addEventListener('click', function (e) {
      const btn = e.target;
      const row = btn.closest('tr');
      if (!row) return;

      if (btn.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this result?')) {
          row.remove();
        }
      }

      if (btn.classList.contains('edit-btn')) {
        const cells = row.querySelectorAll('td');
        const [matchCell, dateCell, scoreCell, winnerCell] = cells;
        const [player1, player2] = matchCell.textContent.split(' vs ');

        document.getElementById('player1').value = player1.trim();
        document.getElementById('player2').value = player2.trim();
        document.getElementById('score').value = scoreCell.textContent.trim();
        document.getElementById('winner').value = winnerCell.textContent.trim();
        document.getElementById('matchDate').value = dateCell.textContent.trim();

        editRow = row;
      }
    });
  } else {
    console.warn('⚠️ resultForm or resultsTable not found in DOM.');
  }
});
