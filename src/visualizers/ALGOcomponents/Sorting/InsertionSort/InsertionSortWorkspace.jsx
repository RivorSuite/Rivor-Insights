import React, { useState, useRef, useEffect } from 'react';
import { Algo_InsertionSort } from './Algo_InsertionSort';
import { Toast } from '../../../Toast/Toast';
import { InfoPanel } from '../../../../visualizers/DScomponents/InfoPanel';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { algoInfo } from '../../../data/algo-info';
import { CheckIcon, BookIcon } from '../../../../common/Icons';
import { useWorkspaceLogic } from '../../../../hooks/useWorkspaceLogic';
import './InsertionSort.css';

const SortCell = ({ value, index, isComparing, isKey, isSorted, isInsertedKey }) => {
    const cellClasses = `sort-cell ${isComparing ? 'comparing' : ''} ${isKey ? 'key' : ''} ${isSorted ? 'sorted' : ''} ${isInsertedKey ? 'inserted-key' : ''}`;
    return (
        <div className="sort-cell-container">
            <div className={cellClasses}>{value}</div>
            <div className="sort-index">{index}</div>
        </div>
    );
};

const Pointer = ({ label, type, index }) => {
    if (index === null || index < 0) return null;
    const position = (index * 112.8) + 52.4; 
    return (
        <div className={`pointer pointer-${type}`} style={{ left: `${position}px` }}>
            <div className="pointer-label">{label}</div>
            <div className="pointer-arrow"></div>
        </div>
    );
};

function InsertionSortWorkspace({ onBack }) {
    const topicId = 'algo-insertion-sort';
    const {
        isInfoPanelOpen, setIsInfoPanelOpen,
        animationHistory, setAnimationHistory,
        currentStep, setCurrentStep,
        isPlaying, setIsPlaying,
        isCompleted, setIsCompleted,
        animationSpeed, setAnimationSpeed,
        sliderValue, setSliderValue,
        arrayState, setArrayState,
        toast, setToast,
        keyDisplayValue, setKeyDisplayValue,
    } = useWorkspaceLogic();

    useEffect(() => {
        setSliderValue(50);
        setAnimationSpeed(2100 - (50 * 20)); // Set a slower initial speed
    }, []);
    
    const algo = useRef(null);
    const showToast = (message, type = 'info') => { setToast({ show: true, message, type }); };

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
        const currentFrame = animationHistory[currentStep];
    
        if (currentFrame) {
            // Use the persistent keyValue from the history frame
            if (currentFrame.keyValue !== undefined) {setKeyDisplayValue(currentFrame.keyValue);}
            if (currentFrame.type === 'end') {setKeyDisplayValue(null);} // Hide the key block at the end
            // Show toasts for key algorithm steps
            if (['key-select', 'shift', 'insert', 'compare-fail'].includes(currentFrame.type)) {showToast(currentFrame.description, 'info');}
        }
        if (isPlaying && currentStep < animationHistory.length - 1) {
            const timer = setTimeout(() => { setCurrentStep(currentStep + 1); }, animationSpeed);
            return () => clearTimeout(timer);
        }
        else if (isPlaying && currentStep >= animationHistory.length - 1) {
            setIsPlaying(false);
            const finalFrame = animationHistory[animationHistory.length - 1];
            if (finalFrame) {showToast(finalFrame.description, "success");}
        }
    }, [isPlaying, currentStep, animationHistory, animationSpeed]);

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
                await setDoc(docRef, { completed: arrayUnion(topicId) }, { merge: true });
                setIsCompleted(true);
            }
        }
        catch (error) {console.error("Error updating progress:", error);}
    };

    const handleRandom = () => {
        const size = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
        const uniqueNumbers = new Set();
        while (uniqueNumbers.size < size) {uniqueNumbers.add(Math.floor(Math.random() * 100));}
        const newArray = Array.from(uniqueNumbers);
        setArrayState(newArray);
        setAnimationHistory([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setKeyDisplayValue(null); // Hide the key block
    };

    const handleSort = () => {
        if (arrayState.length === 0) {
            showToast("Please create an array first.", "info");
            return;
        }
        algo.current = new Algo_InsertionSort(arrayState);
        const history = algo.current.run();
        setKeyDisplayValue(history[0]?.arrayState[1] || null); // Show the first key
        setAnimationHistory(history);
        setCurrentStep(0);
        setIsPlaying(true);
    };
    
    const handleSpeedChange = (e) => {
        const newSliderValue = parseInt(e.target.value, 10);
        setSliderValue(newSliderValue);
        setAnimationSpeed(2100 - newSliderValue * 20);
    };

    const handlePlayPause = () => {
        if (!isPlaying && currentStep >= animationHistory.length - 1) {setCurrentStep(0);}
        setIsPlaying(!isPlaying);
    };

    const handleStepBack = () => {
        setIsPlaying(false);
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleStepForward = () => {
        setIsPlaying(false);
        if (currentStep < animationHistory.length - 1) setCurrentStep(currentStep + 1);
    };

    const currentFrame = animationHistory[currentStep] || {};
    const displayArray = currentFrame.arrayState || arrayState;
    const { keyIndex, comparingIndex, sortedCount } = currentFrame;
    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Insertion Sort</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-control-group"> <button className="ds-action-button" onClick={handleSort}>Sort</button> </div>
                    <div className="ds-separator"></div>
                    <div className="ds-control-group"> <button className="ds-action-button" onClick={handleRandom}>Random Array</button> </div>
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
            <div className="search-canvas">
                <div className="search-container">
                {keyDisplayValue !== null && (
                    <div className="key-display-container">
                        <div className="sort-cell-container">
                            <div className="sort-cell key">{keyDisplayValue}</div>
                            <div className="sort-index">key</div>
                        </div>
                    </div>
                )}
                    {keyIndex !== undefined && <Pointer label="key" type="key" index={keyIndex} />}
                    {comparingIndex !== undefined && <Pointer label="j" type="j" index={comparingIndex} />}
                    {displayArray.map((val, index) => {
                        const isSorted = index < (sortedCount || 0);
                        const isInsertedKey = index === currentFrame.insertedIndex;
                        return (
                            <SortCell
                                key={index}
                                value={val}
                                index={index}
                                isComparing={index === comparingIndex}
                                isKey={index === keyIndex}
                                isSorted={isSorted && !isInsertedKey} // Don't apply sorted style if it's the newly inserted key
                                isInsertedKey={isInsertedKey} // Pass down the new prop
                            />
                        );
                    })}
                </div>
            </div>
            <div className="ds-animation-controls">
                <div className="ds-playback-buttons">
                    <button className="ds-playback-button" onClick={handleStepBack} disabled={!animationHistory.length || currentStep === 0}>‹ Step Back</button>
                    <button className="ds-playback-button play" onClick={handlePlayPause} disabled={!animationHistory.length}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button className="ds-playback-button" onClick={handleStepForward} disabled={!animationHistory.length || currentStep >= animationHistory.length - 1}>Step Forward ›</button>
                </div>
                <div className="ds-speed-slider">
                    <span>Animation Speed</span>
                    <input type="range" min="1" max="100" value={sliderValue} onChange={handleSpeedChange} />
                </div>
            </div>
            {isInfoPanelOpen && <InfoPanel data={algoInfo.insertionSort || {}} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}
export default InsertionSortWorkspace;