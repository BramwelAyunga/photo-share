import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation, Link } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login,
        // which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Show access denied message for unauthorized roles
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold dark:text-white mb-2">Access Denied</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        This feature is only available for <span className="font-semibold text-purple-500">Creator</span> accounts.
                        Consumer accounts can browse, search, comment, and rate photos.
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/" 
                            className="block w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                            Browse Photos
                        </Link>
                        <p className="text-sm text-gray-400">
                            Want to become a creator? Contact the administrator.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
