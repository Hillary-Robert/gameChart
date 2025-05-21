document.addEventListener('DOMContentLoaded', function () {
  const userTable = document.getElementById('userTable');
  const dashboard = document.querySelector('.dashboard');

  // Create search input
  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.placeholder = 'Search by name, email, or role...';
  searchBar.classList.add('search-bar');
  dashboard.insertBefore(searchBar, dashboard.children[2]);

  let users = JSON.parse(localStorage.getItem('users')) || [
    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Player', status: 'Pending' },
    { name: 'Ben Carter', email: 'ben@example.com', role: 'Organizer', status: 'Approved' },
    { name: 'Dana Smith', email: 'dana@example.com', role: 'Admin', status: 'Inactive' }
  ];

  let filteredUsers = [...users];

  function renderUsers() {
    userTable.innerHTML = '';
    filteredUsers.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td contenteditable="true" data-index="${index}" data-field="name">${user.name}</td>
        <td contenteditable="true" data-index="${index}" data-field="email">${user.email}</td>
        <td>
          <select data-index="${index}" class="role-select">
            <option${user.role === 'Admin' ? ' selected' : ''}>Admin</option>
            <option${user.role === 'Organizer' ? ' selected' : ''}>Organizer</option>
            <option${user.role === 'Player' ? ' selected' : ''}>Player</option>
          </select>
        </td>
        <td>${user.status}</td>
        <td>
          <button class="approve-btn" data-index="${index}">Approve</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      userTable.appendChild(row);
    });
    localStorage.setItem('users', JSON.stringify(users));
  }

  searchBar.addEventListener('input', function () {
    const query = searchBar.value.trim().toLowerCase();
    filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    renderUsers();
  });

  userTable.addEventListener('blur', function (e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);
    const field = cell.dataset.field;
    if (!isNaN(index) && field) {
      users[index][field] = cell.textContent.trim();
      filteredUsers = [...users];
      renderUsers();
    }
  }, true);

  userTable.addEventListener('change', function (e) {
    if (e.target.classList.contains('role-select')) {
      const index = parseInt(e.target.dataset.index);
      users[index].role = e.target.value;
      filteredUsers = [...users];
      renderUsers();
    }
  });

  userTable.addEventListener('click', function (e) {
    const index = parseInt(e.target.dataset.index);

    if (e.target.classList.contains('approve-btn')) {
      users[index].status = 'Approved';
      filteredUsers = [...users];
      renderUsers();
    }

    if (e.target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this user?')) {
        users.splice(index, 1);
        filteredUsers = [...users];
        renderUsers();
      }
    }
  });

  renderUsers();
});