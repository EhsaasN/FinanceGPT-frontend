import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
            console.error('OAuth authentication failed:', error);
            navigate('/login?error=' + encodeURIComponent(error));
            return;
        }

        if (!token) {
            navigate('/login?error=no_token');
            return;
        }

        // Store token
        localStorage.setItem('authToken', token);

        // Fetch user profile
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Profile fetch failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.user) {
                localStorage.setItem('fgpt_user', JSON.stringify(data.user));
                localStorage.setItem('fgpt_isLoggedIn', 'true');
                navigate('/dashboard', { replace: true });
            } else {
                throw new Error('User data missing');
            }
        })
        .catch(err => {
            console.error('AuthSuccess profile fetch error:', err.message);
            navigate('/login?error=profile_fetch_failed');
        });

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
