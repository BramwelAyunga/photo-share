import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

// Add request timeout
axios.defaults.timeout = 10000;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                // Assumes an endpoint that returns the user if a session is active
                const { data } = await axios.get('/api/auth/me');
                setUser(data.user);
            } catch (error) {
                // No active session or an error occurred
                setUser(null);
                console.log('No active session');
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data.user);
        return data;
    };

    const register = async (email, password, name, role = 'consumer') => {
        const { data } = await axios.post('/api/auth/register', { email, password, name, role });
        return data;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    };

    // Don't render children until we've checked the session
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
