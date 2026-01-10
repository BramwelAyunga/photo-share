import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaImage, FaStar, FaRegComment, FaSignOutAlt, FaArrowLeft, FaUser, FaHeart, FaBookmark, FaSearch } from 'react-icons/fa';

// Fetches user profile data (id, name, role)
const fetchUserProfile = async (userId) => {
    const { data } = await axios.get(`/api/users/${userId}`);
    return data;
};

// Fetches media uploaded by a specific user
const fetchUserMedia = async (userId) => {
    const { data } = await axios.get(`/api/users/${userId}/media`);
    return data;
};

const ProfilePage = () => {
    const { userId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Query for fetching the profile data of the user whose page is being viewed
    const { data: profileData, error: profileError, isLoading: isProfileLoading } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => fetchUserProfile(userId),
    });

    // Query for fetching the media, but only enable it if the user is a 'creator'
    const { data: media, error: mediaError, isLoading: isMediaLoading } = useQuery({
        queryKey: ['userMedia', userId],
        queryFn: () => fetchUserMedia(userId),
        // This query will only run if profileData exists and the user's role is 'creator'
        enabled: !!profileData && profileData.role === 'creator',
    });

    const isOwnProfile = user && user.id === parseInt(userId, 10);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (isProfileLoading) return (
        <div className="p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
    );
    if (profileError) return (
        <div className="p-10 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Profile</h2>
            <p className="text-gray-500 dark:text-gray-400">{profileError.message}</p>
        </div>
    );

    const isCreator = profileData?.role === 'creator';

    return (
        <div>
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 p-4 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{profileData?.name}</h1>
                        {isCreator && media && (
                            <p className="text-xs text-gray-500">{media.length} posts</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Header */}
            <div className="p-6">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                        isCreator 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}>
                        {profileData?.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold dark:text-white mb-1">{profileData?.name}</h2>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                                isCreator 
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' 
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            }`}>
                                {isCreator ? <FaCamera className="text-xs" /> : '👤'}
                                {isCreator ? 'Creator' : 'Consumer'}
                            </span>
                        </div>

                        {/* Stats for Creators */}
                        {isCreator && media && (
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <span className="font-bold dark:text-white">{media.length}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">photos</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {isOwnProfile && (
                    <div className="flex gap-3 mt-6">
                        {isCreator && (
                            <button 
                                onClick={() => navigate('/upload')}
                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaCamera /> New Post
                            </button>
                        )}
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Content Section */}
            {isCreator ? (
                <>
                    {/* Tab Header */}
                    <div className="border-t border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center">
                            <button className="flex items-center gap-2 px-6 py-3 border-b-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-medium">
                                <FaImage /> Photos
                            </button>
                        </div>
                    </div>

                    {/* Media Grid */}
                    {isMediaLoading ? (
                        <div className="p-10 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                    ) : mediaError ? (
                        <div className="p-10 text-center text-red-500">Could not load media.</div>
                    ) : media && media.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0.5">
                            {media.map((item) => (
                                <Link 
                                    to={`/media/${item.id}`} 
                                    key={item.id} 
                                    className="relative aspect-square group"
                                >
                                    <img 
                                        src={item.thumbnail_blob_url || item.blob_url} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                                        <span className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" /> 
                                            {parseFloat(item.average_rating || 0).toFixed(1)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaRegComment /> {item.comment_count || 0}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <FaCamera className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No photos yet</p>
                            {isOwnProfile && (
                                <button 
                                    onClick={() => navigate('/upload')}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors"
                                >
                                    Share Your First Photo
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                /* Consumer Profile - Enhanced Dashboard */
                <div className="border-t border-gray-200 dark:border-gray-700">
                    {/* Consumer Stats Banner */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                        <h3 className="text-lg font-bold mb-4">Consumer Dashboard</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white/20 rounded-xl p-3">
                                <FaRegComment className="text-2xl mx-auto mb-1" />
                                <p className="text-xs opacity-80">Comments</p>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3">
                                <FaStar className="text-2xl mx-auto mb-1" />
                                <p className="text-xs opacity-80">Ratings</p>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3">
                                <FaSearch className="text-2xl mx-auto mb-1" />
                                <p className="text-xs opacity-80">Discover</p>
                            </div>
                        </div>
                    </div>

                    {/* Consumer Features */}
                    <div className="p-6">
                        <h4 className="font-semibold dark:text-white mb-4">What you can do</h4>
                        <div className="space-y-3">
                            <Link 
                                to="/" 
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <FaImage className="text-blue-500 text-xl" />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Browse Photos</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Explore content from creators</p>
                                </div>
                            </Link>
                            <Link 
                                to="/" 
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <FaStar className="text-yellow-500 text-xl" />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Rate Content</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Give 1-5 star ratings</p>
                                </div>
                            </Link>
                            <Link 
                                to="/" 
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <FaRegComment className="text-green-500 text-xl" />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Leave Comments</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Share your thoughts</p>
                                </div>
                            </Link>
                            <Link 
                                to="/" 
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                    <FaSearch className="text-purple-500 text-xl" />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Search Media</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Find by title, caption, or creator</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Upgrade Notice - only show on own profile */}
                    {isOwnProfile && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaCamera className="text-purple-500" />
                                    <p className="font-semibold text-purple-800 dark:text-purple-300">Want to share your photos?</p>
                                </div>
                                <p className="text-sm text-purple-700 dark:text-purple-400">
                                    Contact an administrator to upgrade your account to a Creator to start uploading and sharing your own photos with the community.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
