import React, { useState } from 'react';
import SyntaxHighlighter from './SyntaxHighlighter';

export function InfoPanel({ data, onClose }) {
    const [activeTab, setActiveTab] = useState('About');
    // --- CHANGE 1: We now store the index, not the string key ---
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [revealed, setRevealed] = useState({});

    const handleReveal = (key) => {
        setRevealed(prev => ({ ...prev, [key]: true }));
    };
    
    const handleRevealAll = () => {
        const allKeys = Object.keys(data.bigO);
        const allRevealed = allKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {});
        setRevealed(allRevealed);
    };

    return (
        <div className="info-panel-overlay" onClick={onClose}>
            <div className="info-panel" onClick={(e) => e.stopPropagation()}>
                <div className="info-panel-header">
                    <button className={activeTab === 'About' ? 'active' : ''} onClick={() => setActiveTab('About')}>About</button>
                    <button className={activeTab === 'Code' ? 'active' : ''} onClick={() => setActiveTab('Code')}>Code</button>
                    <button className={activeTab === 'Big O' ? 'active' : ''} onClick={() => setActiveTab('Big O')}>Big O</button>
                    <button className="info-panel-close" onClick={onClose}>&times;</button>
                </div>

                <div className="info-panel-content">
                    {activeTab === 'About' && (
                        <div className="info-tab-content">
                            <h3>{data.about.title}</h3>
                            <p>{data.about.description}</p>
                            <strong>Key Concepts:</strong>
                            <ul>
                                {data.about.details.map(item => (
                                    <li key={item.title}><b>{item.title}:</b> {item.note} (<code>{item.complexity}</code>)</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {activeTab === 'Code' && (
                        <div className="info-tab-content">
                            {/* --- CHANGE 2: The select dropdown now uses the new array structure --- */}
                            <select 
                                className="code-select" 
                                value={selectedIndex} 
                                onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
                            >
                                {data.code.map((item, index) => (
                                    <option key={index} value={index}>{item.name}</option>
                                ))}
                            </select>
                            {/* --- CHANGE 3: We now pass the correct code snippet to the highlighter --- */}
                            <SyntaxHighlighter code={data.code[selectedIndex].snippet} />
                        </div>
                    )}
                    {activeTab === 'Big O' && (
                        <div className="info-tab-content">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <h3>Time Complexity</h3>
                                <button className="reveal-all-btn" onClick={handleRevealAll}>Reveal All</button>
                            </div>
                            <table className="big-o-table">
                                <thead>
                                    <tr><th>Operation</th><th>Best Case</th><th>Worst Case</th></tr>
                                </thead>
                                <tbody>
                                    {Object.entries(data.bigO).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td className={`reveal-cell ${revealed[key] ? 'visible' : ''}`} onClick={() => handleReveal(key)}>
                                                <span>{value.best}</span>
                                            </td>
                                            <td className={`reveal-cell ${revealed[key] ? 'visible' : ''}`} onClick={() => handleReveal(key)}>
                                                <span>{value.worst}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}