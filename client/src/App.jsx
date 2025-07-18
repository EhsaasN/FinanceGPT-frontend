import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const error = urlParams.get('error');

            if (error) {
                console.error('OAuth authentication failed:', error);
                navigate('/login?error=' + error);
                return;
            }

            if (!token) {
                navigate('/login?error=no_token');
                return;
            }

            try {
                // Store the token immediately
                localStorage.setItem('authToken', token);

                // Fetch user profile
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data?.user) {
                    localStorage.setItem('fgpt_user', JSON.stringify(data.user));
                    localStorage.setItem('fgpt_isLoggedIn', 'true');

                    // Force a full page reload to ensure App.jsx re-initializes and picks up login status
                    window.location.href = '/dashboard'; 
                } else {
                    console.error('User profile not found:', data);
                    navigate('/login?error=profile_fetch_failed');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                navigate('/login?error=profile_fetch_failed');
            }
        };

        handleAuth();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent-primary)' }}></div>
                <p style={{ color: 'var(--text-primary)' }}>Completing authentication...</p>
            </div>
        </div>
    );
}