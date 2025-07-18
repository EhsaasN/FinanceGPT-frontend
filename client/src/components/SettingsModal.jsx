import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext.jsx'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
function SettingsModal({ showSettingsModal, onClose, user, userName }) {
    const [activeSettingsTab, setActiveSettingsTab] = useState('profile')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    // const { theme, toggleTheme, isDark } = useTheme() // No longer needed for theme toggle

    const handleCloseSettings = () => {
        onClose()
        setActiveSettingsTab('profile')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordMessage('')
    }

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage('All fields are required')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('New passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setPasswordMessage('Password must be at least 6 characters')
            return
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BACKEND_URL}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })

            if (response.ok) {
                setPasswordMessage('Password changed successfully!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                const error = await response.json()
                setPasswordMessage(error.message || 'Failed to change password')
            }
        } catch (error) {
            setPasswordMessage('Network error. Please try again.')
        }
    }

    if (!showSettingsModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
            <div className="rounded-xl shadow-lg w-full max-w-3xl h-[600px] overflow-hidden flex modal-shadow" style={{backgroundColor: 'var(--bg-primary)'}}>
                {/* Sidebar */}
                <div className="w-64" style={{backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)'}}>
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4" style={{borderBottom: '1px solid var(--border-color)'}}>
                        <button
                            onClick={handleCloseSettings}
                            className="transition-colors button-hover rounded-lg p-1" // Added button-hover
                            style={{color: 'var(--text-secondary)'}}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold" style={{color: 'var(--text-primary)'}}>Settings</h2>
                    </div>

                    {/* Sidebar Menu */}
                    <div className="p-2">
                        <button
                            onClick={() => setActiveSettingsTab('profile')}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors button-hover ${ // Added button-hover
                                activeSettingsTab === 'profile'
                                    ? 'text-white'
                                    : 'hover:text-white'
                            }`}
                            style={{
                                backgroundColor: activeSettingsTab === 'profile' ? 'var(--accent-primary)' : 'transparent',
                                color: activeSettingsTab === 'profile' ? 'var(--bg-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm">Profile Information</span>
                        </button>

                        <button
                            onClick={() => setActiveSettingsTab('password')}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors button-hover ${ // Added button-hover
                                activeSettingsTab === 'password'
                                    ? 'text-white'
                                    : 'hover:text-white'
                            }`}
                            style={{
                                backgroundColor: activeSettingsTab === 'password' ? 'var(--accent-primary)' : 'transparent',
                                color: activeSettingsTab === 'password' ? 'var(--bg-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm">Change Password</span>
                        </button>

                        {/* Theme settings removed */}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto" style={{backgroundColor: 'var(--bg-primary)'}}>
                    <div className="p-6">
                        {activeSettingsTab === 'profile' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--text-primary)'}}>Profile Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--accent-primary)'}}>
                                            <span className="text-3xl font-bold" style={{color: 'var(--bg-primary)'}}>
                                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-secondary)'}}>Name</label>
                                        <div className="rounded-lg px-4 py-3" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>
                                            {userName || 'Not available'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-secondary)'}}>Email</label>
                                        <div className="rounded-lg px-4 py-3" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)'}}>
                                            {user?.email || 'Not available'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingsTab === 'password' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--text-primary)'}}>Change Password</h3>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-secondary)'}}>Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full rounded-lg px-4 py-3 focus:outline-none"
                                            style={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-primary)'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-secondary)'}}>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full rounded-lg px-4 py-3 focus:outline-none"
                                            style={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-primary)'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--text-secondary)'}}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-lg px-4 py-3 focus:outline-none"
                                            style={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-primary)'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    {passwordMessage && (
                                        <div className={`text-sm p-3 rounded-lg ${
                                            passwordMessage.includes('successfully')
                                                ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                                                : 'text-red-400 bg-red-400/10 border border-red-400/20'
                                        }`}>
                                            {passwordMessage}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleChangePassword}
                                        className="font-medium py-3 px-6 rounded-lg transition-colors"
                                        style={{backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)'}}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Theme settings tab content removed */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal