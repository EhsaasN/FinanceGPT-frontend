import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Bot, User, ArrowRight, TrendingUp, Paperclip, XCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import SettingsModal from './SettingsModal';

// This is a placeholder hook. Replace with your actual implementation if you have one.
const useUserData = (user) => {
    return { userName: user?.name || 'User' };
};

// --- START: Deployment Configuration ---
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;
// --- END: Deployment Configuration ---


const Dashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);
    const { userName } = useUserData(user);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        setShowProfileMenu(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowProfileMenu(false);
        }, 200);
        setHoverTimeout(timeout);
    };


    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (user?.id) {
            loadChatHistory();
        }
    }, [user]);

    const loadChatHistory = async () => {
        setIsLoading(true);
        try {
            // Use the VITE_BACKEND_URL for fetching chat history
            const response = await fetch(`${BACKEND_URL}/api/chats/${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch chat history');
            const data = await response.json();

            if (data.chats && data.chats.length > 0) {
                const chatMessages = [];
                data.chats.forEach(chat => {
                    const documentFile = chat.documentName ? { name: chat.documentName, type: chat.documentType, size: chat.documentSize } : null;
                    chatMessages.push({ id: `user-${chat.id}`, text: chat.userMessage, sender: 'user', file: documentFile });
                    chatMessages.push({ id: `bot-${chat.id}`, text: chat.assistantReply, sender: 'bot' });
                });
                setMessages(chatMessages);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([{ id: 'error-1', text: "Could not load chat history.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleSend = async () => {
        if (input.trim() === '' && !uploadedFile) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user', file: uploadedFile };
        setMessages(prev => [...prev, userMessage]);
        
        const currentInput = input;
        const currentFile = uploadedFile;
        setInput('');
        setUploadedFile(null);
        setIsLoading(true);

        try {
            if (currentFile) {
                const formData = new FormData();
                formData.append("file", currentFile);
                // Use the FastAPI backend URL for file uploads
                await fetch(`${FASTAPI_URL}/upload`, { method: "POST", body: formData });
            }

            const chatRequestBody = {
                userId: user.id,
                message: currentInput,
                history: messages.map(m => m.text)
            };
            if (currentFile) {
                chatRequestBody.documentName = currentFile.name;
                chatRequestBody.documentType = currentFile.type;
                chatRequestBody.documentSize = currentFile.size;
            }

            // Use the FastAPI backend URL for sending chat messages
            const response = await fetch(`${FASTAPI_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chatRequestBody)
            });

            if (!response.ok) throw new Error('Chat API response was not ok');

            const data = await response.json();
            const botResponse = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorResponse = { id: Date.now() + 1, text: "Sorry, I couldn't connect to the server.", sender: 'bot' };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogout = () => {
        if(onLogout) {
            onLogout();
        }
        navigate('/login');
    }

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <aside className={`bg-gray-800 p-4 flex flex-col border-r border-gray-700 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                 <div className="flex items-center justify-between mb-8">
                    {!isSidebarCollapsed && (
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="text-green-400 h-8 w-8" />
                            <h1 className="text-2xl font-bold text-white">Finance GPT</h1>
                        </div>
                    )}
                     <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-700">
                        {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>
                <nav className="flex-grow">
                    <h2 className={`text-xs text-gray-400 uppercase font-semibold mb-3 ${isSidebarCollapsed ? 'text-center' : ''}`}>{isSidebarCollapsed ? 'Chats' : 'Chats'}</h2>
                    <a href="#" className={`flex items-center p-2 bg-gray-700 rounded-lg text-white ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <MessageSquare className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                        {!isSidebarCollapsed && 'Market Analysis'}
                    </a>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="p-4 flex justify-end items-center border-b border-gray-700 bg-gray-900">
                     <div 
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer"
                        >
                             <span className="text-lg font-semibold text-white">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </span>
                        </div>
                        <ProfileMenu 
                            showProfileMenu={showProfileMenu}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseLeave={handleMouseLeave}
                            onSettingsClick={() => setShowSettingsModal(true)}
                            onLogout={handleLogout}
                        />
                     </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {messages.length === 0 && !isLoading && (
                         <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Bot size={48} className="mb-4" />
                            <h2 className="text-2xl font-semibold">Welcome to Finance GPT</h2>
                            <p>Ask me anything or upload a document to get started.</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 my-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && (<div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center"><Bot className="h-6 w-6 text-white" /></div>)}
                            <div className={`p-4 rounded-2xl max-w-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                {msg.file && <div className="mb-2 p-2 bg-black/20 rounded-md text-sm flex items-center gap-2"> <Paperclip size={16} /> <span>{msg.file.name}</span></div>}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && (<div className="flex-shrink-0 h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center"><User className="h-6 w-6 text-white" /></div>)}
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                        <div className="flex items-start gap-4 my-4">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center"><Bot className="h-6 w-6 text-white" /></div>
                            <div className="p-4 rounded-2xl max-w-lg bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
                                <Loader2 className="animate-spin mr-2" /> Typing...
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-6 bg-gray-800 border-t border-gray-700">
                    {uploadedFile && (
                        <div className="mb-2 p-2 bg-gray-600 rounded-md text-sm flex justify-between items-center">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Paperclip size={16} className="flex-shrink-0" />
                                <span className="truncate">{uploadedFile.name}</span>
                                <span className="text-gray-400 text-xs flex-shrink-0">({(uploadedFile.size / 1024).toFixed(2)} KB)</span>
                            </div>
                            <button onClick={() => setUploadedFile(null)} className="text-gray-400 hover:text-white"><XCircle size={18} /></button>
                        </div>
                    )}
                    <div className="flex items-center bg-gray-700 rounded-full p-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => fileInputRef.current.click()} className="p-3 text-gray-400 hover:text-white transition-colors rounded-full"><Paperclip /></button>
                        {/* --- START: Updated Textarea Styling --- */}
                        <textarea 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyPress={(e) => {if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}} 
                            rows="1" 
                            className="flex-1 bg-transparent outline-none border-none focus:ring-0 px-4 text-white resize-none" 
                            placeholder="Ask about stocks, or attach a document..." 
                        />
                        {/* --- END: Updated Textarea Styling --- */}
                        <button onClick={handleSend} disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded-full transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                            <ArrowRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </main>
             {showSettingsModal && (
                <SettingsModal
                    showSettingsModal={showSettingsModal}
                    user={user}
                    userName={userName}
                    onClose={() => setShowSettingsModal(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;