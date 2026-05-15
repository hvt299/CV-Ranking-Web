import Cookies from 'js-cookie';

export const clearAllAuthData = () => {
    // Clear all possible cookie variations
    Cookies.remove('token');
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token', { domain: 'localhost' });
    Cookies.remove('token', { domain: '.localhost' });
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        
        // Clear sessionStorage too
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('auth');
    }
};

export const forceLogoutAllUsers = () => {
    clearAllAuthData();
    
    // Redirect to login
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};