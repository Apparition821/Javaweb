document.addEventListener('DOMContentLoaded', function() {
    if (!Auth.isLoggedIn()) {
        alert('Bitte melden Sie sich zuerst an!');
        window.location.href = 'login.html';
        return;
    }
    
    const passwordForm = document.getElementById('changePasswordForm');
    passwordForm.addEventListener('submit', handlePasswordChange);
    
    document.getElementById('newPassword').addEventListener('input', checkPasswordStrength);
    document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);
});

async function handlePasswordChange(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!validatePasswordForm(currentPassword, newPassword, confirmPassword)) {
        return;
    }
    
    const submitButton = document.querySelector('#changePasswordForm button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Wird geändert...';
    
    try {
        const result = await API.changePassword({
            oldPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        });
        
        if (result.message) {
            alert('Passwort erfolgreich geändert!');
            window.location.href = 'profile.html';
        } else {
            alert(result.error || 'Passwortänderung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Passwortänderungsfehler:', error);
        alert('Fehler beim Ändern des Passworts');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Passwort aktualisieren';
    }
}

function validatePasswordForm(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Bitte füllen Sie alle Felder aus!');
        return false;
    }
    
    if (newPassword.length < 6) {
        alert('Das neue Passwort muss mindestens 6 Zeichen lang sein!');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Die neuen Passwörter stimmen nicht überein!');
        return false;
    }
    
    return true;
}

function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    strengthBar.style.width = strength + '%';
    
    if (strength < 50) {
        strengthBar.style.background = 'red';
    } else if (strength < 75) {
        strengthBar.style.background = 'orange';
    } else {
        strengthBar.style.background = 'green';
    }
}

function checkPasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('passwordMatchError');
    
    if (confirmPassword && newPassword !== confirmPassword) {
        errorElement.textContent = 'Passwörter stimmen nicht überein';
    } else {
        errorElement.textContent = '';
    }
}