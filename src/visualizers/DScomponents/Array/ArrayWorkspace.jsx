import React, { useRef, useEffect } from 'react';
import { DS_Array } from './DS_Array';
import { InfoPanel } from '../InfoPanel';
import { auth, db } from '../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { dsInfo } from '../../data/ds-info';
import { Toast } from '../../Toast/Toast';
import { CheckIcon, BookIcon } from '../../../common/Icons';
import { useWorkspaceLogic} from '../../../hooks/useWorkspaceLogic';
import './Array.css';

const ArrayCell = ({ value, index, highlight, lifted }) => {
    const isInserting = value !== '' && !lifted;
    const cellClasses = `array-cell ${highlight ? 'highlight' : ''} ${lifted ? 'lifted' : ''} ${isInserting ? 'insert' : ''}`;
    return (<div className="array-cell-container"><div className={cellClasses}>{value}</div><div className="array-index">{index}</div></div>);
};

function ArrayWorkspace({ onBack }) {
    const topicId = 'ds-arrays';
    const {
        isInfoPanelOpen, setIsInfoPanelOpen, animationHistory, setAnimationHistory, currentStep, setCurrentStep, isPlaying, setIsPlaying,
        isCompleted, setIsCompleted, animationSpeed, setAnimationSpeed, sliderValue, setSliderValue, arrayState, setArrayState,
        value, setValue, index, setIndex, removeIndex, setRemoveIndex, toast, setToast
    } = useWorkspaceLogic();
    const showToast = (message, type = 'info') => {setToast({ show: true, message, type });};
    const dsArray = useRef(new DS_Array());
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
                await updateDoc(docRef, { completed: arrayUnion(topicId) }); // If not completed, Add the topicId
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
    
    const handleAddAtIndex = () => {
        const val = value;
        const idx = parseInt(index, 10);
        if (val === '' || isNaN(idx)) { 
            showToast("Please enter a valid value and index.", "info");
            return; 
        }
        const history = dsArray.current.insert(idx, val);
        if (typeof history === 'string') {showToast(history, 'error');} 
        else if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setValue('');
        setIndex('');
    };
    
    const handleAddToFront = () => {
        const val = value;
        if (val === '') { 
            showToast("Please enter a value.", "info");
            return; 
        }
        const history = dsArray.current.addToFront(val);
        if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setValue('');
    };

    const handleAddToBack = () => {
        const val = value;
        if (val === '') { 
            showToast("Please enter a value.", "info");
            return; 
        }
        const history = dsArray.current.addToBack(val);
        if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setValue('');
    };

    const handleRemoveAtIndex = () => {
        const idx = parseInt(removeIndex, 10);
        if (isNaN(idx)) { 
            showToast("Please enter a valid index to remove.", "info");
            return; 
        }
        const history = dsArray.current.removeAtIndex(idx);
        if (typeof history === 'string') {showToast(history, 'error');}
        else if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
        setRemoveIndex('');
    };

    const handleRemoveFromFront = () => {
        const history = dsArray.current.removeFromFront();
        if (typeof history === 'string') {showToast(history, 'error');}
        else if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
    };

    const handleRemoveFromBack = () => {
        const history = dsArray.current.removeFromBack();
        if (typeof history === 'string') {showToast(history, 'error');}
        else if (history) {
            setAnimationHistory(history);
            setCurrentStep(0);
            setIsPlaying(true);
        }
    };

    const handleClear = () => {
        const history = dsArray.current.clear();
        setAnimationHistory(history);
        setCurrentStep(history.length - 1);
        setArrayState([]);
    };

    const handleRandom = () => {
        const history = dsArray.current.random();
        setAnimationHistory(history);
        const finalStep = history[history.length - 1];
        setArrayState(finalStep.arrayState);
        setCurrentStep(history.length - 1);
    };

    const displayArray = animationHistory[currentStep]?.arrayState || arrayState;
    const currentFrame = animationHistory[currentStep] || {};
    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Array</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left"> {/* --- Left Side Controls --- */}
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Add</h3>
                        <div className="ds-control-group">
                            <input type="number" placeholder="value" className="ds-input-field" value={value} onChange={handleValueChange}/>
                            <span>at</span>
                            <input type="number" placeholder="index" className="ds-input-field" value={index} onChange={(e) => setIndex(e.target.value)}/>
                            <button className="ds-action-button" onClick={handleAddAtIndex}>Insert</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleAddToFront}>Add to Front</button>
                            <button className="ds-action-button" onClick={handleAddToBack}>Add to Back</button>
                        </div>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Remove</h3>
                        <div className="ds-control-group">
                            <span>from</span>
                            <input type="number" placeholder="index" className="ds-input-field" value={removeIndex} onChange={(e) => setRemoveIndex(e.target.value)}/>
                            <button className="ds-action-button" onClick={handleRemoveAtIndex}>Remove</button>
                        </div>
                        <div className="ds-control-group">
                            <button className="ds-action-button" onClick={handleRemoveFromFront}>Remove from Front</button>
                            <button className="ds-action-button" onClick={handleRemoveFromBack}>Remove from Back</button>
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
                <div className="ds-controls-right">{/* --- Right Side Controls --- */}
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon />
                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}> <BookIcon /> </button>
                    </div>
                </div>
            </div>
            <div className="ds-canvas">
                {(!displayArray || displayArray.length === 0)
                    ? [...Array(6)].map((_, index) => <ArrayCell key={index} value="" index={index} />)
                    : displayArray.map((value, index) => (
                        <ArrayCell 
                            key={index} 
                            value={value === null ? '' : value} 
                            index={index}
                            highlight={currentFrame.indices?.includes(index)}
                            lifted={currentFrame.fromIndex === index}
                        />
                    ))
                }
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
            {isInfoPanelOpen && <InfoPanel data={dsInfo.arrays} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>        
    );
}
export default ArrayWorkspace;