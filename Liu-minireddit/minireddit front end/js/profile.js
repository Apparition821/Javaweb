document.addEventListener('DOMContentLoaded', function() {
    if (!Auth.isLoggedIn()) {
        alert('Bitte melden Sie sich an, um Ihr Profil zu sehen.');
        window.location.href = 'login.html';
        return;
    }
    
    loadProfile();
    
    const deleteButton = document.querySelector('.btn-outline-danger');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteAccount);
    }
});

async function loadProfile() {
    try {
        const user = await API.getProfile();
        displayProfile(user);
    } catch (error) {
        console.error('Failed to load profile ', error);
        alert('Fehler beim Laden des Profils. Bitte versuchen Sie es erneut.');
    }
}

function displayProfile(user) {
    document.querySelector('h1').textContent = user.displayName || user.username;
    document.querySelector('.text-muted.mb-2').textContent = '@' + user.username;
    
    if (user.mitgliedSeit) {
        const date = new Date(user.mitgliedSeit);
        const formattedDate = date.toLocaleDateString('de-DE');
        document.querySelector('.text-muted.mb-0').textContent = 'Mitglied seit ' + formattedDate;
    }

     if (user.avatarPath) {
        const avatarUrl = '../' + user.avatarPath;
        document.getElementById('avatarPreview').src = avatarUrl;
    } else {
        document.getElementById('avatarPreview').src = '../images/ganadi.jpg';
    }
    
    updateStat('beitraege', user.beitraege);
    updateStat('kommentare', user.kommentare);
    updateStat('karma', user.karma);
    updateStat('gefolgt', user.gefolgt);

    updateInfo('E-Mail:', user.email);
    updateInfo('Bio:', user.bio);
    updateInfo('Standort:', user.location);
    }

function updateStat(type, value) {
    const elements = document.querySelectorAll('.stats-card h4');
    if (type === 'beitraege') {
        elements[0].textContent = value || '0';
    } else if (type === 'kommentare') {
        elements[1].textContent = value || '0';
    } else if (type === 'karma') {
        elements[2].textContent = value || '0';
    } else if (type === 'gefolgt') {
        elements[3].textContent = value || '0';
    }
}

function updateInfo(label, value) {
    const elements = document.querySelectorAll('.mb-4');
    elements.forEach(element => {
        if (element.innerHTML.includes(label)) {
            element.innerHTML = '<strong>' + label + '</strong> ' + (value || 'Nicht angegeben');
        }
    });
}

async function deleteAccount() {
    if (!confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        return;
    }
    
    try {
        const result = await API.deleteAccount();
        if (result.message) {
            alert('Konto erfolgreich gelöscht.');
            Auth.logout();
        } else {
            alert(result.error || 'Löschung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Delete account error:', error);
        alert('Löschung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
}
    


