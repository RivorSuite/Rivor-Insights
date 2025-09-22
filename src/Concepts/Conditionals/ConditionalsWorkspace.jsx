import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './Conditionals.css';
import { conceptsInfo } from '../concepts-data.js';
import { ConceptInfoPanel } from '../ConceptInfoPanel';
import { Toast } from '../../visualizers/Toast/Toast.jsx';
import { CheckIcon, BookIcon } from '../../common/Icons.jsx';

// --- Flowchart Components ---
const FlowchartNode = ({ x, y, width, height, type = 'rect', text, isActive }) => (
    <g className={isActive ? 'active' : ''}>
        {type === 'rect' ? (
            <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx="8" className="svg-node-shape" />
        ) : (
            <path d={`M ${x},${y - height / 2} L ${x + width / 2},${y} L ${x},${y + height / 2} L ${x - width / 2},${y} Z`} className="svg-node-shape" />
        )}
        <text x={x} y={y} className="svg-node-text">{text}</text>
    </g>
);

const FlowchartPath = ({ d, label, labelX, labelY, isActive }) => (
    <g className={isActive ? 'active' : ''}>
        <path d={d} className="svg-path-line" />
        {label && <text x={labelX} y={labelY} className="svg-path-label">{label}</text>}
    </g>
);

function ConditionalsWorkspace({ onBack, onPractice }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const topicId = 'basics-conditionals';
    const [conditionalType, setConditionalType] = useState('simple-if');
    const [activeBlocks, setActiveBlocks] = useState([]);
    const animationId = useRef(0);
    const [score, setScore] = useState('85');
    const [age, setAge] = useState('25');
    const [hasLicense, setHasLicense] = useState(true);

    const showToast = (message, type = 'info') => { setToast({ show: true, message, type }); };

    useEffect(() => {
        const checkCompletion = async () => {
            const user = auth.currentUser; if (!user) return;
            const docRef = doc(db, "userProgress", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().completed?.includes(topicId)) setIsCompleted(true);
        };
        checkCompletion();
    }, []);

    useEffect(() => {
        animationId.current += 1;
        const currentAnimationId = animationId.current;

        const animateFlow = async () => {
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const setBlocks = (blocks) => { if (animationId.current === currentAnimationId) setActiveBlocks(blocks); };

            setBlocks(['start']);
            await sleep(400); if (animationId.current !== currentAnimationId) return;

            const scoreNum = parseInt(score, 10);
            const ageNum = parseInt(age, 10);

            switch (conditionalType) {
                case 'simple-if':
                    setBlocks(['start', 'if_cond']);
                    await sleep(500); if (animationId.current !== currentAnimationId) return;
                    if (scoreNum >= 60) {
                        setBlocks(['start', 'if_cond', 'if_true_path', 'if_block', 'end_path_1']);
                    } else {
                        setBlocks(['start', 'if_cond', 'if_false_path', 'end_path_1']);
                    }
                    break;
                case 'if-else':
                     setBlocks(['start', 'if_cond']);
                    await sleep(500); if (animationId.current !== currentAnimationId) return;
                    if (scoreNum >= 60) {
                        setBlocks(['start', 'if_cond', 'if_true_path', 'if_block', 'end_path_1']);
                    } else {
                        setBlocks(['start', 'if_cond', 'if_false_path', 'else_block', 'end_path_1']);
                    }
                    break;
                case 'if-elif-else':
                    setBlocks(['start', 'if_cond']);
                    await sleep(500); if (animationId.current !== currentAnimationId) return;
                    if (scoreNum >= 90) {
                        setBlocks(['start', 'if_cond', 'if_true_path', 'if_block']); return;
                    }
                    setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond']);
                    await sleep(500); if (animationId.current !== currentAnimationId) return;
                    if (scoreNum >= 80) {
                        setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_true_path', 'elif1_block']); return;
                    }
                    setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_false_path', 'elif2_cond']);
                    await sleep(500); if (animationId.current !== currentAnimationId) return;
                    if (scoreNum >= 70) {
                        setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_false_path', 'elif2_cond', 'elif2_true_path', 'elif2_block']); return;
                    }
                    setBlocks(['start', 'if_cond', 'if_false_path', 'elif1_cond', 'elif1_false_path', 'elif2_cond', 'elif2_false_path', 'else_block']);
                    break;
                case 'nested-if':
                    setBlocks(['start', 'if_outer_cond']);
                    await sleep(500); if (animationId.current !== currentAnimationId) return;
                    if (ageNum >= 18) {
                        setBlocks(['start', 'if_outer_cond', 'if_outer_true_path', 'if_inner_cond']);
                        await sleep(500); if (animationId.current !== currentAnimationId) return;
                        if (hasLicense) {
                            setBlocks(['start', 'if_outer_cond', 'if_outer_true_path', 'if_inner_cond', 'if_inner_true_path', 'if_inner_block']);
                        } else {
                            setBlocks(['start', 'if_outer_cond', 'if_outer_true_path', 'if_inner_cond', 'if_inner_false_path', 'else_inner_block']);
                        }
                    } else {
                        setBlocks(['start', 'if_outer_cond', 'if_outer_false_path', 'else_outer_block']);
                    }
                    break;
                default:
                    setActiveBlocks([]);
            }
        };

        animateFlow();
    }, [conditionalType, score, age, hasLicense]);

    const handleCompleteTopic = async () => {
        const user = auth.currentUser; if (!user) return;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) { await updateDoc(docRef, { completed: arrayRemove(topicId) }); setIsCompleted(false); }
            else { await setDoc(docRef, { completed: arrayUnion(topicId) }, { merge: true }); setIsCompleted(true); }
        } catch (error) { console.error("Error updating progress:", error); }
    };

    const handleScoreChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
            if (parseInt(value, 10) > 100) { setScore('100'); showToast("Score can't be more than 100", "info"); }
            else setScore(value);
        }
    };
    
    const handleAgeChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9]+$/.test(value)) {
           if (parseInt(value, 10) > 120) { setAge('120'); showToast("Age seems a bit high!", "info"); }
           else setAge(value);
        }
    };

    const renderInputs = () => {
        switch (conditionalType) {
            case 'nested-if':
                return (
                    <>
                        <div className="ds-control-group">
                            <span>Age:</span>
                            <input type="text" className="ds-input-field" value={age} onChange={handleAgeChange} maxLength="3" />
                        </div>
                        <div className="ds-control-group">
                            <span>Has License?</span>
                            <input type="checkbox" checked={hasLicense} onChange={(e) => setHasLicense(e.target.checked)} style={{width: '20px', height: '20px'}}/>
                        </div>
                    </>
                );
            default:
                return (
                    <div className="ds-control-group">
                        <span>Enter Score (0-100):</span>
                        <input type="text" className="ds-input-field" value={score} onChange={handleScoreChange} maxLength="3" />
                    </div>
                );
        }
    };

    const renderCodeAndFlowchart = () => {
        const isActive = (id) => activeBlocks.includes(id);
        switch (conditionalType) {
            case 'simple-if':
                return (
                    <>
                        <div className="conditionals-code-panel">
                            <h3 className="code-editor-header">Code</h3>
                            <p className="code-line">score = {score || '...'}</p>
                            <p className={`code-line ${isActive('if_cond') || isActive('if_block') ? 'active' : ''}`}><span className="token-keyword">if</span> score {'>='} 60:</p>
                            <p className={`code-line ${isActive('if_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print("You passed!")</p>
                        </div>
                        <div className="conditionals-visualization-panel">
                            <svg viewBox="0 0 800 300" className="flowchart-svg">
                                <FlowchartNode x={150} y={120} width={100} height={40} type="rect" text="Start" isActive={isActive('start')} />
                                <FlowchartNode x={400} y={120} width={120} height={70} type="diamond" text="score >= 60?" isActive={isActive('if_cond')} />
                                <FlowchartNode x={400} y={220} width={120} height={50} type="rect" text='print("Pass")' isActive={isActive('if_block')} />
                                <FlowchartNode x={650} y={120} width={100} height={40} type="rect" text="End" isActive={isActive('end_path_1')} />

                                <FlowchartPath d="M 200 120 H 340" isActive={isActive('start')} />
                                <FlowchartPath d="M 400 155 V 195" label="True" labelX={420} labelY={175} isActive={isActive('if_true_path')} />
                                <FlowchartPath d="M 460 120 H 600" label="False" labelX={530} labelY={110} isActive={isActive('if_false_path')} />
                                <FlowchartPath d="M 400 245 V 260 H 650 V 140" isActive={isActive('if_block')} />
                            </svg>
                        </div>
                    </>
                );
            case 'if-else':
                 return (
                    <>
                        <div className="conditionals-code-panel">
                            <h3 className="code-editor-header">Code</h3>
                            <p className="code-line">score = {score || '...'}</p>
                            <p className={`code-line ${isActive('if_cond') || isActive('if_block') ? 'active' : ''}`}><span className="token-keyword">if</span> score {'>='} 60:</p>
                            <p className={`code-line ${isActive('if_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print("You passed!")</p>
                             <p className={`code-line ${isActive('else_block') ? 'active' : ''}`}><span className="token-keyword">else</span>:</p>
                            <p className={`code-line ${isActive('else_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print("You failed.")</p>
                        </div>
                        <div className="conditionals-visualization-panel">
                             <svg viewBox="0 0 800 300" className="flowchart-svg">
                                <FlowchartNode x={150} y={120} width={100} height={40} type="rect" text="Start" isActive={isActive('start')} />
                                <FlowchartNode x={400} y={120} width={120} height={70} type="diamond" text="score >= 60?" isActive={isActive('if_cond')} />
                                <FlowchartNode x={280} y={220} width={120} height={50} type="rect" text='print("Pass")' isActive={isActive('if_block')} />
                                <FlowchartNode x={520} y={220} width={120} height={50} type="rect" text='print("Fail")' isActive={isActive('else_block')} />
                                <FlowchartNode x={700} y={120} width={100} height={40} type="rect" text="End" isActive={isActive('end_path_1')} />

                                <FlowchartPath d="M 200 120 H 340" isActive={isActive('start')} />
                                <FlowchartPath d="M 365 150 L 280 195" label="True" labelX={310} labelY={165} isActive={isActive('if_true_path')} />
                                <FlowchartPath d="M 435 150 L 520 195" label="False" labelX={490} labelY={165} isActive={isActive('if_false_path')} />
                                <FlowchartPath d="M 280 245 V 260 H 700 V 140" isActive={isActive('if_block')} />
                                <FlowchartPath d="M 520 245 V 260 H 700 V 140" isActive={isActive('else_block')} />
                            </svg>
                        </div>
                    </>
                );
            case 'if-elif-else':
                return (
                    <>
                        <div className="conditionals-code-panel">
                             <h3 className="code-editor-header">Code</h3>
                             <p className="code-line">score = {score || '...'}</p>
                            <p className={`code-line ${isActive('if_cond') || isActive('if_block') ? 'active' : ''}`}><span className="token-keyword">if</span> score {'>='} 90:</p>
                            <p className={`code-line ${isActive('if_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}> grade = "A" </p>
                            <p className={`code-line ${isActive('elif1_cond') || isActive('elif1_block') ? 'active' : ''}`}><span className="token-keyword">elif</span> score {'>='} 80:</p>
                            <p className={`code-line ${isActive('elif1_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}> grade = "B" </p>
                            <p className={`code-line ${isActive('elif2_cond') || isActive('elif2_block') ? 'active' : ''}`}><span className="token-keyword">elif</span> score {'>='} 70:</p>
                            <p className={`code-line ${isActive('elif2_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}> grade = "C" </p>
                            <p className={`code-line ${isActive('else_block') ? 'active' : ''}`}><span className="token-keyword">else</span>:</p>
                            <p className={`code-line ${isActive('else_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}> grade = "D" </p>
                        </div>
                        <div className="conditionals-visualization-panel">
                            <svg viewBox="0 0 800 300" className="flowchart-svg">
                                <FlowchartNode x={60} y={120} width={100} height={40} type="rect" text="Start" isActive={isActive('start')} />
                                <FlowchartNode x={200} y={120} width={120} height={70} type="diamond" text="score >= 90?" isActive={isActive('if_cond')} />
                                <FlowchartNode x={200} y={220} width={100} height={40} type="rect" text='grade = "A"' isActive={isActive('if_block')} />
                                <FlowchartNode x={370} y={120} width={120} height={70} type="diamond" text="score >= 80?" isActive={isActive('elif1_cond')} />
                                <FlowchartNode x={370} y={220} width={100} height={40} type="rect" text='grade = "B"' isActive={isActive('elif1_block')} />
                                <FlowchartNode x={540} y={120} width={120} height={70} type="diamond" text="score >= 70?" isActive={isActive('elif2_cond')} />
                                <FlowchartNode x={540} y={220} width={100} height={40} type="rect" text='grade = "C"' isActive={isActive('elif2_block')} />
                                <FlowchartNode x={710} y={120} width={100} height={40} type="rect" text='grade = "D"' isActive={isActive('else_block')} />
                                <FlowchartPath d="M 110 120 H 140" isActive={isActive('start')} />
                                <FlowchartPath d="M 200 155 V 200" label="True" labelX={220} labelY={180} isActive={isActive('if_true_path')} />
                                <FlowchartPath d="M 260 120 H 310" label="False" labelX={285} labelY={110} isActive={isActive('if_false_path')} />
                                <FlowchartPath d="M 370 155 V 200" label="True" labelX={390} labelY={180} isActive={isActive('elif1_true_path')} />
                                <FlowchartPath d="M 430 120 H 480" label="False" labelX={455} labelY={110} isActive={isActive('elif1_false_path')} />
                                <FlowchartPath d="M 540 155 V 200" label="True" labelX={560} labelY={180} isActive={isActive('elif2_true_path')} />
                                <FlowchartPath d="M 600 120 H 660" label="False" labelX={630} labelY={110} isActive={isActive('elif2_false_path')} />
                            </svg>
                        </div>
                    </>
                );
            case 'nested-if':
                 return (
                    <>
                        <div className="conditionals-code-panel">
                            <h3 className="code-editor-header">Code</h3>
                             <p className="code-line">age = {age || '...'}</p>
                             <p className="code-line">has_license = {String(hasLicense)}</p>
                            <p className={`code-line ${isActive('if_outer_cond') || isActive('if_outer_block') ? 'active' : ''}`}><span className="token-keyword">if</span> age {'>='} 18:</p>
                            <p className={`code-line ${isActive('if_inner_cond') || isActive('if_inner_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}><span className="token-keyword">if</span> has_license:</p>
                            <p className={`code-line ${isActive('if_inner_block') ? 'active' : ''}`} style={{ paddingLeft: '40px' }}>print("Can drive")</p>
                            <p className={`code-line ${isActive('else_inner_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}><span className="token-keyword">else</span>:</p>
                            <p className={`code-line ${isActive('else_inner_block') ? 'active' : ''}`} style={{ paddingLeft: '40px' }}>print("Cannot drive")</p>
                            <p className={`code-line ${isActive('else_outer_block') ? 'active' : ''}`}><span className="token-keyword">else</span>:</p>
                            <p className={`code-line ${isActive('else_outer_block') ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print("Is a minor")</p>
                        </div>
                        <div className="conditionals-visualization-panel">
                            <svg viewBox="0 0 800 300" className="flowchart-svg">
                                <FlowchartNode x={100} y={120} width={100} height={40} type="rect" text="Start" isActive={isActive('start')} />
                                <FlowchartNode x={280} y={120} width={120} height={70} type="diamond" text="age >= 18?" isActive={isActive('if_outer_cond')} />
                                <FlowchartNode x={280} y={230} width={120} height={50} type="rect" text='Is a minor' isActive={isActive('else_outer_block')} />
                                <FlowchartNode x={480} y={120} width={140} height={70} type="diamond" text='has_license?' isActive={isActive('if_inner_cond')} />
                                <FlowchartNode x={650} y={50} width={120} height={50} type="rect" text='Can drive' isActive={isActive('if_inner_block')} />
                                <FlowchartNode x={650} y={190} width={140} height={50} type="rect" text='Cannot drive' isActive={isActive('else_inner_block')} />

                                <FlowchartPath d="M 150 120 H 220" isActive={isActive('start')} />
                                <FlowchartPath d="M 280 155 V 205" label="False" labelX={300} labelY={180} isActive={isActive('if_outer_false_path')} />
                                <FlowchartPath d="M 340 120 H 410" label="True" labelX={375} labelY={110} isActive={isActive('if_outer_true_path')} />
                                
                                {/* Corrected paths below */}
                                <FlowchartPath d="M 480 85 V 50 H 590" label="True" labelX={530} labelY={40} isActive={isActive('if_inner_true_path')} />
                                <FlowchartPath d="M 480 155 V 190 H 580" label="False" labelX={525} labelY={200} isActive={isActive('if_inner_false_path')} />
                            </svg>
                        </div>
                    </>
                );
            default: return null;
        }
    };
    
    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Conditionals</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="conditional-type-switcher">
                        <button className={`conditional-type-button ${conditionalType === 'simple-if' ? 'active' : ''}`} onClick={() => setConditionalType('simple-if')}>Simple If</button>
                        <button className={`conditional-type-button ${conditionalType === 'if-else' ? 'active' : ''}`} onClick={() => setConditionalType('if-else')}>If-Else</button>
                        <button className={`conditional-type-button ${conditionalType === 'if-elif-else' ? 'active' : ''}`} onClick={() => setConditionalType('if-elif-else')}>If-Elif-Else</button>
                        <button className={`conditional-type-button ${conditionalType === 'nested-if' ? 'active' : ''}`} onClick={() => setConditionalType('nested-if')}>Nested If</button>
                    </div>
                     <div className="ds-separator"></div>
                    {renderInputs()}
                </div>
                <div className="ds-controls-right">
                    <div> <button onClick={() => onPractice('conditionals')} className="auth-button" style={{ maxWidth: '150px', marginRight: '16px' }}>Practice</button> </div>
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon /> {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}> <BookIcon /> </button>
                    </div>
                </div>
            </div>

            <div className="conditionals-workspace-content">
                {renderCodeAndFlowchart()}
            </div>
            {isInfoPanelOpen && <ConceptInfoPanel data={conceptsInfo.conditionals} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}

export default ConditionalsWorkspace;