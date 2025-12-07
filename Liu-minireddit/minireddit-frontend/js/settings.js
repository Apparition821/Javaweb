document.addEventListener('DOMContentLoaded', function() {
    if (!Auth.isLoggedIn()) {
        alert('Bitte melden Sie sich zuerst an!');
        window.location.href = 'login.html';
        return;
    }

    loadCurrentSettings();
    
    const settingsForm = document.getElementById('settingsForm');
    settingsForm.addEventListener('submit', handleSettingsSave);
});

async function loadCurrentSettings() {
    try {
        const settings = await API.getSettings();
        setDefaultSettings();
    } catch (error) {
        console.error('Fehler beim Laden der Einstellungen:', error);
        setDefaultSettings();
    }
}

function setDefaultSettings() {
    document.getElementById('profilePublic').checked = true;
    document.getElementById('showEmail').checked = true;
    document.getElementById('allowMessages').checked = true;
    document.getElementById('emailNotifications').checked = true;
    document.getElementById('pushNotifications').checked = false;
    document.getElementById('newsletter').checked = true;
    document.getElementById('theme').value = 'light';
    document.getElementById('language').value = 'de';
}

async function handleSettingsSave(event) {
    event.preventDefault();
    
    const settingsData = {
        privacy: {
            profilePublic: document.getElementById('profilePublic').checked,
            showEmail: document.getElementById('showEmail').checked,
            allowMessages: document.getElementById('allowMessages').checked
        },
        notifications: {
            emailNotifications: document.getElementById('emailNotifications').checked,
            pushNotifications: document.getElementById('pushNotifications').checked,
            newsletter: document.getElementById('newsletter').checked
        },
        appearance: {
            theme: document.getElementById('theme').value,
            language: document.getElementById('language').value
        }
    };
    
    const submitButton = document.querySelector('#settingsForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Wird gespeichert...';
    
    try {
        await API.saveSettings(settingsData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Einstellungen erfolgreich gespeichert!');
        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Speicherfehler:', error);
        alert('Fehler beim Speichern der Einstellungen');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Einstellungen speichern';
    }
}