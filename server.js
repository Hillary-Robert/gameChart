const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load users from JSON file
function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, '[]');
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8').trim();
        if (!data) return [];
        return JSON.parse(data);
    } catch (err) {
        console.error('⚠ Error loading users:', err.message);
        return [];
    }
}


// For non existent pages

app.get('/results', (req, res) => res.send('Results page coming soon'));

// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Home - Login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle registration
app.post('/register', (req, res) => {
    try {
        const users = loadUsers();
        const { firstName, lastName, email, username, password, role } = req.body;

        console.log('📥 Registering user:', username);

        const existing = users.find(u => u.username === username || u.email === email);
        if (existing) {
            console.warn('⚠ User already exists:', username);
            return res.status(400).send('User already exists.');
        }

        users.push({ firstName, lastName, email, username, password, role });
        saveUsers(users);

        console.log('✅ User registered:', username);
        res.redirect('/login.html');
    } catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).send('Server error during registration.');
    }
});


// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        console.warn('❌ Login failed for:', username);
        return res.status(401).send('Invalid username or password.');
    }

    console.log('🟢 Logged in as:', username, '| Role:', user.role);

    // Redirect based on role
    switch (user.role.toLowerCase()) {
        case 'admin':
            res.redirect('/admin_dashboard.html');
            break;
        case 'guest':
            res.redirect('/guestDashboard.html');
            break;
        case 'organizer':
            res.redirect('/organizer_dashboard.html');
            break;
        case 'player':
            res.redirect('/playerDashboard.html');
            break;
        default:
            res.status(400).send('Unknown role.');
    }
});

// Optional pages
app.get('/roundrobin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'roundrobin.html'));
});

app.get('/modeplayer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ModeAndPlayer.html'));
});

// Catch-all route
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});