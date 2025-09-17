import React, { useState, useEffect } from 'react';
import LoginPage from './components/Auth/LoginPage';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';
import VerifyEmailPage from './components/Auth/VerifyEmailPage';
import HomePage from './components/HomePage/HomePage';
import RoadmapPage from './components/RoadmapPage/RoadmapPage';
import CodeVisualizerPage from './components/CodeVisualizerPage/CodeVisualizerPage';
import DSVisualizerPage from './components/DSVisualizerPage/DSVisualizerPage';
import AlgoVisualizerPage from './components/AlgoVisualizerPage/AlgoVisualizerPage';
import Header from './components/Header/Header';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './firebase';
import { exampleCode } from './examples';
import TextPage from './components/TextPage/TextPage';
import CodeConceptsPage from './components/CodeConceptsPage/CodeConceptsPage';
import AboutUsPage from './components/AboutUsPage/AboutUsPage';
import { doc, getDoc, updateDoc } from "firebase/firestore";

function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewStack, setViewStack] = useState(() => {
        const initialHash = window.location.hash.substring(1).split('/')[0] || 'home';
        return [initialHash];
    });
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [accent, setAccent] = useState(() => localStorage.getItem('accent') || 'green');
    const [initialCode, setInitialCode] = useState('');
    const [selectedDS, setSelectedDS] = useState(() => {
        const hashParts = window.location.hash.substring(1).split('/');
        if (hashParts[0] === 'ds-visualizer') {return hashParts[1] || null;}
        return null;
    });
    const [selectedConcept, setSelectedConcept] = useState(() => {
        const hashParts = window.location.hash.substring(1).split('/');
        if (hashParts[0] === 'code-concepts') {return hashParts[1] || null;}
        return null;
    });
    const [initialLoopType, setInitialLoopType] = useState('for');

    useEffect(() => {
        document.body.className = `${theme}-theme`;
        document.body.dataset.accent = accent;
        localStorage.setItem('theme', theme);
        localStorage.setItem('accent', accent);
    }, [theme, accent]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { 
            setUser(currentUser);
            if (currentUser) { 
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists() && userDocSnap.data().accent) {setAccent(userDocSnap.data().accent);}
                else {setAccent('green');}
            } 
            else {setAccent('green'); }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const hashParts = window.location.hash.substring(1).split('/');
            const view = hashParts[0] || 'home';
            const ds = hashParts[0] === 'ds-visualizer' ? hashParts[1] : null;
            const concept = hashParts[0] === 'code-concepts' ? hashParts[1] : null;
            setViewStack([view]);
            setSelectedDS(ds);
            setSelectedConcept(concept);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        let newHash = viewStack[viewStack.length - 1] || 'home';
        if (newHash === 'ds-visualizer' && selectedDS) {newHash += `/${selectedDS}`;}
        if (newHash === 'code-concepts' && selectedConcept) {newHash += `/${selectedConcept}`;}
        if (window.location.hash !== `#${newHash}`) {window.location.hash = newHash;}
    }, [viewStack, selectedDS, selectedConcept]);
    
    const navigateTo = (view) => {setViewStack(prevStack => [...prevStack, view]);};
    const navigateBack = () => {window.history.back();};
    
    const handleSelectDS = (dsId) => {
        setSelectedDS(dsId);
        if (dsId && viewStack[viewStack.length - 1] !== 'ds-visualizer') {navigateTo('ds-visualizer');}
    };

    const handleSelectConcept = (conceptId) => {
        setSelectedConcept(conceptId);
        if (conceptId && viewStack[viewStack.length - 1] !== 'code-concepts') {navigateTo('code-concepts');}
    };

    const handleViewTopic = (topicId) => {
        if (topicId === 'basics-variables') {handleSelectConcept('variables'); return;}
        if (topicId === 'basics-operators') { handleSelectConcept('operators'); return;}
        if (topicId === 'basics-conditionals') {handleSelectConcept('conditionals'); return;}
        if (topicId === 'basics-for-loops') {setInitialLoopType('for'); handleSelectConcept('loops'); return;}
        if (topicId === 'basics-while-loops') {setInitialLoopType('while'); handleSelectConcept('loops'); return;}
        const codeSnippet = exampleCode[topicId];
        if (codeSnippet) {setInitialCode(codeSnippet); navigateTo('code-visualizer'); return;}
        const dsIdMap = {
            'ds-arrays': 'array',
            'ds-singly-linked-list': 'singly-linked-list',
            'ds-doubly-linked-list': 'doubly-linked-list',
            'ds-circular-linked-list': 'circular-linked-list',
            'ds-stacks': 'stack',
            'ds-queues': 'queue',
            'ds-deques': 'deque',
            'ds-binary-search-trees': 'bst',
        };
        const dsPageId = dsIdMap[topicId];
        if (dsPageId) {handleSelectDS(dsPageId);}
    };

    const handlePractice = (topicId) => {
        const practiceCode = {
            'variables': '# Declare an integer\nage = 25\n\n# Declare a float\nprice = 19.99\n\n# Declare a string\nname = "Alice"\n\n# Declare a boolean\nis_student = True\n\n# Print the variables\nprint("Name:", name)\nprint("Age:", age)\nprint("Price:", price)\nprint("Is Student:", is_student)',
            'operators': '# Arithmetic Operators\nadd = 15 + 5\nsub = 15 - 5\nmult = 15 * 5\nprint("Addition:", add)\nprint("Subtraction:", sub)\nprint("Multiplication:", mult)\n\n# Bitwise Operators\na = 10 # Binary: 1010\nb = 4  # Binary: 0100\nbitwise_and = a & b # Result: 0 (Binary: 0000)\nbitwise_or = a | b  # Result: 14 (Binary: 1110)\nprint("Bitwise AND:", bitwise_and)\nprint("Bitwise OR:", bitwise_or)\n\n# Comparison Operators\na = 10\nb = 20\nis_equal = a == b\nis_greater = a > b\nprint("Is a equal to b?", is_equal)\nprint("Is a greater than b?", is_greater)\n\n# Logical Operators\naccess_granted = True\nif not access_granted:\n  print("Access Denied.")\nelse:\n  print("Welcome!")',
            'conditionals': '# Find the maximum of three numbers\nnum1 = 25\nnum2 = 78\nnum3 = 45\n\nif num1 >= num2 and num1 >= num3:\n  max_num = num1\nelif num2 >= num1 and num2 >= num3:\n  max_num = num2\nelse:\n  max_num = num3\n\nprint("The maximum number is:", max_num)',
            'basics-for-loops': '# Sum all numbers from 1 to 100\ntotal = 0\nfor i in range(1, 10):\n  total = total + i\n\nprint("The sum is:", total)',
            'basics-while-loops': '# Find the first power of 2 greater than 60\nnum = 1\nwhile num <= 60:\n  num = num * 2\n\nprint("The first power of 2 > 60 is:", num)',
        }; 
        const code = practiceCode[topicId];
        if (code) {setInitialCode(code); navigateTo('code-visualizer');}
    };

    const handleLogout = async () => { await signOut(auth); setAccent('green');}; // reset the accent on logout
    const toggleTheme = () => { setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark')); };

    if (isLoading) { return <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>; }
    if (!user) {
        const currentView = viewStack[viewStack.length - 1] || 'home';
        // If the URL hash is #forgot-password, show the new page
        if (currentView === 'forgot-password') {return <ForgotPasswordPage onNavigateBack={() => window.location.hash = ''} />;}
        return <LoginPage />;// Otherwise, show the default login page
    }

    if (!user.emailVerified) {return <VerifyEmailPage onLogout={handleLogout} />;}
    
    const renderContent = () => {
        const currentView = viewStack[viewStack.length - 1] || 'home';
        switch (currentView) {
            case 'roadmap': return <RoadmapPage onBack={navigateBack} onSelectTopic={handleViewTopic} />;
            case 'text-page': return <TextPage onBack={navigateBack} />;
            case 'code-visualizer': return <CodeVisualizerPage onBack={navigateBack} initialCode={initialCode} />;
            case 'ds-visualizer':
                const previousView = viewStack[viewStack.length - 2] || 'home';
                return <DSVisualizerPage
                    onBack={navigateBack}
                    selectedDS={selectedDS}
                    onSelectDS={handleSelectDS}
                    entryPoint={previousView}
                />;
            case 'algo-visualizer':return <AlgoVisualizerPage onBack={navigateBack} />;
            case 'code-concepts':
                return <CodeConceptsPage
                    onBack={navigateBack}
                    selectedConcept={selectedConcept}
                    onSelectConcept={handleSelectConcept}
                    onPractice={handlePractice}
                    initialType={initialLoopType}
                />;
            case 'about-us':return <AboutUsPage onBack={navigateBack} />;
            default:
                return <HomePage 
                    userEmail = {user.email} 
                    onLogout={handleLogout} 
                    onViewRoadmap={() => navigateTo('roadmap')} 
                    onViewTextPage={() => navigateTo('text-page')}
                    onViewCodeVisualizer={() => { setInitialCode(''); navigateTo('code-visualizer'); }}
                    onViewDSVisualizer={() => { setSelectedDS(null); navigateTo('ds-visualizer'); }}
                    onViewAlgoVisualizer={() => navigateTo('algo-visualizer')}
                    onViewCodeConcepts={() => { setSelectedConcept(null); navigateTo('code-concepts'); }}
                    onViewAboutUs={() => navigateTo('about-us')}
                    onSelectTopic={handleViewTopic}
                />;
        }
    };

    const handleSetAccent = async (newAccent) => {
        setAccent(newAccent); // Update state immediately for responsiveness
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            try {await updateDoc(userDocRef, { accent: newAccent });} 
            catch (error) {console.error("Error updating accent color:", error);}
        }
    };


    return (
        <div style={{ width: '100%', height: '100%', paddingTop: '70px', boxSizing: 'border-box' }}>
            <Header theme={theme} onToggleTheme={toggleTheme} onSetAccent={handleSetAccent} accent={accent}/>
            {renderContent()}
        </div>
    );
}
export default App;