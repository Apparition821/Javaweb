let currentUsername = '';

document.addEventListener('DOMContentLoaded', function() {
    if (Auth.isLoggedIn()) {
        window.location.href = 'profile.html';
        return;
    }
    

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Bitte füllen Sie alle Felder aus!');
        return;
    }
    
    const submitButton = document.querySelector('#loginForm button');
    submitButton.disabled = true;
    submitButton.textContent = 'Anmeldung läuft...';
    
    try {
        const result = await API.login({
            username: username,
            password: password
        });
        
        if (result.token) {
            Auth.saveToken(result.token);
            alert('Anmeldung erfolgreich!');
            window.location.href = 'profile.html';
        } else if (result.error === 'EMAIL_NOT_VERIFIED') {
            currentUsername = username;
            showVerificationSection();
            alert('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.');
        } else {
            alert(result.error || 'Anmeldung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Anmeldefehler:', error);
        alert('Anmeldung fehlgeschlagen, bitte versuchen Sie es erneut');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Anmelden';
    }
}

function showVerificationSection() {
    const html = `
        <div class="verification-section" id="verificationSection">
            <h3>E-Mail Bestätigung</h3>
            <p>Wir haben einen Bestätigungscode an Ihre E-Mail gesendet:</p>
            <input type="text" class="verification-input" id="verificationCode" 
                   placeholder="6-stelliger Code" maxlength="6">
            <div class="verification-buttons">
                <button onclick="verifyEmail()">Bestätigen</button>
                <button onclick="resendCode()">Code erneut senden</button>
                <button onclick="cancelVerification()">Abbrechen</button>
            </div>
        </div>
    `;
    
    document.getElementById('loginForm').insertAdjacentHTML('afterend', html);
}

async function verifyEmail() {
    const code = document.getElementById('verificationCode').value;
    
    if (!code || code.length !== 6) {
        alert('Bitte geben Sie den 6-stelligen Code ein');
        return;
    }
    
    try {
        const result = await API.verifyEmail({
            username: currentUsername,
            code: code
        });
        
        if (result.message) {
            alert('E-Mail erfolgreich bestätigt! Sie können sich jetzt anmelden.');
            hideVerificationSection();
        } else {
            alert(result.error || 'Bestätigung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Bestätigungsfehler:', error);
        alert('Bestätigung fehlgeschlagen, bitte versuchen Sie es erneut');
    }
}

async function resendCode() {
    try {
        const result = await API.resendVerification(currentUsername);
        alert(result.message || 'Bestätigungscode wurde erneut gesendet!');
    } catch (error) {
        console.error('Sende Fehler:', error);
        alert('Fehler beim Senden des Codes, bitte versuchen Sie es erneut');
    }
}

function cancelVerification() {
    hideVerificationSection();
}

function hideVerificationSection() {
    const section = document.getElementById('verificationSection');
    if (section) {
        section.remove();
    }
    currentUsername = '';
}