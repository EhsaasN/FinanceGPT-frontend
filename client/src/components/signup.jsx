import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react'; // Import TrendingUp icon

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setMessage("Please fill in all fields.");
            setMessageType('error');
            return;
        }
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage("Account created successfully! Redirecting to login...");
                setMessageType('success');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setMessage(result.error || "Signup failed. Please try again.");
                setMessageType('error');
            }
        } catch (err) {
            setMessage("Cannot connect to the server. Please try again.");
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
            <div className="absolute top-6 left-6">
                 <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Home</span>
                </button>
            </div>

            {/* --- START: Added Logo and Title --- */}
            <div className="flex items-center justify-center space-x-3 mb-8">
                <TrendingUp className="text-green-400 h-10 w-10" />
                <h1 className="text-3xl font-bold text-white">Finance GPT</h1>
            </div>
            {/* --- END: Added Logo and Title --- */}

            <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-4">Create an Account</h2>
                <p className="text-center text-gray-400 mb-8">Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-green-400 hover:text-green-300">Sign In</button></p>

                {message && (
                    <div className={`text-center mb-6 p-3 rounded-lg text-sm ${messageType === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm" htmlFor="name">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="John Doe" required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="••••••••" required />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-400">OR</span></div>
                </div>

                <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg border border-gray-600 transition-colors">
                     <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Signup;
