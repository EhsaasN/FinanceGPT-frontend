import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import LandingPage from './components/LandingPage';
import AuthSuccess from './components/AuthSuccess';
import TeamSection from './components/Team'; // Import the new Team component
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = () => {
            try {
                const storedUser = localStorage.getItem('fgpt_user');
                const storedLoginStatus = localStorage.getItem('fgpt_isLoggedIn');
                
                if (storedUser && storedLoginStatus === 'true') {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Error loading user session:', error);
                localStorage.removeItem('fgpt_user');
                localStorage.removeItem('fgpt_isLoggedIn');
            } finally {
                setIsLoading(false);
            }
        };

        checkUserSession();
    }, []);

    const handleLoginSuccess = (userData) => {
        localStorage.setItem('fgpt_user', JSON.stringify(userData));
        localStorage.setItem('fgpt_isLoggedIn', 'true');
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('fgpt_user');
        localStorage.removeItem('fgpt_isLoggedIn');
        localStorage.removeItem('authToken');
        setUser(null);
        setIsLoggedIn(false);
    };

    if (isLoading) {
        return (
            <ThemeProvider>
                <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="/auth/success" element={<AuthSuccess />} />
                    {/* Add the new route for the team page */}
                    <Route path="/team" element={<TeamSection />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
