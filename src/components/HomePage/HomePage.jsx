import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { roadmapData } from '../RoadmapPage/RoadmapPage';
import { CodeIcon, DSBranchIcon, AlgoIcon, SendIcon, ArticleIcon, CodeConceptsIcon, AboutUsIcon } from '../DSIcons';
import { ClearIcon } from '../../common/Icons';
import genAI from '../../gemini';
import { avatarPaths } from '../ProfilePictureSelector/AvatarIcons';
import ProfilePictureSelector from '../ProfilePictureSelector/ProfilePictureSelector';
import './HomePage.css';

const CircularProgressBar = ({ percentage, onClick }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const getRank = (p) => {
        if (p < 30) return "Beginner";
        if (p < 70) return "Intermediate";
        return "Advanced";
    };
    const rank = getRank(percentage);
    return (
        <div className="progress-rank-container" onClick={onClick} style={{ cursor: 'pointer' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} stroke="var(--border)" strokeWidth="10" fill="transparent" />
                <circle cx="60" cy="60" r={radius} stroke="var(--accent)" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}/>
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="24" fill="var(--primary-text)" fontWeight="600">{`${percentage}%`}</text>
            </svg>
            <div className="rank-label">{rank}</div>
        </div>
    );
};

const DashboardView = ({ userEmail, onLogout, onSelectTopic, onViewDSVisualizer, onViewAlgoVisualizer, onViewCodeVisualizer, onViewTextPage, onViewRoadmap, onViewCodeConcepts, onViewAboutUs, accent }) => {
    const [progress, setProgress] = useState({ completed: new Set(), nextTopic: null });
    const [userData, setUserData] = useState(null);
    const [showEmail, setShowEmail] = useState(false);
    const [showPfpSelector, setShowPfpSelector] = useState(false);
    const userInitial = userData ? userData.username.charAt(0).toUpperCase() : '?';
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [chatSession, setChatSession] = useState(null);
    const [quote, setQuote] = useState({ text: '', author: '' });
    const chatBoxRef = useRef(null);

    useEffect(() => {if (chatBoxRef.current) {chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;}}, [messages, isAiLoading]);

    const quotes = [
        { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
        { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
        { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
        { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
        { text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" },
        { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" }
    ];

    const startNewChat = () => {
        const systemInstruction = `
            You are Rivor AI, an expert and friendly programming tutor integrated into the Rivor Insights web application.
            Your sole purpose is to help users learn about data structures, algorithms, and fundamental programming concepts.
            - Your answers must be concise and directly related to programming, data structures, algorithms, or the features of the Rivor Insights application.
            - IMPORTANT: You must refuse to answer questions about the application's backend, servers, or any non-public implementation details. If asked, politely state, "I can only answer questions about programming concepts and how to use Rivor Insights."
        `;
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            systemInstruction: systemInstruction,
        });
        setChatSession(model.startChat());
        setMessages([]); //clears the messages from the screen
    };
    
    useEffect(() => {startNewChat();}, []);
    
    useEffect(() => {
        const updateQuote = () => {setQuote(quotes[Math.floor(Math.random() * quotes.length)]);};
        updateQuote();
        const intervalId = setInterval(updateQuote, 10000);
        return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) { setUserData(userDocSnap.data()); }
            else {
                setUserData({
                    username: user.email.split('@')[0],
                    email: user.email,
                    avatarId: 0
                });
            }

            const progressDocRef = doc(db, "userProgress", user.uid);
            const progressDocSnap = await getDoc(progressDocRef);
            const completed = progressDocSnap.exists() ? new Set(progressDocSnap.data().completed || []) : new Set();
            let nextTopic = null;
            const allTopics = roadmapData.flatMap(stage => stage.topics);
            for (const topic of allTopics) { if (!completed.has(topic.id)) { nextTopic = topic; break; } }
            setProgress({ completed, nextTopic });
        };
        fetchData();
    }, []);
    
    const handleAvatarSelect = async (avatarId) => {
        const user = auth.currentUser;
        if (!user || !userData) return;
        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, { avatarId: avatarId });
            setUserData({ ...userData, avatarId: avatarId });
        }
        catch (error) { console.error("Error updating avatar:", error); }
    };

    const handleSendMessage = async () => {
        if (!chatSession || userInput.trim() === '' || isAiLoading) return;
        const newUserMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsAiLoading(true);
        try {
            const result = await chatSession.sendMessage(currentInput);
            const response = await result.response;
            const text = response.text();
            const aiResponse = { sender: 'ai', text: text };
            setMessages(prev => [...prev, aiResponse]);
        }
        catch (error) {
            console.error("Error sending message:", error);
            const errorResponse = { sender: 'ai', text: "Something went wrong. Please try again." };
            setMessages(prev => [...prev, errorResponse]);
        }
        finally { setIsAiLoading(false); }
    };

    const handleClearChat = () => {startNewChat();};

    const totalTopics = roadmapData.flatMap(stage => stage.topics).length;
    const progressPercent = totalTopics > 0 ? Math.round((progress.completed.size / totalTopics) * 100) : 0;

    const accentGradients = { // Gradient map for each accent color
        indigo: 'linear-gradient(45deg, #4f46e5, #c084fc)', // Indigo to a bright Lavender
        green: 'linear-gradient(45deg, #16a34a, #bef264)',  // Green to a bright Lime
        pink: 'linear-gradient(45deg, #db2777, #fda4af)',   // Pink to a light Rose
        orange: 'linear-gradient(45deg, #ea580c, #fde047)', // Orange to a bright Saffron Yellow
        cyan: 'linear-gradient(45deg, #0891b2, #16E5E5)',   // Cyan to a bright Sky Blue
    };

    const aiheaderStyle = {
        background: accentGradients[accent] || accentGradients.indigo,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
    };
    
    return(
        <div className="dashboard-grid">
            <div className="dashboard-card profile-card">
                <div className="profile-picture-container" onClick={() => setShowPfpSelector(true)}>
                    {userData && userData.avatarId !== undefined ? (
                        <img src={avatarPaths[userData.avatarId]} alt="User Avatar" />
                    ) : (
                        <div className="profile-picture-placeholder">{userInitial}</div>
                    )}
                </div>
                <h3 onClick={() => setShowEmail(!showEmail)} title="Click to toggle email" style={{ cursor: 'pointer' }}>
                    {userData ? (showEmail ? userData.email : userData.username) : 'Loading...'}
                </h3>
                <CircularProgressBar percentage={progressPercent} onClick={onViewRoadmap}/>
                <button onClick={onLogout} className="dashboard-button">Sign Out</button>
            </div>
            <div className="dashboard-card continue-card">
                 {progress.nextTopic ? (
                    <><h2 style={{ fontSize: '20px' }}>Continue Your Journey</h2><p>Next up: <strong>{progress.nextTopic.title}</strong></p><button className="dashboard-button" onClick={() => onSelectTopic(progress.nextTopic.id)}>Start Topic</button></>
                ) : (
                    <><h2 style={{ fontSize: '20px' }}>Congratulations!</h2><p>You've completed the roadmap!</p><button className="dashboard-button" onClick={onViewRoadmap}>Review Roadmap</button></>
                )}
            </div>
            <div className="quick-access-container">
                <div className="dashboard-card access-card" onClick={onViewDSVisualizer}><DSBranchIcon /><h3>Data Structures</h3></div>
                <div className="dashboard-card access-card" onClick={onViewAlgoVisualizer}><AlgoIcon /><h3>Algorithms</h3></div>
                <div className="dashboard-card access-card" onClick={onViewCodeVisualizer}><CodeIcon /><h3>Code Playground</h3></div>
                <div className="dashboard-card access-card" onClick={onViewCodeConcepts}><CodeConceptsIcon /><h3>Code Concepts</h3></div>
                <div className="dashboard-card access-card" onClick={onViewTextPage}><ArticleIcon /><h3>Articles</h3></div>
                <div className="dashboard-card access-card" onClick={onViewAboutUs}><AboutUsIcon /><h3>About Us</h3></div>
            </div>
            <div className="dashboard-card ai-card">
            <div className="ai-card-header">
                <h3 style={aiheaderStyle} key={accent}>Rivor AI</h3>
                <div className="ai-header-right"> <button className="dashboard-button clear-chat-button" onClick={handleClearChat} title="Clear Chat"> <ClearIcon / ></button> </div>
            </div>
                <div className="ai-chat-box" ref={chatBoxRef}>
                    {messages.length === 0 ? (
                    <div className="empty-chat-placeholder">
                        <p>Ask me anything about DSA!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))
                )}
                {isAiLoading && (<div className="ai-message"><p><i>typing...</i></p></div>)}
                </div>
                <div className="ai-input-area">
                    <input type="text" placeholder="Explain Big O notation..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}/>
                    <button className="dashboard-button icon-button" onClick={handleSendMessage}><SendIcon /></button>
                </div>
            </div>
            <div className="dashboard-card quote-card">
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">- {quote.author}</p>
            </div>
            {showPfpSelector && (
                <ProfilePictureSelector 
                    onSelect={handleAvatarSelect}
                    onClose={() => setShowPfpSelector(false)}
                    currentAvatarId={userData?.avatarId}
                />
            )}
        </div>
    );
};

const AIWelcomeView = ({ onEnter }) => {
    return (
        <div className="welcome-container">
            <svg className="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 4v4"/><path d="M9 4v4"/></svg>
            <h1>Welcome to Rivor Insights</h1>
            <p>Your personal playground for mastering data structures and algorithms. Use our interactive visualizers and AI assistant to accelerate your learning.</p>
            <button className="dashboard-button welcome-button" onClick={onEnter}>
                Enter Dashboard
            </button>
        </div>
    );
};

function HomePage(props) {
    const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem('welcomeSeen'));
    const handleEnter = () => {
        sessionStorage.setItem('welcomeSeen', 'true');
        setShowWelcome(false);
    };
    return (<div className="homepage-wrapper"> {showWelcome ? <AIWelcomeView onEnter={handleEnter} /> : <DashboardView {...props} />} </div>);
}
export default HomePage;