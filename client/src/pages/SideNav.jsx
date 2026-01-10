import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignInAlt, FaUpload, FaSearch, FaStar, FaCamera, FaCompass } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SideNav = () => {
    const { user } = useAuth();
    const location = useLocation();
    
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const linkClass = (path) => `flex items-center space-x-3 text-lg p-3 rounded-full transition-colors ${
        isActive(path) 
            ? 'bg-gray-200 dark:bg-gray-800 font-bold' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

    return (
        <nav className="w-64 p-4 flex flex-col h-screen sticky top-0">
            <div className="text-2xl font-bold p-3 mb-4">📷 PhotoShare</div>
            <div className="space-y-2">
                <Link to="/" className={linkClass('/')}>
                    <FaHome className="text-xl" /> <span>Home</span>
                </Link>
                
                {user ? (
                    <>
                        <Link to={`/profile/${user.id}`} className={linkClass('/profile')}>
                            <FaUser className="text-xl" /> <span>Profile</span>
                        </Link>
                        
                        {/* Creator-specific navigation */}
                        {user.role === 'creator' && (
                            <Link to="/upload" className={linkClass('/upload')}>
                                <FaUpload className="text-xl" /> <span>Upload</span>
                            </Link>
                        )}
                    </>
                ) : (
                    <Link to="/login" className={linkClass('/login')}>
                        <FaSignInAlt className="text-xl" /> <span>Sign In</span>
                    </Link>
                )}
            </div>

            {/* Role Badge */}
            {user && (
                <div className="mt-auto mb-4 p-3">
                    <div className={`p-3 rounded-xl ${
                        user.role === 'creator' 
                            ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800' 
                            : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                    }`}>
                        <div className="flex items-center gap-2 mb-1">
                            {user.role === 'creator' ? (
                                <FaCamera className="text-purple-500" />
                            ) : (
                                <FaUser className="text-blue-500" />
                            )}
                            <span className={`text-sm font-semibold ${
                                user.role === 'creator' ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'
                            }`}>
                                {user.role === 'creator' ? 'Creator Account' : 'Consumer Account'}
                            </span>
                        </div>
                        <p className={`text-xs ${
                            user.role === 'creator' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                            {user.role === 'creator' 
                                ? 'You can upload & share photos' 
                                : 'Browse, comment & rate'}
                        </p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default SideNav;