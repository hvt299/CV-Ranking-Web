import { ROUTES } from '@/constants/routes';
import Cookies from 'js-cookie';

export const clearAllAuthData = () => {
    Cookies.remove('token');
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token', { domain: 'localhost' });
    Cookies.remove('token', { domain: '.localhost' });
    
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('auth');
    }
};

export const forceLogoutAllUsers = () => {
    clearAllAuthData();
    
    if (typeof window !== 'undefined') {
        window.location.href = ROUTES.LOGIN;
    }
};