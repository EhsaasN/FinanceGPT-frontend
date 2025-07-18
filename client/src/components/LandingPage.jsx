import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, MessageSquare, Bot, ShieldCheck } from 'lucide-react';

// --- START: Deployment Configuration ---
// Get the documentation URL from environment variables.
// Vite requires the prefix VITE_ for client-side env variables.
const DOCS_URL = import.meta.env.VITE_DOCS_URL || 'https://github.com/Project-School-Group-404/Finance-GPT';
// --- END: Deployment Configuration ---

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <MessageSquare className="h-10 w-10 text-green-400" />,
            title: "DocQnA",
            description: "Upload and analyze financial documents with AI-powered question answering capabilities."
        },
        {
            icon: <TrendingUp className="h-10 w-10 text-blue-400" />,
            title: "News Agent",
            description: "Stay updated with real-time financial news analysis and market insights."
        },
        {
            icon: <Bot className="h-10 w-10 text-purple-400" />,
            title: "General QnA",
            description: "Get instant answers to your financial questions with our intelligent chatbot."
        },
        {
            icon: <ShieldCheck className="h-10 w-10 text-red-400" />,
            title: "Law Agent",
            description: "Navigate complex financial regulations and legal requirements with ease."
        }
    ];

    // Smooth scroll to a section on the same page
    const handleScroll = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative overflow-x-hidden bg-gray-900 text-white font-sans">
            {/* Updated Header with correct navigation */}
            <header className="bg-gray-900/80 backdrop-blur-sm p-4 fixed top-0 left-0 right-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <TrendingUp className="text-green-400 h-8 w-8" />
                        <h1 className="text-2xl font-bold text-white">Finance GPT</h1>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-8 text-gray-300">
                        <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-white transition-colors cursor-pointer">Features</a>
                        {/* This button now navigates to the /team page */}
                        <button onClick={() => navigate('/team')} className="hover:text-white transition-colors">About Us</button>
                        {/* This link now uses the environment variable */}
                        <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Documentation</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition-colors">Login</button>
                        <button onClick={() => navigate('/signup')} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto pt-32 pb-16 px-6 text-center flex flex-col items-center justify-center min-h-screen">
                <div className="absolute inset-0 bg-grid-gray-700/[0.2] bg-gray-900 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
                <div className="relative z-10">
                    {/* --- START: Updated Text --- */}
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-400 to-purple-500">
                        Frontier AI.
                        <br />
                        Your personal AI financial analyst
                    </h2>
                    {/* --- END: Updated Text --- */}
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Leverage the power of AI to analyze market trends, manage your portfolio, and get real-time financial insights. Make smarter decisions with Finance GPT.
                    </p>
                    <button onClick={() => navigate('/login')} className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl transition-transform transform hover:scale-105">
                        Get Started for Free <ArrowRight className="inline ml-2" />
                    </button>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-900/50 relative z-10">
                <div className="container mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center mb-12">Powerful Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map(feature => (
                            <div key={feature.title} className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-2">
                                <div className="mb-4">{feature.icon}</div>
                                <h4 className="text-2xl font-bold mb-2">{feature.title}</h4>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <footer className="bg-gray-900 text-center py-6 relative z-10">
                <p className="text-gray-500">&copy; 2025 Finance GPT. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
