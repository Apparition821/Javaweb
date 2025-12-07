
const Auth = {
    saveToken: function(token) {
        localStorage.setItem('token', token);
    },
    
    getToken: function() {
        return localStorage.getItem('token');
    },
    
    removeToken: function() {
        localStorage.removeItem('token');
    },
    
    isLoggedIn: function() {
        return this.getToken() !== null;
    },
    
    fetchWithToken: function(url, options) {
        const token = this.getToken();
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['token'] = token;
        return fetch(url, options);
    },
    
    logout: function() {
        this.removeToken();
        window.location.href = 'login.html';
    }
};