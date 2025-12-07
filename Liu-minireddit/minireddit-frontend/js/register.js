let currentUsername = '';

document.addEventListener('DOMContentLoaded', function () {
    if (Auth.isLoggedIn()) {
        window.location.href = 'profile.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', handleRegister);
});

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    if (!username || !email || !password) {
        alert('Bitte füllen Sie alle Felder aus!');
        return;
    }

    if (password.length < 6) {
        alert('Passwort muss mindestens 6 Zeichen lang sein！');
        return;
    }

    if (!this.isValidEmail(email)) {
        this.showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
    }

    const submitButton = document.querySelector('#registerForm button');
    submitButton.disabled = true;
    submitButton.textContent = 'Wird registriert...';

    try {
        const result = await API.register({
            username: username,
            email: email,
            password: password
        });

        if (result.message) {
            if (result.needsVerification) {
                currentUsername = username;
                showVerificationSection();
                alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für den Bestätigungscode.');
            } else {
                alert('Registrierung erfolgreich! Bitte melden Sie sich an');
                window.location.href = 'login.html';
            }
        } else {
            alert(result.error || 'Registrierung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Registieren';
    }
}


function showVerificationSection() {
    const html = `
        <div class="verification-section" id="verificationSection">
            <h3>E-Mail Bestätigung</h3>
            <p>Wir haben einen Bestätigungscode an Ihre E-Mail gesendet. Bitte geben Sie ihn unten ein.</p>
            <input type="text" class="verification-input" id="verificationCode" 
                   placeholder="6-stelliger Code" maxlength="6">
            <div class="verification-buttons">
                <button onclick="verifyEmail()">Bestätigen</button>
                <button onclick="resendCode()">Code erneut senden</button>
                <button onclick="cancelVerification()">Abbrechen</button>
            </div>
        </div>
    `;

    document.getElementById('registerForm').style.display = 'none';
    document.querySelector('.auth-container').insertAdjacentHTML('beforeend', html);
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
            window.location.href = 'login.html';
        } else {
            alert(result.error || 'Bestätigung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Bestätigung fehlgeschlagen:', error);
        alert('Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
}

async function resendCode() {
    try {
        const result = await API.resendVerification(currentUsername);
        alert(result.message || 'Bestätigungscode wurde erneut gesendet！');
    } catch (error) {
        console.error('Resend error:', error);
        alert('Fehler beim Senden des Codes. Bitte versuchen Sie es erneut.');
    }
}

function cancelVerification() {
    const section = document.getElementById('verificationSection');
    if (section) {
        section.remove();
    }
    document.getElementById('registerForm').style.display = 'block';
    currentUsername = '';
}