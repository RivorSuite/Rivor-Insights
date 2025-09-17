import React, { useState, useRef, useEffect } from 'react';
import './Queue.css';
import { DS_Queue } from './DS_Queue';
import { InfoPanel } from '../InfoPanel';
import { Toast } from '../Toast/Toast';
import { auth, db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { dsInfo } from '../../data/ds-info';
import { CheckIcon, BookIcon } from '../../../common/Icons';
import { useWorkspaceLogic} from '../../../hooks/useWorkspaceLogic';

const QueueCell = ({ value, index, highlight, isDequeuing, isPreEnqueue }) => {
    const cellClasses = `queue-cell ${highlight ? 'highlight' : ''} ${isDequeuing ? 'lifted-dequeue' : ''} ${isPreEnqueue ? 'pre-enqueue' : ''}`;
    return (<div className="queue-cell-container"><div className={cellClasses}>{value === null ? '' : value}</div><div className="queue-index">{index !== undefined ? index : ''}</div></div>);
};

function QueueWorkspace({ onBack }) {
    const {
        isInfoPanelOpen, setIsInfoPanelOpen, animationHistory, setAnimationHistory, currentStep, setCurrentStep, isPlaying, setIsPlaying,
        isCompleted, setIsCompleted, animationSpeed, setAnimationSpeed, sliderValue, setSliderValue, queueState, setQueueState,
        value, setValue, toast, setToast
    } = useWorkspaceLogic();
    const topicId = 'ds-queues';
    const dsQueue = useRef(new DS_Queue(false, 10));
    const [preEnqueueValue, setPreEnqueueValue] = useState(null);
    const [isFixedSize, setIsFixedSize] = useState(false);
    const [capacity, setCapacity] = useState('');
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
        const currentFrame = animationHistory[currentStep];
        if (currentFrame && currentFrame.type === 'pre-enqueue') {setPreEnqueueValue(currentFrame.preEnqueueValue);} 
        else {setPreEnqueueValue(null);}
    }, [currentStep, animationHistory]);
    
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
            else {console.error("Error updating progress:", error);}
        }
    };

    const handleOperation = (operation, ...args) => {
        const history = dsQueue.current[operation](...args);
        if (history) {
            const errorStep = history.find(step => step.type === 'error');
            if (errorStep) {
                showToast(errorStep.description, 'error');
                return;
            }
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
            const animationDuration = (history.length - 1) * animationSpeed;
            setTimeout(() => {setQueueState([...dsQueue.current.queue]);}, animationDuration);
        }
    };
    
    const handleEnqueue = () => {
        if (dsQueue.current.isFixedSize && dsQueue.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10) before using operations.", "error");
            return;
        }
        if (value === '') { 
            showToast("Please enter a value to enqueue.", "info"); 
            return; 
        } 
        handleOperation('enqueue', value); 
        setValue(''); 
    };

    const handleDequeue = () => {
        if (dsQueue.current.isFixedSize && dsQueue.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10) before using operations.", "error");
            return;
        }
        handleOperation('dequeue'); 
    };

    const handlePeek = () => {
        if (dsQueue.current.isFixedSize && dsQueue.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10) before using operations.", "error");
            return;
        }
        const history = dsQueue.current.peek();
        const errorStep = history.find(step => step.type === 'error');
        if (errorStep) { showToast(errorStep.description, 'error'); return; }
        if (dsQueue.current.queue.length > 0) {
            const frontValue = dsQueue.current.queue[0].value;
            showToast(`Front value is ${frontValue}`, 'success');
        }
        setAnimationHistory(history);
        const highlightStep = history.findIndex(frame => frame.type === 'highlight');
        if (highlightStep !== -1) { setCurrentStep(highlightStep); }
        setIsPlaying(false);
    };
    
    const handleClear = () => { handleOperation('clear'); setQueueState([]); };
    
    const handleRandom = () => {
        if (dsQueue.current.isFixedSize && dsQueue.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10) before using operations.", "error");
            return;
        }
        handleOperation('random');
        setTimeout(() => setQueueState([...dsQueue.current.queue]), 0);
    };

    const handleIsEmpty = () => {
        if (dsQueue.current.isFixedSize && dsQueue.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10) before using operations.", "error");
            return;
        }
        const isEmpty = dsQueue.current.queue.length === 0;
        showToast(isEmpty ? "Queue is empty." : "Queue is not empty.", "info");
    };
    
    const handleIsFull = () => {
        if (dsQueue.current.isFixedSize && dsQueue.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10) before using operations.", "error");
            return;
        }
        if (!dsQueue.current.isFixedSize) {
            showToast("This check only applies to fixed-size queues.", "info");
            return;
        }
        const isFull = dsQueue.current.queue.length >= dsQueue.current.capacity;
        showToast(isFull ? "Queue is full." : "Queue is not full.", "info");
    };
    
    const handleToggleFixedSize = () => {
        const newIsFixedSize = !isFixedSize;
        setIsFixedSize(newIsFixedSize);
        setCapacity('');
        dsQueue.current.setType(newIsFixedSize);
        dsQueue.current.setCapacity(newIsFixedSize ? 0 : 10);
        setQueueState([]);
        setAnimationHistory([]);
        setCurrentStep(0);
    };
    
    const handleCapacityChange = (e) => {
        const rawValue = e.target.value;
        if (rawValue === '') {
            setCapacity('');
            dsQueue.current.setCapacity(0); // Set backend capacity to 0
            setQueueState([]);
            return;
        }
    
        let newCapacity = parseInt(rawValue, 10);
        if (newCapacity > 10) {newCapacity = 10;showToast("Maximum capacity is 10.", "info");}
        setCapacity(newCapacity);
        handleOperation('setCapacity', newCapacity);
        setQueueState([]);
    };

    const handleValueChange = (e) => { const numericValue = e.target.value.replace(/[^0-9]/g, ''); setValue(numericValue.slice(0, 6)); };

    const handleSpeedChange = (e) => { 
        const newSliderValue = parseInt(e.target.value, 10); 
        setSliderValue(newSliderValue); 
        setAnimationSpeed(1050 - (newSliderValue * 10)); 
    };

    const handlePlayPause = () => { 
        if (!isPlaying && currentStep === animationHistory.length - 1) {setCurrentStep(0);} 
        setIsPlaying(!isPlaying); 
    };

    const handleStepBack = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const handleStepForward = () => { setIsPlaying(false); if (currentStep < animationHistory.length - 1) setCurrentStep(currentStep + 1); };

    const displayQueue = animationHistory[currentStep]?.queueState || queueState;
    const currentFrame = animationHistory[currentStep] || {};

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Queue</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Operations</h3>
                        <div className="ds-control-group">
                            <input type="number" placeholder="value" className="ds-input-field" value={value} onChange={handleValueChange}/>
                            <button className="ds-action-button" onClick={handleEnqueue}>Enqueue</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleDequeue}>Dequeue</button>
                            <button className="ds-action-button" onClick={handlePeek}>Peek</button>                                
                        </div>
                    </div>
                        <div className="ds-separator"></div>
                        <div className="ds-controls-section">
                            <h3 className="ds-controls-title">Configuration</h3>
                            <div className="ds-control-group">
                                <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                                    <input type="checkbox" checked={isFixedSize} onChange={handleToggleFixedSize} style={{width: '20px', height: '20px'}}/>
                                    Fixed Size
                                </label>
                                {isFixedSize && (<input type="number" className="ds-input-field" value={capacity} onChange={handleCapacityChange} style={{width: '60px'}}/>)}
                            </div>
                        </div>
                        <div className="ds-separator"></div>
                        <div className="ds-controls-section">
                            <h3 className="ds-controls-title">Utilities</h3>
                            <div className="ds-control-group utilities-group">
                                <button className="ds-action-button" onClick={handleRandom}>Random</button>
                                <button className="ds-action-button" onClick={handleClear}>Clear</button>
                            </div>
                            <div className="ds-control-group utilities-group">
                                <button className="ds-action-button" onClick={handleIsEmpty}>Is Empty?</button>
                                <button className="ds-action-button" onClick={handleIsFull}>Is Full?</button>
                            </div>
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
            <div className="queue-canvas">
                <div className="queue-container">
                    {displayQueue.map((item, i) => {
                        const isHighlighted = currentFrame.highlightIndices?.includes(i);
                        const isDequeuing = currentFrame.type === 'lift-dequeue' && currentFrame.fromIndex === item.id;
                        return (
                            <QueueCell 
                                key={item.id}
                                value={item.value} 
                                index={i} 
                                highlight={isHighlighted} 
                                isDequeuing={isDequeuing}
                            />
                        );
                    })}
                </div>
                {preEnqueueValue !== null && (<div className="queue-pre-enqueue-container"><QueueCell value={preEnqueueValue} isPreEnqueue={true} /></div>)}
            </div>
            <div className="ds-animation-controls">
                <div className="ds-playback-buttons">
                    <button className="ds-playback-button" onClick={handleStepBack} disabled={!animationHistory.length || currentStep === 0}>‹ Step Back</button>
                    <button className="ds-playback-button play" onClick={handlePlayPause} disabled={!animationHistory.length}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button className="ds-playback-button" onClick={handleStepForward} disabled={!animationHistory.length || currentStep >= animationHistory.length - 1}>Step Forward ›</button>
                </div>
                <div className="ds-speed-slider">
                    <span>Animation Speed</span>
                    <input type="range" min="1" max="100" value={sliderValue} onChange={handleSpeedChange}/>
                </div>
            </div>
            {isInfoPanelOpen && <InfoPanel data={dsInfo.queues} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>        
    );
}
export default QueueWorkspace;