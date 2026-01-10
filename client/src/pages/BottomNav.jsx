import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignInAlt, FaUpload, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const linkClass = (path) => `text-2xl p-3 rounded-full transition-colors ${
        isActive(path) 
            ? 'text-blue-500 bg-gray-100 dark:bg-gray-800' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

    return (
        <nav className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 flex justify-around items-center p-2 safe-area-pb">
            <Link to="/" className={linkClass('/')}>
                <FaHome />
            </Link>
            
            {user ? (
                <>
                    {/* Creator gets an upload button in the center */}
                    {user.role === 'creator' && (
                        <Link 
                            to="/upload" 
                            className="text-2xl p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            <FaPlusCircle />
                        </Link>
                    )}
                    
                    {/* Profile link with role indicator */}
                    <Link 
                        to={`/profile/${user.id}`} 
                        className={`relative ${linkClass('/profile')}`}
                    >
                        <FaUser />
                        {/* Small role indicator dot */}
                        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                            user.role === 'creator' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}></span>
                    </Link>
                </>
            ) : (
                <Link to="/login" className={linkClass('/login')}>
                    <FaSignInAlt />
                </Link>
            )}
        </nav>
    );
};

export default BottomNav;