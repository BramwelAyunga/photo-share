import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Comments from '../components/comments/Comments';
import Rating from '../components/ratings/Rating';
import { FaStar, FaMapMarkerAlt, FaUserTag, FaCalendar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const fetchMediaDetails = async (id) => {
    const { data } = await axios.get(`/api/media/${id}`);
    return data;
};

const MediaDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: media, error, isLoading } = useQuery({
        queryKey: ['media', id],
        queryFn: () => fetchMediaDetails(id)
    });

    if (isLoading) return (
        <div className="p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading media...</p>
        </div>
    );
    if (error) return (
        <div className="p-10 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Media</h2>
            <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
        </div>
    );
    if (!media) return (
        <div className="p-10 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">Media Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400">This media item may have been removed.</p>
        </div>
    );

    // Parse people if it's a string
    const people = media.people ? (typeof media.people === 'string' ? JSON.parse(media.people) : media.people) : [];

    return (
        <>
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 p-4 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <h1 className="text-xl font-bold">Photo</h1>
                </div>
            </div>

            {/* Image */}
            <div className="bg-black">
                <img 
                    src={media.blob_url} 
                    alt={media.title} 
                    className="w-full object-contain mx-auto" 
                    style={{ maxHeight: '70vh' }} 
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Creator Info */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {media.creator_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <Link 
                            to={`/profile/${media.user_id || media.creator_id}`} 
                            className="font-semibold hover:underline dark:text-white"
                        >
                            {media.creator_name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FaCalendar className="text-xs" />
                            {new Date(media.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-2 dark:text-white">{media.title}</h2>

                {/* Caption */}
                {media.caption && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{media.caption}</p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {media.location && (
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            <FaMapMarkerAlt className="text-red-500" />
                            {media.location}
                        </span>
                    )}
                </div>

                {/* People Tagged */}
                {people && people.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                            <FaUserTag /> People in this photo
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {people.map((person, index) => (
                                <span 
                                    key={index} 
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                                >
                                    {person}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rating Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaStar className="text-yellow-500 text-2xl" />
                            <span className="text-2xl font-bold dark:text-white">
                                {parseFloat(media.average_rating || 0).toFixed(1)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                                / 5.0
                            </span>
                        </div>
                        <Rating mediaId={id} />
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <Comments mediaId={id} />
            </div>
        </>
    );
};

export default MediaDetailPage;
