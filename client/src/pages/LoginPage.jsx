import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        // Show success message from registration
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the state to prevent showing message on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
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
                    <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to continue to PhotoShare</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl px-8 py-8 border border-gray-200 dark:border-gray-800">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <span>✓</span> {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

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
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
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

                    {/* Register Link */}
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold">
                            Create Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
