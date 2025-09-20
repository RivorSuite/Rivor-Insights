import React, { useRef, useEffect } from 'react';
import { DS_CircularLinkedList } from './DS_CircularLinkedList';
import { InfoPanel } from '../InfoPanel';
import { auth, db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { dsInfo } from '../../data/ds-info';
import { Toast } from '../../Toast/Toast';
import { CheckIcon, BookIcon } from '../../../common/Icons';
import { useWorkspaceLogic} from '../../../hooks/useWorkspaceLogic';
import './CircularLinkedList.css';

const CircularLinkedListNode = ({ value, isHead, isTail, highlight, traversed, isNew, isDetached, lifted }) => {
    const nodeClasses = `ll-node ${highlight ? 'highlight' : ''} ${lifted ? 'lifted' : ''} ${traversed ? 'traversed' : ''}`;
    const pointerClasses = `ll-node-pointer ${isTail ? 'is-tail' : ''}`;
    if (value === null) {return (<div className="ll-node-wrapper"><div className="ll-node-container"><div className="ll-node null-node"></div></div></div>);}
    return (
        <div className="ll-node-wrapper">
            <div className="ll-node-container">
                <div className={nodeClasses}>
                    <div className="ll-node-value">{value}</div>
                    <div className={pointerClasses}></div>
                </div>
                {!isTail && <div className="ll-connector"></div>}
            </div>
        </div>
    );
};

function CircularLinkedListWorkspace({ onBack }) {
    const topicId = 'ds-circular-linked-list';const {
        isInfoPanelOpen, setIsInfoPanelOpen, animationHistory, setAnimationHistory, currentStep, setCurrentStep, isPlaying, setIsPlaying,
        isCompleted, setIsCompleted, animationSpeed, setAnimationSpeed, sliderValue, setSliderValue, listState, setListState,
        value, setValue, index, setIndex, removeIndex, setRemoveIndex, toast, setToast
    } = useWorkspaceLogic();
    const dsCircularList = useRef(new DS_CircularLinkedList());
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

    const handleCompleteTopic = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) {
                await updateDoc(docRef, { completed: arrayRemove(topicId) }); // If already completed, REMOVE the topicId
                setIsCompleted(false);
            } 
            else {
                await updateDoc(docRef, { completed: arrayUnion(topicId) });// If not completed, Add the topicId
                setIsCompleted(true);
            }
        } 
        catch (error) {
            if (error.code === 'not-found' && !isCompleted) { // This handles the case where the user has no progress doc yet
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
        }
        else {setIsPlaying(!isPlaying);}
    };

    const handleStepBack = () => {
        setIsPlaying(false);
        if (currentStep > 0) {setCurrentStep(currentStep - 1);}
    };

    const handleStepForward = () => {
        setIsPlaying(false);
        if (currentStep < animationHistory.length - 1) {setCurrentStep(currentStep + 1);}
    };
    
    const handleOperation = (operation) => {
        const history = operation(dsCircularList.current); // 1. Run the specific DS function (e.g., addToHead) to get the animation steps
        if (history) {
            setAnimationHistory(history); // 2. Set the state to start the animation
            setCurrentStep(0);
            setIsPlaying(true);
            const animationDuration = (history.length - 1) * animationSpeed; // 3. After the animation is over, update the real list state
            setTimeout(() => {
                const finalState = dsCircularList.current.getListState();
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
        const history = dsCircularList.current.addAtIndex(idx, val);
        if (typeof history === 'string') {showToast(history, 'error');}
        else if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setValue('');
        setIndex('');
    };
    
    const handleRemoveFromHead = () => {
        const history = dsCircularList.current.removeFromHead();
        if (typeof history === 'string') {showToast(history, 'error');}
        else {handleOperation(() => history);}
    };
    
    const handleRemoveFromTail = () => {
        const history = dsCircularList.current.removeFromTail();
        if (typeof history === 'string') {showToast(history, 'error');}
        else {handleOperation(() => history);}
    };

    const handleRemoveAtIndex = () => {
        const idx = parseInt(removeIndex, 10);
        if (isNaN(idx)) {
            showToast("Please enter a valid index.", "info");
            return;
        }
        const history = dsCircularList.current.removeAtIndex(idx);
        if (typeof history === 'string') {showToast(history, 'error');}
        else if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setRemoveIndex('');
    };

    const handleClear = () => {
        const history = dsCircularList.current.clear();
        if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
            setListState([]); 
        }
    };

    const handleRandom = () => {
        const history = dsCircularList.current.random();
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
                <h1 className="auth-title" style={{ margin: 0 }}>Circular Linked List</h1>       
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
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
            <div className="ds-canvas" style={{'--list-size': displayList.length}}>
                <div className="cll-wrapper">
                    {displayList.length === 0
                        ? [...Array(6)].map((_, i) => (
                            <CircularLinkedListNode
                                key={i}
                                value={''}
                                isHead={i === 0}
                                isTail={i === 5}
                                highlight={false} 
                            />
                        ))
                        : displayList.map((nodeValue, i) => {
                            const isHighlighted = currentFrame.highlightIndices?.includes(i);
                            const isLifted = currentFrame.fromIndex === i;
                            const isTraversed = currentFrame.traversedIndex === i;
                            return (
                                <CircularLinkedListNode
                                    key={i}
                                    value={nodeValue}
                                    isHead={i === 0}
                                    isTail={i === displayList.length - 1}
                                    highlight={isHighlighted}
                                    lifted={isLifted}
                                    traversed={isTraversed}
                                />
                            );
                        })
                    }
                    {displayList.length > 0 && <div className="cll-loop-connector"></div>}
                </div>
            </div>
            <div className="ds-animation-controls">
                <div className="ds-playback-buttons">
                    <button className="ds-playback-button" onClick={handleStepBack} disabled={!animationHistory.length || currentStep === 0}> ‹ Step Back </button>
                    <button className="ds-playback-button play" onClick={handlePlayPause} disabled={!animationHistory.length}> {isPlaying ? 'Pause' : 'Play'} </button>
                    <button className="ds-playback-button" onClick={handleStepForward} disabled={!animationHistory.length || currentStep >= animationHistory.length - 1}> Step Forward › </button>
                </div>
                <div className="ds-speed-slider">
                    <span>Animation Speed</span>
                    <input type="range" min="1" max="100" value={sliderValue} onChange={handleSpeedChange}/>
                </div>
            </div>
            {isInfoPanelOpen && <InfoPanel data={dsInfo.circularLinkedLists} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>        
    );
}
export default CircularLinkedListWorkspace;