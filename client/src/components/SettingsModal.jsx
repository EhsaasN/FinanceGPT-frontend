// client/src/components/SettingsModal.jsx
import { useState } from 'react'
// Removed import for useTheme as theme toggle is removed
// import { useTheme } from '../contexts/ThemeContext.jsx' 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function SettingsModal({ showSettingsModal, onClose, user, userName }) {
    const [activeSettingsTab, setActiveSettingsTab] = useState('profile')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

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
            <div className="rounded-xl shadow-lg w-full max-w-3xl h-[600px] overflow-hidden flex modal-shadow bg-gray-900">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 border-r border-gray-700">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                        <button
                            onClick={handleCloseSettings}
                            className="transition-colors text-gray-400 hover:text-white rounded-lg p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-white">Settings</h2>
                    </div>

                    {/* Sidebar Menu */}
                    <div className="p-2">
                        <button
                            onClick={() => setActiveSettingsTab('profile')}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                                activeSettingsTab === 'profile'
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <svg className={`w-4 h-4 ${activeSettingsTab === 'profile' ? 'text-white' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm">Profile Information</span>
                        </button>

                        <button
                            onClick={() => setActiveSettingsTab('password')}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                                activeSettingsTab === 'password'
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <svg className={`w-4 h-4 ${activeSettingsTab === 'password' ? 'text-white' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm">Change Password</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-900">
                    <div className="p-6">
                        {activeSettingsTab === 'profile' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-6 text-white">Profile Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-500">
                                            <span className="text-3xl font-bold text-white">
                                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-400">Name</label>
                                        <div className="rounded-lg px-4 py-3 bg-gray-700 border border-gray-600 text-white">
                                            {userName || 'Not available'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                                        <div className="rounded-lg px-4 py-3 bg-gray-700 border border-gray-600 text-white">
                                            {user?.email || 'Not available'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSettingsTab === 'password' && (
                            <div>
                                <h3 className="text-xl font-semibold mb-6 text-white">Change Password</h3>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-400">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full rounded-lg px-4 py-3 focus:outline-none bg-gray-700 border border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-400">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full rounded-lg px-4 py-3 focus:outline-none bg-gray-700 border border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-400">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-lg px-4 py-3 focus:outline-none bg-gray-700 border border-gray-600 text-white focus:border-green-500 focus:ring-green-500"
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
                                        className="font-medium py-3 px-6 rounded-lg transition-colors bg-green-500 text-white hover:bg-green-600"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal;