import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Signup from './components/signup';
import LandingPage from './components/LandingPage';
import AuthSuccess from './components/AuthSuccess';
import Team from './components/Team';
import { ThemeProvider } from './contexts/ThemeContext';

// We create a new component to house the routes and use the useNavigate hook.
const AppRoutes = ({ user, isLoggedIn, handleLoginSuccess, handleLogout }) => {
    const navigate = useNavigate();

    // This new handler will be passed to the login components.
    // It updates the state and then navigates.
    const onLogin = (userData) => {
        handleLoginSuccess(userData);
        navigate('/dashboard');
    };
    
    // This handler is for Google Auth, which navigates from AuthSuccess
     const onAuthSuccess = (userData) => {
        handleLoginSuccess(userData);
        // The navigate is already handled in AuthSuccess, but this completes the state update
    };


    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLoginSuccess={onLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/team" element={<Team />} />
            <Route path="/auth/success" element={<AuthSuccess onLoginSuccess={onAuthSuccess}/>} />
            <Route
                path="/dashboard"
                element={isLoggedIn ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
            />
            {/* Add a catch-all route to redirect to login if logged out, or dashboard if logged in */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
        </Routes>
    );
};

function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('fgpt_user');
        const loggedInStatus = localStorage.getItem('fgpt_isLoggedIn') === 'true';
        if (loggedInStatus && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('fgpt_user', JSON.stringify(userData));
        localStorage.setItem('fgpt_isLoggedIn', 'true');
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