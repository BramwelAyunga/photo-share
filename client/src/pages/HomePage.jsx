import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment, FaStar, FaImage, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import React, { useState, useRef, useEffect } from 'react';

const fetchMedia = async ({ pageParam = 1, searchTerm }) => {
    const limit = 10;
    const url = searchTerm
        ? `/api/media/search?q=${searchTerm}&page=${pageParam}&limit=${limit}`
        : `/api/media?page=${pageParam}&limit=${limit}`;
    const { data } = await axios.get(url);
    return { data, nextPage: data.length === limit ? pageParam + 1 : undefined };
};

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const loadMoreRef = useRef(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['publicMedia', searchTerm],
        queryFn: ({ pageParam }) => fetchMedia({ pageParam, searchTerm }),
        // Add a check to ensure lastPage is defined before accessing nextPage
        getNextPageParam: (lastPage) => {
            // lastPage will be the object returned from fetchMedia
            return lastPage?.nextPage;
        },
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }, { threshold: 1.0 }
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (error) return (
        <div className="p-4 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-500 mb-2">Connection Error</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error.message}</p>
            <p className="text-sm text-gray-400">Make sure the API server is running on port 3001</p>
        </div>
    );

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // The query will refetch automatically due to the change in `searchTerm` which is in the queryKey.
    };

    return (
        <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">PhotoShare</h1>
                    <FaSearch
                        className="text-xl cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                    />
                </div>
            </div>

            {isSearchVisible && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search by creator, title, or caption..."
                            className="flex-1 p-2 border rounded-md mr-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Search
                        </button>
                    </form>
                </div>
            )}

            {/* "Create Post" UI - Creator Only */}
            {user && user.role === 'creator' && (
                <div 
                    className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" 
                    onClick={() => navigate('/upload')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400">
                            Share a new photo...
                        </div>
                        <FaImage className="text-blue-500 text-xl" />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="p-10 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading feed...</p>
                </div>
            ) : data && data.pages.some(page => page.data.length > 0) ? (
                <div>
                    {data.pages.map((page, pageIndex) => (
                        <React.Fragment key={pageIndex}>
                            {page.data.map((item) => (
                                <article key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                                    {/* Post Header */}
                                    <div className="flex items-center gap-3 p-4">
                                        <Link to={`/profile/${item.creator_id}`}>
                                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                                                {item.creator_name?.charAt(0).toUpperCase()}
                                            </div>
                                        </Link>
                                        <div className="flex-1">
                                            <Link 
                                                to={`/profile/${item.creator_id}`} 
                                                className="font-semibold hover:underline dark:text-white"
                                            >
                                                {item.creator_name}
                                            </Link>
                                            {item.location && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-xs" /> {item.location}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Post Image */}
                                    <Link to={`/media/${item.id}`}>
                                        <img 
                                            src={item.thumbnail_blob_url || item.blob_url} 
                                            alt={item.title} 
                                            className="w-full object-cover bg-gray-100 dark:bg-gray-900"
                                            style={{ maxHeight: '500px' }}
                                        />
                                    </Link>

                                    {/* Post Actions & Info */}
                                    <div className="p-4">
                                        {/* Stats */}
                                        <div className="flex items-center gap-6 mb-3">
                                            <Link 
                                                to={`/media/${item.id}`} 
                                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                <FaRegComment className="text-xl" />
                                                <span className="text-sm">{item.comment_count || 0}</span>
                                            </Link>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <FaStar className="text-xl text-yellow-500" />
                                                <span className="text-sm font-medium">{parseFloat(item.average_rating || 0).toFixed(1)}</span>
                                            </div>
                                        </div>

                                        {/* Title & Caption */}
                                        <Link to={`/media/${item.id}`}>
                                            <h3 className="font-semibold dark:text-white mb-1">{item.title}</h3>
                                            {item.caption && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                                    {item.caption}
                                                </p>
                                            )}
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </React.Fragment>
                    ))}
                    <div ref={loadMoreRef} className="p-6 text-center text-gray-500 dark:text-gray-400">
                        {isFetchingNextPage ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                Loading more...
                            </div>
                        ) : hasNextPage ? (
                            'Scroll to load more'
                        ) : (
                            <p className="text-sm">You've reached the end! 🎉</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center p-10">
                    <div className="text-6xl mb-4">📷</div>
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">
                        {searchTerm ? 'No Results Found' : 'Welcome to PhotoShare!'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm 
                            ? `No media found for "${searchTerm}"` 
                            : 'Discover and share amazing photos from creators around the world.'}
                    </p>
                    {user && user.role === 'creator' && !searchTerm && (
                        <button 
                            onClick={() => navigate('/upload')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                        >
                            Upload Your First Photo
                        </button>
                    )}
                    {!user && !searchTerm && (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-400">Join our community to start exploring!</p>
                            <Link 
                                to="/register" 
                                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default HomePage;
