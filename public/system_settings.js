document.addEventListener('DOMContentLoaded', function () {
  const settingsForm = document.getElementById('settingsForm');
  const clearLocalBtn = document.getElementById('clearLocalStorage');

  const defaultSettings = {
    appName: 'Tournament Manager',
    theme: 'light',
    maxUsers: 50
  };

  function applyTheme(theme) {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }

  function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('systemSettings')) || defaultSettings;
    document.getElementById('appName').value = savedSettings.appName;
    document.getElementById('theme').value = savedSettings.theme;
    document.getElementById('maxUsers').value = savedSettings.maxUsers;
    applyTheme(savedSettings.theme);
  }

  function saveSettings(e) {
    e.preventDefault();
    const settings = {
      appName: document.getElementById('appName').value.trim(),
      theme: document.getElementById('theme').value,
      maxUsers: parseInt(document.getElementById('maxUsers').value)
    };
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    applyTheme(settings.theme);
    alert('✅ Settings saved successfully.');
  }

  function clearLocalData() {
    if (confirm('Are you sure you want to clear all local data?')) {
      localStorage.clear();
      alert('✅ Local storage cleared.');
      location.reload();
    }
  }

  settingsForm.addEventListener('submit', saveSettings);
  clearLocalBtn.addEventListener('click', clearLocalData);

  loadSettings();
});