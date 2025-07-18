import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

// Self-contained Navbar for the Team page
const Navbar = () => {
    const navigate = useNavigate();
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm p-4 fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                    <TrendingUp className="text-green-400 h-8 w-8" />
                    <h1 className="text-2xl font-bold text-white">Finance GPT</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition-colors">Login</button>
                    <button onClick={() => navigate('/signup')} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    );
};

// GitHub Icon SVG
const GitHubIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);

// LinkedIn Icon SVG
const LinkedInIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);


const Member = ({ image, name, description, github, linkedin }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 transition-all duration-300 ease-in-out shadow-lg hover:transform hover:-translate-y-2 hover:shadow-green-500/20 w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-6">
            <img 
                src={image} 
                alt={`${name}`} 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-600 transition-transform duration-300 hover:scale-105"
            />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-center text-white">{name}</h3>
        <p className="text-sm text-center mb-6 text-gray-400">{description}</p>
        <div className="flex justify-center gap-6 text-gray-400">
            {github && (
                <a href={github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <GitHubIcon />
                </a>
            )}
            {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                    <LinkedInIcon />
                </a>
            )}
        </div>
    </div>
);

function TeamSection() {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
            <Navbar />
            <section className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-400 to-purple-500">Our Team</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 justify-items-center max-w-6xl mx-auto">
                        <Member
                            image="https://placehold.co/96x96/4A5568/E2E8F0?text=EN"
                            name="Ehsaas Nahata"
                            description="245523748018"
                            github="https://github.com/EhsaasN"
                            linkedin="https://linkedin.com/in/ehsaas-nahata-836544347"
                        />
                        <Member
                            image="https://placehold.co/96x96/4A5568/E2E8F0?text=AV"
                            name="Aditya Vidiyala"
                            description="245523748065"
                            github="https://github.com/adityavidiyala"
                            linkedin="https://linkedin.com/in/aditya-vidiyala-45686628b"
                        />
                        <Member
                            image="https://placehold.co/96x96/4A5568/E2E8F0?text=KA"
                            name="Kanduri Adithya"
                            description="245523748091"
                            github="https://github.com/kanduri-adithya"
                            linkedin="https://linkedin.com/in/adithya-kanduri-997547330"
                        />
                        <Member
                            image="https://placehold.co/96x96/4A5568/E2E8F0?text=KS"
                            name="K.P. Srinandana Sarma"
                            description="245523748096"
                            github="https://github.com/Swio9152"
                            linkedin="https://www.linkedin.com/in/srinandana-sarma-923104263"
                        />
                        <Member
                            image="https://placehold.co/96x96/4A5568/E2E8F0?text=SK"
                            name="T Sai Krishna"
                            description="245523748121"
                            github="https://github.com/Sai-Krishna-Nair"
                            linkedin="https://linkedin.com/in/sai-krishna-nair-2b4501306"
                        />
                        <Member
                            image="https://placehold.co/96x96/4A5568/E2E8F0?text=NR"
                            name="Nigama Reddy V"
                            description="245523748124"
                            github="https://github.com/Nigama-Reddy-V"
                            linkedin="https://linkedin.com/in/nigama-reddy-887496300"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TeamSection;
