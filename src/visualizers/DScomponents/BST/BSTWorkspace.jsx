import React, { useState, useRef, useEffect } from 'react';
import './BST.css';
import { DS_BST } from './DS_BST';
import { InfoPanel } from '../InfoPanel';
import { Toast } from '../../Toast/Toast';
import { auth, db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { dsInfo } from '../../data/ds-info';
import { CheckIcon, BookIcon } from '../../../common/Icons';
import { useWorkspaceLogic} from '../../../hooks/useWorkspaceLogic';

function BSTWorkspace({ onBack }) {
    const topicId = 'ds-binary-search-trees';
    const {
        isInfoPanelOpen, setIsInfoPanelOpen, animationHistory, setAnimationHistory, currentStep, setCurrentStep, isPlaying, setIsPlaying,
        isCompleted, setIsCompleted, animationSpeed, setAnimationSpeed, sliderValue, setSliderValue, treeState, setTreeState,
        value, setValue, toast, setToast
    } = useWorkspaceLogic();
    const dsBst = useRef(new DS_BST());
    const [traversalResult, setTraversalResult] = useState([]);
    const canvasRef = useRef(null); 
    const [canvasCenter, setCanvasCenter] = useState(0);
    const showToast = (message, type = 'info') => {setToast({ show: true, message, type });};
    useEffect(() => {
        const checkCompletion = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const docRef = doc(db, "userProgress", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().completed?.includes(topicId)) {setIsCompleted(true);}
        };
        checkCompletion();
    }, []);

    useEffect(() => {
        if (isPlaying && currentStep < animationHistory.length - 1) {
            const timer = setTimeout(() => {setCurrentStep(currentStep + 1);}, animationSpeed);
            return () => clearTimeout(timer);
        }
        else {setIsPlaying(false);}
    }, [isPlaying, currentStep, animationHistory, animationSpeed]);

    useEffect(() => {
        const updateCenter = () => {if (canvasRef.current) {setCanvasCenter(canvasRef.current.offsetWidth / 2);}};
        updateCenter();
        window.addEventListener('resize', updateCenter); // Run on window resize
        return () => window.removeEventListener('resize', updateCenter); // Cleanup
    }, []);

    const handleOperation = (operation, ...args) => {
        const history = dsBst.current[operation](...args);
        if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);           
            const animationDuration = (history.length) * animationSpeed;
            setTimeout(() => {setTreeState(dsBst.current.getTreeState());}, animationDuration);
        }
    };
    
    const handleInsert = () => {
        if (value === '') return showToast("Please enter a value to insert.", "info");
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return showToast("Please enter a valid number.", "error");
        handleOperation('insert', numValue, canvasCenter);
        setValue('');
    };

    const handleDelete = () => {
        if (value === '') return showToast("Please enter a value to delete.", "info");
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return showToast("Please enter a valid number.", "error");
        handleOperation('delete', numValue, canvasCenter);
        setValue('');
    };

    const handleFind = () => {
        if (value === '') return showToast("Please enter a value to find.", "info");
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return showToast("Please enter a valid number.", "error");
        const history = dsBst.current.find(numValue);
        if (history && history.length > 0) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
            const animationDuration = (history.length - 1) * animationSpeed;
            setTimeout(() => {
                const wasFound = history.some(step => step.type === 'highlight-found');
                if (wasFound) {showToast(`Value ${numValue} was found in the tree.`, 'success');}
                else {showToast(`Value ${numValue} was not found in the tree.`, 'error');}
            }, animationDuration);
        }
        setValue('');
    };

    const handleTraversal = (type) => {
        setTraversalResult([]); 
        const history = dsBst.current.traverse(type);
        if (history && history.length > 0) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
            const animationDuration = (history.length - 1) * animationSpeed;
            setTimeout(() => {const lastStep = history[history.length - 1];setTraversalResult(lastStep.traversalOutput || []);}, animationDuration);
        }
    };

    const handleClear = () => handleOperation('clear');
    const handleRandom = () => handleOperation('random', 7, 100, canvasCenter);
    
    const handleCompleteTopic = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) {
                await updateDoc(docRef, { completed: arrayRemove(topicId) });
                setIsCompleted(false);
            }
            else {
                await updateDoc(docRef, { completed: arrayUnion(topicId) });
                setIsCompleted(true);
            }
        }
        catch (error) {
            if (error.code === 'not-found' && !isCompleted) {
                await setDoc(docRef, { completed: [topicId] });
                setIsCompleted(true);
            }
        }
    };

    const handleValueChange = (e) => { 
        const numericValue = e.target.value.replace(/[^0-9]/g, ''); 
        setValue(numericValue.slice(0, 3)); 
    };

    const handleSpeedChange = (e) => { 
        const newSliderValue = parseInt(e.target.value, 10); 
        setSliderValue(newSliderValue); 
        setAnimationSpeed(1050 - (newSliderValue * 10)); 
    };

    const handlePlayPause = () => { 
        if (!isPlaying && currentStep === animationHistory.length - 1) setCurrentStep(0); 
        setIsPlaying(!isPlaying); 
    };

    const handleStepBack = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const handleStepForward = () => { setIsPlaying(false); if (currentStep < animationHistory.length - 1) setCurrentStep(currentStep + 1); };

    const currentFrame = animationHistory[currentStep] || {};
    const displayState = currentFrame.treeState || treeState;
    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Binary Search Tree</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Operations</h3>
                        <div className="ds-control-group">
                            <input type="number" placeholder="value" className="ds-input-field" value={value} onChange={handleValueChange}/>
                            <button className="ds-action-button" onClick={handleInsert}>Insert</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleDelete}>Delete</button>
                            <button className="ds-action-button" onClick={handleFind}>Find</button>
                        </div>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Utilities</h3>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleRandom}>Random</button>
                            <button className="ds-action-button" onClick={handleClear}>Clear</button>
                        </div>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Traversals</h3>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={() => handleTraversal('In-order')}>In-order</button>
                            <button className="ds-action-button" onClick={() => handleTraversal('Pre-order')}>Pre-order</button>
                            <button className="ds-action-button" onClick={() => handleTraversal('Post-order')}>Post-order</button>
                        </div>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Traversal Output</h3>
                        <div className="output-box">{traversalResult.length > 0 ? traversalResult.join('  →  ') : 'See the output here.'}</div>
                    </div>
                </div>
                <div className="ds-controls-right">
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon />
                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}> <BookIcon /> </button>
                    </div>
                </div>
            </div>
            <div className="bst-canvas" ref={canvasRef}>
                {displayState.edges.map(edge => {
                    const fromNode = displayState.nodes.find(n => n.id === edge.from);
                    const toNode = displayState.nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x) * 180 / Math.PI;
                    const length = Math.sqrt(Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2));
                    return (
                        <div key={`${edge.from}-${edge.to}`} className="bst-edge" style={{
                            left: `${fromNode.x}px`,
                            top: `${fromNode.y}px`,
                            width: `${length}px`,
                            transform: `rotate(${angle}deg)`
                        }}></div>
                    );
                })}
                {displayState.nodes.map(node => (
                    <div key={node.id} className={`bst-node ${currentFrame.type === 'highlight-found' && currentFrame.highlightNodeId === node.id ? 'highlight-found' : (currentFrame.highlightNodeId === node.id ? 'highlight' : '')}`} style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                    }}>
                        {node.value}
                    </div>
                ))}
            </div>
            <div className="ds-animation-controls">
                <div className="ds-playback-buttons">
                    <button className="ds-playback-button" onClick={handleStepBack} disabled={!animationHistory.length || currentStep === 0}>‹ Step Back</button>
                    <button className="ds-playback-button play" onClick={handlePlayPause} disabled={!animationHistory.length}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button className="ds-playback-button" onClick={handleStepForward} disabled={!animationHistory.length || currentStep >= animationHistory.length - 1}>Step Forward ›</button>
                </div>
                <div className="ds-speed-slider"><span>Animation Speed</span><input type="range" min="1" max="100" value={sliderValue} onChange={handleSpeedChange}/></div>
            </div>
            {isInfoPanelOpen && <InfoPanel data={dsInfo.bst || {}} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>        
    );
}
export default BSTWorkspace;