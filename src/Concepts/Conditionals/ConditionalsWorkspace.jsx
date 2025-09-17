import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './Conditionals.css';
import { conceptsInfo } from '../concepts-data.js';
import { ConceptInfoPanel } from '../ConceptInfoPanel';
import { Toast } from '../../visualizers/components/Toast/Toast';
import { CheckIcon, BookIcon } from '../../common/Icons.jsx';

const FlowchartSVG = ({ activeBlocks }) => {
    const isActive = (id) => activeBlocks.includes(id);
    const diamondPath = (x, y, w, h) => { // Now accepts width and height
        const halfW = w / 2;
        const halfH = h / 2;
        return `M ${x},${y - halfH} L ${x + halfW},${y} L ${x},${y + halfH} L ${x - halfW},${y} Z`;
    };

    return (
        <svg viewBox="0 0 800 400" className="flowchart-svg">
            {/* NODES */}
            <g className={isActive('start') ? 'active' : ''}>
                <rect x="10" y="100" width="100" height="40" rx="8" className="svg-node-shape" />
                <text x="60" y="120" className="svg-node-text">Start</text>
            </g>
            <g className={isActive('if_cond') ? 'active' : ''}>
                <path d={diamondPath(200, 120, 120, 70)} className="svg-node-shape" />
                <text x="200" y="120" className="svg-node-text">score {'>='} 90?</text>
            </g>
             <g className={isActive('if_block') ? 'active' : ''}>
                <rect x="150" y="220" width="100" height="40" rx="8" className="svg-node-shape" />
                <text x="200" y="240" className="svg-node-text">grade = "A"</text>
            </g>
            <g className={isActive('elif1_cond') ? 'active' : ''}>
                <path d={diamondPath(370, 120, 120, 70)} className="svg-node-shape" />
                <text x="370" y="120" className="svg-node-text">score {'>='} 80?</text>
            </g>
            <g className={isActive('elif1_block') ? 'active' : ''}>
                <rect x="320" y="220" width="100" height="40" rx="8" className="svg-node-shape" />
                <text x="370" y="240" className="svg-node-text">grade = "B"</text>
            </g>
            <g className={isActive('elif2_cond') ? 'active' : ''}>
                 <path d={diamondPath(540, 120, 120, 70)} className="svg-node-shape" />
                <text x="540" y="120" className="svg-node-text">score {'>='} 70?</text>
            </g>
             <g className={isActive('elif2_block') ? 'active' : ''}>
                <rect x="490" y="220" width="100" height="40" rx="8" className="svg-node-shape" />
                <text x="540" y="240" className="svg-node-text">grade = "C"</text>
            </g>
            <g className={isActive('else_block') ? 'active' : ''}>
                <rect x="640" y="220" width="100" height="40" rx="8" className="svg-node-shape" />
                <text x="690" y="240" className="svg-node-text">grade = "D"</text>
            </g>

            {/* CONNECTORS and LABELS */}
            <path d="M 110 120 H 140" className="svg-path-line" />
            
            <g className={isActive('if_true_path') ? 'active' : ''}>
                <path d="M 200 155 V 220" className="svg-path-line" />
                <text x="220" y="180" className="svg-path-label">True</text>
            </g>
            <g className={isActive('if_false_path') ? 'active' : ''}>
                <path d="M 260 120 H 310" className="svg-path-line" />
                <text x="285" y="110" className="svg-path-label">False</text>
            </g>
             <g className={isActive('elif1_true_path') ? 'active' : ''}>
                <path d="M 370 155 V 220" className="svg-path-line" />
                <text x="390" y="180" className="svg-path-label">True</text>
            </g>
             <g className={isActive('elif1_false_path') ? 'active' : ''}>
                <path d="M 430 120 H 480" className="svg-path-line" />
                <text x="455" y="110" className="svg-path-label">False</text>
            </g>
            <g className={isActive('elif2_true_path') ? 'active' : ''}>
                <path d="M 540 155 V 220" className="svg-path-line" />
                <text x="560" y="180" className="svg-path-label">True</text>
            </g>
             <g className={isActive('elif2_false_path') ? 'active' : ''}>
                <path d="M 600 120 H 690 V 220" className="svg-path-line" />
                <text x="645" y="110" className="svg-path-label">False</text>
            </g>
        </svg>
    );
};

function ConditionalsWorkspace({ onBack, onPractice }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const topicId = 'basics-conditionals';

    const [inputValue, setInputValue] = useState('');
    const [activeBlocks, setActiveBlocks] = useState([]);
    const animationId = useRef(0); // This will track the current animation

    useEffect(() => {
        // Increment the ref. Any running animation with an older ID will stop.
        animationId.current += 1;
        const currentAnimationId = animationId.current;
        const score = parseInt(inputValue, 10);

        // Immediately clear if input is invalid or empty
        if (inputValue.trim() === '' || isNaN(score)) {
            setActiveBlocks([]);
            return;
        }

        const animateFlow = async () => {
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            // This is the key: only update state if the animation hasn't been cancelled
            const setBlocks = (blocks) => {
                if (animationId.current === currentAnimationId) {
                    setActiveBlocks(blocks);
                }
            };

            setBlocks(['start']);
            await sleep(400); if (animationId.current !== currentAnimationId) return;

            setBlocks(['start', 'if_cond']);
            await sleep(500); if (animationId.current !== currentAnimationId) return;

            if (score >= 90) {
                setBlocks(['start', 'if_cond', 'if_true_path', 'if_block']);
                return;
            }
            
            setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond']);
            await sleep(500); if (animationId.current !== currentAnimationId) return;

            if (score >= 80) {
                setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_true_path', 'elif1_block']);
                return;
            }

            setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_false_path', 'elif2_cond']);
            await sleep(500); if (animationId.current !== currentAnimationId) return;

            if (score >= 70) {
                setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_false_path', 'elif2_cond', 'elif2_true_path', 'elif2_block']);
                return;
            }

            setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_false_path', 'elif2_cond', 'elif2_false_path', 'else_block']);
        };
        animateFlow();
    }, [inputValue]);


    // Other functions (unchanged)
    const showToast = (message, type = 'info') => { setToast({ show: true, message, type }); };
    useEffect(() => {
        const checkCompletion = async () => {
            const user = auth.currentUser; if (!user) return;
            const docRef = doc(db, "userProgress", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().completed?.includes(topicId)) setIsCompleted(true);
        };
        checkCompletion();
    }, [isCompleted]); // Re-check if isCompleted changes
    const handleCompleteTopic = async () => {
        const user = auth.currentUser; if (!user) return;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) { await updateDoc(docRef, { completed: arrayRemove(topicId) }); setIsCompleted(false); }
            else { await updateDoc(docRef, { completed: arrayUnion(topicId) }); setIsCompleted(true); }
        }
        catch (error) {
            if (error.code === 'not-found' && !isCompleted) { await setDoc(docRef, { completed: [topicId] }); setIsCompleted(true); }
            else console.error("Error updating progress:", error);
        }
    };
    const handleValueChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
           if (parseInt(value, 10) > 100) { setInputValue('100'); showToast("Score can't be more than 100", "info"); }
           else setInputValue(value);
        }
    };
    const isActive = (id) => activeBlocks.includes(id);

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>If/Elif/Else</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                     <div className="ds-control-group">
                        <span>Enter Score (0-100):</span>
                        <input 
                            type="text" 
                            className="ds-input-field" 
                            value={inputValue} 
                            onChange={handleValueChange}
                            maxLength="3"
                        />
                    </div>
                </div>
                <div className="ds-controls-right">
                    <div> <button onClick={() => onPractice('conditionals')} className="auth-button" style={{ maxWidth: '150px', marginRight: '16px' }}>Practice</button> </div>
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon />
                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}> <BookIcon /> </button>
                    </div>
                </div>
            </div>

            <div className="conditionals-workspace-content">
                <div className="conditionals-code-panel">
                    <h3 className="code-editor-header">Code</h3>
                    <p className={`code-line ${isActive('if_cond') || isActive('if_block') ? 'active' : ''}`}>
                        <span className="token-keyword">if</span> score {'>='} 90:
                    </p>
                    <p className={`code-line ${isActive('if_block') ? 'active' : ''}`} style={{paddingLeft: '20px'}}> grade = "A" </p>
                    <p className={`code-line ${isActive('elif1_cond') || isActive('elif1_block') ? 'active' : ''}`}>
                        <span className="token-keyword">elif</span> score {'>='} 80:
                    </p>
                    <p className={`code-line ${isActive('elif1_block') ? 'active' : ''}`} style={{paddingLeft: '20px'}}> grade = "B" </p>
                    <p className={`code-line ${isActive('elif2_cond') || isActive('elif2_block') ? 'active' : ''}`}>
                        <span className="token-keyword">elif</span> score {'>='} 70:
                    </p>
                    <p className={`code-line ${isActive('elif2_block') ? 'active' : ''}`} style={{paddingLeft: '20px'}}> grade = "C" </p>
                    <p className={`code-line ${isActive('else_block') ? 'active' : ''}`}>
                        <span className="token-keyword">else</span>:
                    </p>
                    <p className={`code-line ${isActive('else_block') ? 'active' : ''}`} style={{paddingLeft: '20px'}}> grade = "D" </p>
                </div>
                <div className="conditionals-visualization-panel"> <FlowchartSVG activeBlocks={activeBlocks} /> </div>
            </div>
            {isInfoPanelOpen && <ConceptInfoPanel data={conceptsInfo.conditionals} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}
export default ConditionalsWorkspace;