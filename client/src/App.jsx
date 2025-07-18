import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Signup from './components/signup';
import LandingPage from './components/LandingPage';
import AuthSuccess from './components/AuthSuccess';
import Team from './components/Team';

function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('fgpt_user');
        if (storedUser) {
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
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/team" element={<Team />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route
                    path="/dashboard"
                    element={isLoggedIn ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;