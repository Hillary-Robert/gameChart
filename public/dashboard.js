document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('nav ul li a');
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const page = item.getAttribute('href');
            window.location.href = page;
        });
    });
});

let loginType = 'guest';
function switchLogin(type) {
    loginType = type;
    document.getElementById('guestBtn').classList.toggle('active', type === 'guest');
    document.getElementById('organizerBtn').classList.toggle('active', type === 'organizer');
    document.getElementById('playerBtn').classList.toggle('active', type === 'player');
    document.getElementById('guestMessage').style.display = type === 'guest' ? 'block' : 'none';
    document.getElementById('loginForm').style.display = type !== 'guest' ? 'flex' : 'none';
}

function handleLogin() {
    if (loginType === 'guest') {
        alert('Logged in as Guest');
    } else {
        const contact = document.getElementById('emailOrPhone').value.trim();
        const pass = document.getElementById('password').value.trim();
        if (!contact || !pass) {
            alert('Please enter your email/phone and password.');
        } else {
            alert(`Logged in as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}\nEmail/Phone: ${contact}`);
        }
    }
}
