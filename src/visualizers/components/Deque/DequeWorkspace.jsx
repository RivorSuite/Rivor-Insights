import React, { useState, useRef, useEffect } from 'react';
import './Deque.css';
import { DS_Deque } from '../../datastructures/DS_Deque';
import { InfoPanel } from '../InfoPanel';
import { Toast } from '../Toast/Toast';
import { auth, db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { dsInfo } from '../../data/ds-info';

const DequeCell = ({ value, index, highlight, liftedFront, liftedBack, isPreAdd }) => {
    const cellClasses = `deque-cell ${highlight ? 'highlight' : ''} ${liftedFront ? 'lifted-front' : ''} ${liftedBack ? 'lifted-back' : ''} ${isPreAdd ? 'pre-add' : ''}`;
    return (
        <div className="deque-cell-container">
            <div className={cellClasses}>{value}</div>
            <div className="deque-index">{index}</div>
        </div>
    );
};

const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );
const BookIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> );

function DequeWorkspace({ onBack }) {
    const [value, setValue] = useState('');
    const [sliderValue, setSliderValue] = useState(50);
    const [animationSpeed, setAnimationSpeed] = useState(1050 - (50 * 10));
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [dequeState, setDequeState] = useState([]);
    const [animationHistory, setAnimationHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const topicId = 'ds-deques';
    const dsDeque = useRef(new DS_Deque());
    const [preAddValue, setPreAddValue] = useState({ value: null, side: null });
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [isFixedSize, setIsFixedSize] = useState(false);
    const [capacity, setCapacity] = useState('');

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        const checkCompletion = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const docRef = doc(db, "userProgress", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().completed?.includes(topicId)) {
                setIsCompleted(true);
            }
        };
        checkCompletion();
    }, []);

    useEffect(() => {
        if (isPlaying && currentStep < animationHistory.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, animationSpeed);
            return () => clearTimeout(timer);
        } else {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStep, animationHistory, animationSpeed]);

    useEffect(() => {
        const currentFrame = animationHistory[currentStep];
        if (currentFrame?.type === 'pre-add-front') {
            setPreAddValue({ value: currentFrame.value, side: 'front' });
        } else if (currentFrame?.type === 'pre-add-back') {
            setPreAddValue({ value: currentFrame.value, side: 'back' });
        } else {
            setPreAddValue({ value: null, side: null });
        }
    }, [currentStep, animationHistory]);

    const handleOperation = (operation, ...args) => {
        const history = dsDeque.current[operation](...args);
        if (history) {
            const errorStep = history.find(step => step.type === 'error');
            if (errorStep) {
                showToast(errorStep.description, 'error');
                return;
            }
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
            const animationDuration = (history.length) * animationSpeed;
            setTimeout(() => {
                const finalState = dsDeque.current._recordHistory().dequeState; // Get current state
                setDequeState(finalState || []);
            }, animationDuration);
        }
    };

    const handleCompleteTopic = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) {
                await updateDoc(docRef, { completed: arrayRemove(topicId) });
                setIsCompleted(false);
            } else {
                await updateDoc(docRef, { completed: arrayUnion(topicId) });
                setIsCompleted(true);
            }
        } catch (error) {
            if (error.code === 'not-found' && !isCompleted) {
                await setDoc(docRef, { completed: [topicId] });
                setIsCompleted(true);
            }
        }
    };

    // --- UPDATED HANDLERS WITH VALIDATION ---

    const handleAddFront = () => {
        if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        if (!value) return showToast("Please enter a value.", "info");
        handleOperation('addToFront', value);
        setValue('');
    };

    const handleAddBack = () => {
        if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        if (!value) return showToast("Please enter a value.", "info");
        handleOperation('addToBack', value);
        setValue('');
    };

    const handleRemoveFront = () => {
         if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        handleOperation('removeFromFront');
    }

    const handleRemoveBack = () => {
         if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        handleOperation('removeFromBack');
    }

    const handlePeekFront = () => {
        if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        const history = dsDeque.current.peekFront();
        if (history.some(step => step.type === 'error')) {
            showToast("Deque is empty.", "error");
            return;
        }
        showToast(`Front value is ${dsDeque.current.head.value}`, 'success');
        setAnimationHistory(history);
        setCurrentStep(history.findIndex(frame => frame.type === 'highlight'));
        setIsPlaying(false);
    };
    
    const handlePeekBack = () => {
        if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        const history = dsDeque.current.peekBack();
        if (history.some(step => step.type === 'error')) {
            showToast("Deque is empty.", "error");
            return;
        }
        showToast(`Back value is ${dsDeque.current.tail.value}`, 'success');
        setAnimationHistory(history);
        setCurrentStep(history.findIndex(frame => frame.type === 'highlight'));
        setIsPlaying(false);
    };

    const handleRandom = () => {
        if (dsDeque.current.isFixedSize && dsDeque.current.capacity <= 0) {
            showToast("Please set a fixed size capacity (1-10).", "error"); return;
        }
        const history = dsDeque.current.random();
        if (history) {
            const finalStep = history[history.length - 1];
            setAnimationHistory(history);
            setDequeState(finalStep.dequeState || []);
            setCurrentStep(history.length - 1);
            setIsPlaying(false);
        }
    };

    const handleClear = () => {
        handleOperation('clear');
        setDequeState([]);
    };

    const handleToggleFixedSize = () => {
        const newIsFixedSize = !isFixedSize;
        setIsFixedSize(newIsFixedSize);
        setCapacity('');
        dsDeque.current.setType(newIsFixedSize);
        dsDeque.current.setCapacity(newIsFixedSize ? 0 : 10);
        setDequeState([]);
        setAnimationHistory([]);
        setCurrentStep(0);
    };

    const handleCapacityChange = (e) => {
        const rawValue = e.target.value;
        if (rawValue === '') {
            setCapacity('');
            dsDeque.current.setCapacity(0);
            setDequeState([]);
            return;
        }
        let newCapacity = parseInt(rawValue, 10);
        if (newCapacity > 10) {
            newCapacity = 10;
            showToast("Maximum capacity is 10.", "info");
        }
        setCapacity(newCapacity);
        dsDeque.current.setCapacity(newCapacity);
        setDequeState([]);
    };

    const handleValueChange = (e) => { const numericValue = e.target.value.replace(/[^0-9]/g, ''); setValue(numericValue.slice(0, 6)); };
    const handleSpeedChange = (e) => { const newSliderValue = parseInt(e.target.value, 10); setSliderValue(newSliderValue); setAnimationSpeed(1050 - (newSliderValue * 10)); };
    const handlePlayPause = () => { if (!isPlaying && currentStep === animationHistory.length - 1) { setCurrentStep(0); } setIsPlaying(!isPlaying); };
    const handleStepBack = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const handleStepForward = () => { setIsPlaying(false); if (currentStep < animationHistory.length - 1) setCurrentStep(currentStep + 1); };

    const handleIsEmpty = () => {
        const isEmpty = dsDeque.current.size === 0;
        showToast(isEmpty ? "Deque is empty." : "Deque is not empty.", "info");
    };
    
    const handleIsFull = () => {
        if (!dsDeque.current.isFixedSize) {
            showToast("This check only applies to fixed-size deques.", "info");
            return;
        }
        const isFull = dsDeque.current.size >= dsDeque.current.capacity;
        showToast(isFull ? "Deque is full." : "Deque is not full.", "info");
    };

    const displayDeque = animationHistory[currentStep]?.dequeState || dequeState;
    const currentFrame = animationHistory[currentStep] || {};

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Deque</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>

            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Operations</h3>
                        <div className="ds-control-group">
                            <input type="number" placeholder="value" className="ds-input-field" value={value} onChange={handleValueChange}/>
                            <button className="ds-action-button" onClick={handleAddFront}>Add Front</button>
                            <button className="ds-action-button" onClick={handleAddBack}>Add Back</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleRemoveFront}>Remove Front</button>
                            <button className="ds-action-button" onClick={handleRemoveBack}>Remove Back</button>
                        </div>
                         <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handlePeekFront}>Peek Front</button>
                            <button className="ds-action-button" onClick={handlePeekBack}>Peek Back</button>
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
                            {isFixedSize && (
                                <input type="number" className="ds-input-field" value={capacity} onChange={handleCapacityChange} style={{width: '60px'}}/>
                            )}
                        </div>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Utilities</h3>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleRandom}>Random</button>
                            <button className="ds-action-button" onClick={handleClear}>Clear</button>
                        </div>
                        <div className="ds-control-group">
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
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}>
                            <BookIcon />
                        </button>
                    </div>
                </div>
            </div>

            <div className="deque-canvas">
                <div className="deque-container">
                    {displayDeque.map((node, i) => (
                        <DequeCell 
                            key={node.id}
                            value={node.value} 
                            index={i} 
                            highlight={currentFrame.highlightIndices?.includes(i)}
                            liftedFront={currentFrame.type === 'lift-front' && currentFrame.fromIndex === node.id}
                            liftedBack={currentFrame.type === 'lift-back' && currentFrame.fromIndex === node.id}
                        />
                    ))}
                </div>
                {preAddValue.value !== null && (
                    <div className={`deque-pre-add-container ${preAddValue.side}`}>
                        <DequeCell value={preAddValue.value} isPreAdd={true} />
                    </div>
                )}
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
            {isInfoPanelOpen && <InfoPanel data={dsInfo.deques} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}

export default DequeWorkspace;