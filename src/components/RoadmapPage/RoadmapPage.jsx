import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import './RoadmapPage.css';

export const roadmapData = [
    {
        category: "Stage 1: Foundational Concepts",
        topics: [
            { id: "basics-variables", title: "Variables & Data Types" },
            { id: "basics-operators", title: "Operators & Expressions" },
            { id: "basics-conditionals", title: "Conditional Statements (If/Else)" },
        ]
    },
    {
        category: "Stage 2: Loops & Functions",
        topics: [
            { id: "basics-for-loops", title: "For Loops" },
            { id: "basics-while-loops", title: "While Loops" },
            { id: "basics-functions", title: "Functions & Scope" },
        ]
    },
    {
        category: "Stage 3: Linear Data Structures",
        topics: [
            { id: "ds-arrays", title: "Arrays" },
            { id: "ds-singly-linked-list", title: "Singly Linked Lists" },
            { id: "ds-doubly-linked-list", title: "Doubly Linked Lists" },
            { id: "ds-circular-linked-list", title: "Circular Linked Lists" },
            { id: "ds-stacks", title: "Stacks (LIFO)" },
            { id: "ds-queues", title: "Queues (FIFO)" },
            { id: "ds-deques", title: "Deques" },
        ]
    },
    {
        category: "Stage 4: Non-Linear Data Structures",
        topics: [
            { id: "ds-binary-search-trees", title: "Binary Search Trees (BST)" },
        ]
    },
    {
        category: "Stage 5: Searching & Sorting Algorithms",
        topics: [
            { id: "algo-linear-search", title: "Linear Search" },
            { id: "algo-binary-search", title: "Binary Search" },
            { id: "algo-bubble-sort", title: "Bubble Sort" },
            { id: "algo-insertion-sort", title: "Insertion Sort" },
        ]
    },
    {
        category: "Stage 6: Graph Traversal",
        topics: [
            { id: "algo-bfs", title: "Breadth-First Search (BFS)" },
            { id: "algo-dfs", title: "Depth-First Search (DFS)" },
        ]
    },
];

function RoadmapPage({ onBack, onSelectTopic }) {
    const [completedTopics, setCompletedTopics] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(10);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchAndSimulate = async () => {
            if (user) {
                const docRef = doc(db, "userProgress", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {setCompletedTopics(new Set(docSnap.data().completed || []));}
            }
            setProgress(100);
            setTimeout(() => setIsLoading(false), 400);
        };
        fetchAndSimulate();

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(timer);
                    return 90;
                }
                return prev + Math.floor(Math.random() * 10);
            });
        }, 150);
        return () => clearInterval(timer);
    }, [user]);
    
    const handleToggleComplete = useCallback(async (topicId) => {
        if (!user) return;
        const newCompletedTopics = new Set(completedTopics);
        if (newCompletedTopics.has(topicId)) {newCompletedTopics.delete(topicId);}
        else {newCompletedTopics.add(topicId);}
        setCompletedTopics(newCompletedTopics);
        const docRef = doc(db, "userProgress", user.uid);
        await setDoc(docRef, { completed: Array.from(newCompletedTopics) });
    }, [user, completedTopics]);

    if (isLoading) {
        return (
            <div style={{ width: '100%', maxWidth: '800px', margin: 'auto', padding: '20px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                <h2 style={{color: 'var(--primary-text)', marginBottom: '20px'}}>Loading Your Roadmap...</h2>
                <div className="progress-bar-container"> <div className="progress-bar-filler" style={{ width: `${progress}%` }}></div> </div>
            </div>
        );
    }

    return (
        <div style={{ animation: 'fadeIn 0.5s', width: '100%', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
                <h1 className="auth-title" style={{marginBottom: '0'}}>Learning Roadmap</h1>
                <button onClick={onBack} className="auth-button" style={{maxWidth: '150px'}}>Back</button>
            </div>
            
            {roadmapData.map(stage => {
                const completedCount = stage.topics.filter(topic => completedTopics.has(topic.id)).length;
                const totalCount = stage.topics.length;
                const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                    <div key={stage.category} style={{marginBottom: '32px'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', marginBottom: '12px' }}>
                            <h2 style={{color: 'var(--primary-text)', margin: 0}}>{stage.category}</h2>
                            <span style={{color: 'var(--secondary-text)', fontSize: '14px'}}>{completedCount} / {totalCount}</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-filler" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px'}}>
                            {stage.topics.map(topic => (
                                <div
                                    key={topic.id}
                                    className="roadmap-topic-label"
                                    onClick={(e) => {
                                        if (e.target.type !== 'checkbox') {
                                            onSelectTopic(topic.id);
                                        }
                                    }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                        backgroundColor: 'var--surface)', borderRadius: '8px', cursor: 'pointer',
                                        border: '1px solid var(--border)',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={completedTopics.has(topic.id)}
                                        onChange={() => handleToggleComplete(topic.id)}
                                        style={{width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer'}}
                                    />
                        {/*Title*/} <span style={{flexGrow: 1, fontSize: '18px', textDecoration: completedTopics.has(topic.id) ? 'line-through' : 'none', color: completedTopics.has(topic.id) ? 'var(--secondary-text)' : 'var(--primary-text)'}}>{topic.title}</span>
                                    <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>›</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
export default RoadmapPage;
