document.addEventListener('DOMContentLoaded', function () {
  // Role-based Menu Visibility
  const userRole = document.body.getAttribute('data-role');
  function showMenuForRole(role) {
    const allMenus = document.querySelectorAll('.menu');
    allMenus.forEach(menu => menu.style.display = 'none');
    const roleMenu = document.querySelector(`.menu-${role}`);
    if (roleMenu) roleMenu.style.display = 'block';
  }
  if (userRole) showMenuForRole(userRole);

  // Navigation Handler
  const menuItems = document.querySelectorAll('.top-menu ul li a, .sidebar ul li a, nav ul li a');
  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const target = item.getAttribute('href');
      if (target && target !== '#') {
        e.preventDefault();
        window.location.href = target;
      }
    });
  });

  // Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const response = await fetch('/login', {
        method: 'POST',
        body: formData
      });
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        alert(await response.text());
      }
    });
  }

  // Login Type Toggle
  let loginType = 'guest';
  window.switchLogin = function (type) {
    loginType = type;

    const guestBtn = document.getElementById('guestBtn');
    const organizerBtn = document.getElementById('organizerBtn');
    const playerBtn = document.getElementById('playerBtn');
    const guestMessage = document.getElementById('guestMessage');
    const loginForm = document.getElementById('loginForm');

    if (guestBtn && organizerBtn && playerBtn && guestMessage && loginForm) {
      guestBtn.classList.toggle('active', type === 'guest');
      organizerBtn.classList.toggle('active', type === 'organizer');
      playerBtn.classList.toggle('active', type === 'player');

      guestMessage.style.display = type === 'guest' ? 'block' : 'none';
      loginForm.style.display = type !== 'guest' ? 'flex' : 'none';
    }
  };

  window.handleLogin = function () {
    if (loginType === 'guest') {
      alert('Logged in as Guest');
      window.location.href = '/guest_dashboard.html';
    } else {
      const contact = document.getElementById('emailOrPhone')?.value.trim();
      const pass = document.getElementById('password')?.value.trim();

      if (!contact || !pass) {
        alert('Please enter your email/phone and password.');
      } else {
        alert(`Logged in as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}\nEmail/Phone: ${contact}`);
      }
    }
  };

  // Chart.js for roles including admin
  const chartCanvas = document.getElementById('userChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    if (userRole === 'admin') {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Approved Users', 'Pending Approvals', 'Inactive Users'],
          datasets: [{
            data: [29, 3, 5],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            borderColor: ['#218838', '#e0a800', '#c82333'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            title: {
              display: true,
              text: 'Admin User Distribution',
              font: {
                size: 18
              }
            }
          }
        }
      });
    } else if (userRole === 'organizer') {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tournament A', 'Tournament B', 'Tournament C'],
          datasets: [{
            label: 'Matches Scheduled',
            data: [12, 7, 4],
            backgroundColor: ['#007bff', '#ffc107', '#28a745'],
            borderColor: ['#0056b3', '#e0a800', '#1e7e34'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Matches' } },
            x: { title: { display: true, text: 'Tournaments' } }
          }
        }
      });
    } else if (userRole === 'guest') {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Alice', 'Ben', 'Chika'],
          datasets: [{
            label: 'Wins',
            data: [9, 7, 6],
            backgroundColor: ['#17a2b8', '#6f42c1', '#20c997'],
            borderColor: ['#138496', '#5936a1', '#1aa179'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Wins' } },
            x: { title: { display: true, text: 'Players' } }
          }
        }
      });
    }
  }

  // (Other logic like tournament generation and match scheduling continues...)

});
