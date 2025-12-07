document.addEventListener('DOMContentLoaded', function() {
    const logoutLinks = document.querySelectorAll('a[href="home.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Möchten Sie sich wirklich abmelden?')) {
                Auth.logout();
            }
        });
    });
    
    if (Auth.isLoggedIn()) {
        updateUserDisplay();
    }
});

async function updateUserDisplay() {
    try {
        const user = await API.getProfile();
        const userDropdown = document.querySelector('.dropdown-toggle');
        if (userDropdown && user) {
            userDropdown.innerHTML = user.username + ' 👤';
        }
    } catch (error) {
        console.error('Failed to get user profile:', error);
    }
}