import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Signup from './components/signup';
import LandingPage from './components/LandingPage';
import AuthSuccess from './components/AuthSuccess';
import Team from './components/Team';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css'; // This line fixes the theme toggle and background issues.

// A new component to contain the routes, allowing it to use the `useNavigate` hook.
const AppRoutes = ({ user, isLoggedIn, handleLoginSuccess, handleLogout }) => {
    const navigate = useNavigate();

    // This single handler will be used by both manual and Google login.
    // It updates the parent state and then handles navigation.
    const onLogin = (userData) => {
        handleLoginSuccess(userData);
        navigate('/dashboard');
    };

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={onLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/team" element={<Team />} />
            <Route path="/auth/success" element={<AuthSuccess onLoginSuccess={onLogin} />} />
            <Route
                path="/dashboard"
                element={isLoggedIn ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
            />
            {/* A catch-all to prevent invalid routes */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

// Main App component
function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // This effect runs on initial load to check if the user is already logged in.
        const storedUser = localStorage.getItem('fgpt_user');
        const loggedInStatus = localStorage.getItem('fgpt_isLoggedIn') === 'true';
        if (loggedInStatus && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
            localStorage.setItem('fgpt_user', JSON.stringify(userData));
            localStorage.setItem('fgpt_isLoggedIn', 'true');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('fgpt_user');
        localStorage.removeItem('fgpt_isLoggedIn');
        localStorage.removeItem('authToken');
    };

    return (
        <ThemeProvider>
            <Router>
                <AppRoutes
                    user={user}
                    isLoggedIn={isLoggedIn}
                    handleLoginSuccess={handleLoginSuccess}
                    handleLogout={handleLogout}
                />
            </Router>
        </ThemeProvider>
    );
}

export default App;