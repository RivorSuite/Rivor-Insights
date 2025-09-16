import React, { useState, useRef, useEffect } from 'react';
import { DS_SinglyLinkedList } from '../../datastructures/DS_SinglyLinkedList';
import { InfoPanel } from '../InfoPanel';
import { auth, db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { dsInfo } from '../../data/ds-info';
import { Toast } from '../Toast/Toast';

const LinkedListNode = ({ value, isHead, isTail, highlight, traversed, isNew, isDetached, lifted }) => {
    const nodeClasses = `ll-node ${highlight ? 'highlight' : ''} ${lifted ? 'lifted' : ''} ${traversed ? 'traversed' : ''}`;
    const pointerClasses = `ll-node-pointer ${isTail ? 'is-tail' : ''}`;

    // Render an empty box for null values
    if (value === null) {
        return (
            <div className="ll-node-wrapper">
                <div className="ll-node-container">
                    <div className="ll-node null-node"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="ll-node-wrapper">
            <div className="ll-node-container">
                {/* isHead && value !== null && <div className="ll-pointer">Head</div> */}
                <div className={nodeClasses}>
                    <div className="ll-node-value">{value}</div>
                    <div className={pointerClasses}></div>
                </div>
                {!isTail && <div className="ll-connector"></div>}
            </div>
        </div>
    );
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);


function LinkedListWorkspace({ onBack }) {
    const [value, setValue] = useState('');
    const [index, setIndex] = useState('');
    const [removeIndex, setRemoveIndex] = useState('');
    const [sliderValue, setSliderValue] = useState(50);
    const [animationSpeed, setAnimationSpeed] = useState(1050 - (50 * 10));
    
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [listState, setListState] = useState([]);    
    const [animationHistory, setAnimationHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // --- NEW: State for completion status ---
    const [isCompleted, setIsCompleted] = useState(false);
    const topicId = 'ds-singly-linked-list'; // The ID from your roadmapData

    const dsLinkedList = useRef(new DS_SinglyLinkedList());
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
    };

    // --- NEW: useEffect to check completion status on load ---
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
        } 
        else {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStep, animationHistory, animationSpeed]);

    const handleCompleteTopic = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "userProgress", user.uid);

        try {
            if (isCompleted) {
                // If already completed, REMOVE the topicId
                await updateDoc(docRef, { completed: arrayRemove(topicId) });
                setIsCompleted(false);
            } 
            else {
                // If not completed, ADD the topicId
                await updateDoc(docRef, { completed: arrayUnion(topicId) });
                setIsCompleted(true);
            }
        } 
        catch (error) {
            // This handles the case where the user has no progress doc yet
            if (error.code === 'not-found' && !isCompleted) {
                await setDoc(docRef, { completed: [topicId] });
                setIsCompleted(true);
            } 
            else {
                console.error("Error updating progress:", error);
                alert("Could not save progress. Please check the console.");
            }
        }
    };
    
    const handleValueChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        setValue(numericValue.slice(0, 6));
    };
    
    const handleSpeedChange = (e) => {
        const newSliderValue = parseInt(e.target.value, 10);
        setSliderValue(newSliderValue);
        const newSpeed = 1050 - (newSliderValue * 10);
        setAnimationSpeed(newSpeed);
    };

    const handlePlayPause = () => {
        if (!isPlaying && currentStep === animationHistory.length - 1) {
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const handleStepBack = () => {
        setIsPlaying(false);
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepForward = () => {
        setIsPlaying(false);
        if (currentStep < animationHistory.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleOperation = (operation) => {
        // 1. Run the specific DS function (e.g., addToHead) to get the animation steps
        const history = operation(dsLinkedList.current);
    
        if (history) {
            // 2. Set the state to start the animation
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);

            // 3. IMPORTANT: After the animation is over, update the real list state
            // This prevents bugs if the user pauses or steps back and forth
            const animationDuration = (history.length - 1) * animationSpeed;
            setTimeout(() => {
                const finalState = dsLinkedList.current.getListState();
                setListState(finalState);
            }, animationDuration);
        }
    };

    const handleAddToHead = () => {
        const val = value;
        if (val === '') {
            showToast("Please enter a value.", "info");
            return;
        }
        handleOperation(ds => ds.addToHead(val));
        setValue('');
    };
    
    const handleAddToTail = () => {
        const val = value;
        if (val === '') {
            showToast("Please enter a value.", "info");
            return;
        }
        handleOperation(ds => ds.addToTail(val));
        setValue('');
    };

    const handleAddAtIndex = () => {
        const val = value;
        const idx = parseInt(index, 10);
        if (val === '' || isNaN(idx)) {
            showToast("Please enter a valid value and index.", "info");
            return;
        }
        
        const result = dsLinkedList.current.addAtIndex(idx, val);
        if (typeof result === 'string') {
            showToast(result, 'error');
        } else if (result) {
            setAnimationHistory(result);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setValue('');
        setIndex('');
    };
    
    const handleRemoveFromHead = () => {
        const result = dsLinkedList.current.removeFromHead();
        if (typeof result === 'string') {showToast(result, 'error');}
        else {
            handleOperation(() => result);
        }
    };

    const handleRemoveFromTail = () => {
        const result = dsLinkedList.current.removeFromTail();
        if (typeof result === 'string') {showToast(result, 'error');}
        else {
            handleOperation(() => result);
        }
    };

    const handleRemoveAtIndex = () => {
        const idx = parseInt(removeIndex, 10);
        if (isNaN(idx)) {
            showToast("Please enter a valid index.", "info");
            return;
        }
        
        const result = dsLinkedList.current.removeAtIndex(idx);
        if (typeof result === 'string') {
            showToast(result, 'error');
        } else if (result) {
            setAnimationHistory(result);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setRemoveIndex('');
    };

    const handleClear = () => {
        const history = dsLinkedList.current.clear();
        if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
            // ADD THIS LINE to reset the stable state
            setListState([]); 
        }
    };

    const handleRandom = () => {
        const history = dsLinkedList.current.random();
        if (history) {
            const finalStep = history[history.length - 1];
            setListState(finalStep.listState);
            setAnimationHistory(history);
            setCurrentStep(history.length - 1);
            setIsPlaying(false);
        }
    };

    const displayList = animationHistory[currentStep]?.listState || listState;
    const currentFrame = animationHistory[currentStep] || {};

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Singly Linked List</h1>
                
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            
            {/* --- UPDATE: The control panel now has Linked List buttons --- */}
            <div className="ds-controls-panel">
                {/* --- Left Side Controls --- */}

                <div className="ds-controls-left">
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Add</h3>
                        <div className="ds-control-group">
                            <input type="number" placeholder="value" className="ds-input-field" value={value} onChange={handleValueChange}/>
                            <span>at</span>
                            <input type="number" placeholder="index" className="ds-input-field" value={index} onChange={(e) => setIndex(e.target.value)}/>
                            <button className="ds-action-button" onClick={handleAddAtIndex}>Add at Index</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleAddToHead}>Add to Head</button>
                            <button className="ds-action-button" onClick={handleAddToTail}>Add to Tail</button>
                        </div>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Remove</h3>
                        <div className="ds-control-group">
                             <span>from</span>
                            <input type="number" placeholder="index" className="ds-input-field" value={removeIndex} onChange={(e) => setRemoveIndex(e.target.value)}/>
                            <button className="ds-action-button" onClick={handleRemoveAtIndex}>Remove from Index</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleRemoveFromHead}>Remove from Head</button>
                            <button className="ds-action-button" onClick={handleRemoveFromTail}>Remove from Tail</button>
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
                </div>

                {/* --- Right Side Controls --- */}
                <div className="ds-controls-right">
                    {/* The wrapper stacks the book icon and the full completion button */}
                    <div className="stacked-buttons-container">
                        {/* This is the full-width completion button */}
                        <button
                            className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`}
                            onClick={handleCompleteTopic}
                        >
                            <CheckIcon />
                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}>
                            <BookIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- UPDATE: The canvas now renders Linked List nodes --- */}
            <div className="ds-canvas">
                {displayList.length === 0
                    ? [...Array(6)].map((_, i) => (
                        <LinkedListNode
                            key={i}
                            value={''} // Use an empty string instead of null
                            isHead={i === 0}
                            isTail={i === 5}
                            // Pass highlight as false to prevent accent color
                            highlight={false} 
                        />
                    ))
                    : displayList.map((nodeValue, i) => {
                        const isHighlighted = currentFrame.highlightIndices?.includes(i);
                        const isLifted = currentFrame.fromIndex === i;
                        const isTraversed = currentFrame.traversedIndex === i;
        
                        return (
                            <LinkedListNode
                                key={i}
                                value={nodeValue}
                                isHead={i === 0}
                                isTail={i === displayList.length - 1}
                                highlight={isHighlighted}
                                lifted={isLifted}
                                traversed={isTraversed}
                            />
                        )
                    })
                }
            </div>

            <div className="ds-animation-controls">
                <div className="ds-playback-buttons">
                    <button className="ds-playback-button" onClick={handleStepBack} disabled={!animationHistory.length || currentStep === 0}>
                        ‹ Step Back
                    </button>
                    <button className="ds-playback-button play" onClick={handlePlayPause} disabled={!animationHistory.length}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button className="ds-playback-button" onClick={handleStepForward} disabled={!animationHistory.length || currentStep >= animationHistory.length - 1}>
                        Step Forward ›
                    </button>
                </div>
                <div className="ds-speed-slider">
                    <span>Animation Speed</span>
                    <input type="range" min="1" max="100" value={sliderValue} onChange={handleSpeedChange}/>
                </div>
            </div>
            {/* --- NEW: Add the InfoPanel, controlled by state --- */}
            {isInfoPanelOpen && <InfoPanel data={dsInfo.singlyLinkedLists} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>        
    );
}

export default LinkedListWorkspace;

/*
1 small change left is ui based i was thinking we make the last node which doesnt have an arrow to have its tail pointer block to be the opposite color of the accent since there is nothing after that block and if we add new block next to it the new block will have its pointer change to opposite of accent color and if we remove that last block the previous block will have its pointer color change as it loses its arrow. The color of the end pointer will always be opposite of the accent color. Is that good idea?*/
