import React, { useState, useRef, useEffect } from 'react';
import { Algo_BubbleSort } from './Algo_BubbleSort';
import { Toast } from '../../../Toast/Toast';
import { InfoPanel } from '../../../../visualizers/DScomponents/InfoPanel';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { algoInfo } from '../../../data/algo-info';
import { CheckIcon, BookIcon } from '../../../../common/Icons';
import { useWorkspaceLogic } from '../../../../hooks/useWorkspaceLogic';
import './BubbleSort.css';

const SortCell = ({ value, index, isComparing, isSwapping, isSorted }) => {
    const cellClasses = `sort-cell ${isComparing ? 'comparing' : ''} ${isSwapping ? 'swapping' : ''} ${isSorted ? 'sorted' : ''}`;
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

function BubbleSortWorkspace({ onBack }) {
    const topicId = 'algo-bubble-sort';
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
    } = useWorkspaceLogic();

    useEffect(() => {
        setSliderValue(50);
        setAnimationSpeed(2100 - (50 * 20)); 
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
    
        // Show a toast when a swap is about to happen
        if (currentFrame && currentFrame.type === 'swap') {showToast(`${currentFrame.value1} > ${currentFrame.value2}, so swap.`, 'info');}
        // Show a toast when no swap occurs
        if (currentFrame && currentFrame.type === 'no-swap') {showToast(currentFrame.description, 'info');}
    
        if (isPlaying && currentStep < animationHistory.length - 1) {
            const timer = setTimeout(() => { setCurrentStep(currentStep + 1); }, animationSpeed);
            return () => clearTimeout(timer);
        }
        else if (isPlaying && currentStep >= animationHistory.length - 1) {
            // When the animation reaches the end
            setIsPlaying(false);
            //check the final frame's description to avoid showing a toast on an early exit
            const finalFrame = animationHistory[animationHistory.length - 1];
            if (finalFrame && finalFrame.description.includes('complete')) {showToast("Sorting complete!", "success");}
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

    const handleRandom = () => {
        const size = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
        const uniqueNumbers = new Set();
        while (uniqueNumbers.size < size) {uniqueNumbers.add(Math.floor(Math.random() * 100));}
        const newArray = Array.from(uniqueNumbers);
        setArrayState(newArray);
        setAnimationHistory([]);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const handleSort = () => {
        if (arrayState.length === 0) {
            showToast("Please create an array first using the 'Random' button.", "info");
            return;
        }
        algo.current = new Algo_BubbleSort(arrayState);
        const history = algo.current.run();
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
    const { comparingIndices, swapIndices, sortedCount, i, j } = currentFrame;

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Bubble Sort</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-control-group">
                        <button className="ds-action-button" onClick={handleSort}>Sort</button>
                    </div>
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
                    {j !== undefined && <Pointer label="j" type="j" index={j} />}{/* Render Pointers */}
                    {j !== undefined && <Pointer label="j+1" type="jplus1" index={j + 1} />}
                    {displayArray.map((val, index) => {
                        const isComparing = comparingIndices?.includes(index);
                        const isSwapping = swapIndices?.includes(index);
                        const isSorted = index >= displayArray.length - (sortedCount || 0);
                        return (
                            <SortCell
                                key={index}
                                value={val}
                                index={index}
                                isComparing={isComparing}
                                isSwapping={isSwapping}
                                isSorted={isSorted}
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
            {isInfoPanelOpen && <InfoPanel data={algoInfo.bubbleSort || {}} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}
export default BubbleSortWorkspace;