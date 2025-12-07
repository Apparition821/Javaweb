document.addEventListener('DOMContentLoaded', function() {

    if (!Auth.isLoggedIn()) {
        alert('Bitte melden Sie sich zuerst an!');
        window.location.href = 'login.html';
        return;
    }
    
    loadCurrentProfile();
    
    const editForm = document.getElementById('editProfileForm');
    editForm.addEventListener('submit', handleProfileUpdate);
    
    const avatarUpload = document.getElementById('avatarUpload');
    avatarUpload.addEventListener('change', handleAvatarUpload);
});

async function loadCurrentProfile() {
    try {
        const user = await API.getProfile();
        fillFormWithUserData(user);
    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
        alert('Fehler beim Laden des Profils');
    }
}

function fillFormWithUserData(user) {
    document.getElementById('displayName').value = user.displayName || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('bio').value = user.bio || '';
    document.getElementById('location').value = user.location || '';
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Bitte wählen Sie ein Bild aus!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
        const response = await Auth.fetchWithToken(API.baseURL + '/users/avatar', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Avatar erfolgreich hochgeladen!');
            return result.avatarPath;
        } else {
            alert(result.error || 'Upload fehlgeschlagen');
            return null;
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Fehler beim Hochladen');
        return null;
    }
}

async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Bitte wählen Sie ein Bild aus!');
            return;
        }
    
        if (file.size > 2 * 1024 * 1024) {
            alert('Bild darf nicht größer als 2MB sein!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
        
        const avatarPath = await uploadAvatar(file);
        if (avatarPath) {
            console.log('Avatar gespeichert unter:', avatarPath);
        }
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const profileData = {
        displayName: document.getElementById('displayName').value,
        bio: document.getElementById('bio').value,
        location: document.getElementById('location').value
    };
    
    const submitButton = document.querySelector('#editProfileForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Wird gespeichert...';
    
    try {
        const result = await API.updateProfile(profileData);
        
        if (result.message) {
            alert('Profil erfolgreich aktualisiert!');
            window.location.href = 'profile.html';
        } else {
            alert(result.error || 'Aktualisierung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Aktualisierungsfehler:', error);
        alert('Fehler beim Aktualisieren des Profils');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Änderungen speichern';
    }
}