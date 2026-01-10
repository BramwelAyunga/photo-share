import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaCamera, FaUser } from 'react-icons/fa';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('consumer');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Basic validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        setIsLoading(true);
        try {
            await register(email, password, username, role);
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-4 py-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">📷</div>
                    <h1 className="text-3xl font-bold mb-2 dark:text-white">Join PhotoShare</h1>
                    <p className="text-gray-500 dark:text-gray-400">Create your free account</p>
                </div>

                {/* Role Selection Toggle */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">I want to join as:</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole('consumer')}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                role === 'consumer'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <FaUser className={`text-2xl mx-auto mb-2 ${role === 'consumer' ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`font-semibold ${role === 'consumer' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>Consumer</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Browse & interact</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('creator')}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                role === 'creator'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <FaCamera className={`text-2xl mx-auto mb-2 ${role === 'creator' ? 'text-purple-500' : 'text-gray-400'}`} />
                            <p className={`font-semibold ${role === 'creator' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>Creator</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload & share</p>
                        </button>
                    </div>
                </div>

                {/* Features Badge */}
                <div className={`rounded-xl p-4 mb-6 border ${
                    role === 'consumer' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                        : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                }`}>
                    <p className={`text-sm font-medium mb-2 ${
                        role === 'consumer' ? 'text-blue-800 dark:text-blue-300' : 'text-purple-800 dark:text-purple-300'
                    }`}>
                        {role === 'consumer' ? 'As a Consumer, you can:' : 'As a Creator, you can:'}
                    </p>
                    <ul className={`text-sm space-y-1 ${
                        role === 'consumer' ? 'text-blue-700 dark:text-blue-400' : 'text-purple-700 dark:text-purple-400'
                    }`}>
                        {role === 'consumer' ? (
                            <>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Browse photos from creators</li>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Search by title, caption, or creator</li>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Leave comments on photos</li>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Rate photos (1-5 stars)</li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Upload photos & videos</li>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Add titles, captions & locations</li>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> Tag people in your media</li>
                                <li className="flex items-center gap-2"><FaCheck className="text-green-500 text-xs" /> All consumer features included</li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl px-8 py-8 border border-gray-200 dark:border-gray-800">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className="mb-5">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="username">
                            Display Name
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            id="username"
                            type="text"
                            placeholder="Your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={2}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </form>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
                    By registering, you agree to our terms of service.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
