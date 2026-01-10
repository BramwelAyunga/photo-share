import SideNav from './SideNav';
import BottomNav from './BottomNav';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="flex justify-center min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
            {/* Side Navigation - visible on md+ screens */}
            <aside className="hidden md:block">
                <SideNav />
            </aside>
            
            {/* Main Content Area */}
            <main className="w-full md:max-w-2xl bg-white dark:bg-black border-x border-gray-200 dark:border-gray-700 min-h-screen pb-16 md:pb-0">
                {children}
            </main>
            
            {/* Right Sidebar - visible on lg+ screens */}
            <aside className="hidden lg:block w-80 p-4">
                <div className="sticky top-4 space-y-4">
                    {/* Welcome Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
                        <h3 className="font-bold text-lg mb-2">📷 PhotoShare</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                            A cloud-native media distribution platform for sharing photos.
                        </p>
                        {!user && (
                            <div className="space-y-2">
                                <Link 
                                    to="/register" 
                                    className="block w-full text-center py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Create Account
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="block w-full text-center py-2 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
                        <h4 className="font-bold mb-3">Features</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Creator & Consumer accounts
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Photo uploads with metadata
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Comments & ratings
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Search functionality
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Cloud-native architecture
                            </li>
                        </ul>
                    </div>

                    {/* User Roles Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
                        <h4 className="font-bold mb-3">User Roles</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded text-xs font-medium">Creator</span>
                                <p className="text-gray-600 dark:text-gray-400">Upload photos with title, caption, location & tags</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">Consumer</span>
                                <p className="text-gray-600 dark:text-gray-400">Browse, search, comment & rate photos</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-gray-400 px-2">
                        <p>Cloud Computing Coursework</p>
                        <p className="mt-1">Scalable Web Application</p>
                    </div>
                </div>
            </aside>
            
            {/* Bottom Navigation - visible on mobile */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <BottomNav />
            </footer>
        </div>
    );
};

export default MainLayout;