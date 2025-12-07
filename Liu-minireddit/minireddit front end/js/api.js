const API = {
    baseURL: 'http://localhost:8080/api',
    
    register: async function(userData) {
        const response = await fetch(this.baseURL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    login: async function(credentials) {
        const response = await fetch(this.baseURL + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },
    
    verifyEmail: async function(data) {
        const response = await fetch(this.baseURL + '/auth/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    
    resendVerification: async function(username) {
        const response = await fetch(this.baseURL + '/auth/resend-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username})
        });
        return await response.json();
    },
    
    getProfile: async function() {
        const response = await Auth.fetchWithToken(this.baseURL + '/users/profile', {
            method: 'GET'
        });
        return await response.json();
    },
    
    updateProfile: async function(profileData) {
        const response = await Auth.fetchWithToken(this.baseURL + '/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        return await response.json();
    },
    
    changePassword: async function(passwordData) {
        const response = await Auth.fetchWithToken(this.baseURL + '/users/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        });
        return await response.json();
    },
    
    deleteAccount: async function() {
        const response = await Auth.fetchWithToken(this.baseURL + '/users/account', {
            method: 'DELETE'
        });
        return await response.json();
    }
};