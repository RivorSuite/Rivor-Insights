import React, { useState, useRef, useEffect } from 'react';
import { Algo_LinearSearch } from './Algo_LinearSearch';
import { Toast } from '../../../Toast/Toast';
import { InfoPanel } from '../../../../visualizers/DScomponents/InfoPanel';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { algoInfo } from '../../../data/algo-info';
import { CheckIcon, BookIcon } from '../../../../common/Icons';
import { useWorkspaceLogic } from '../../../../hooks/useWorkspaceLogic';
import './LinearSearch.css';

const SearchCell = ({ value, index, isComparing, isFound }) => {
    const cellClasses = `search-cell ${isComparing ? 'comparing' : ''} ${isFound ? 'found' : ''}`;
    return (
        <div className="search-cell-container">
            <div className={cellClasses}>{value}</div>
            <div className="search-index">{index}</div>
        </div>
    );
};

function LinearSearchWorkspace({ onBack }) {
    const topicId = 'algo-linear-search';
    const {
        isInfoPanelOpen, setIsInfoPanelOpen,
        animationHistory, setAnimationHistory,
        currentStep, setCurrentStep,
        isPlaying, setIsPlaying,
        isCompleted, setIsCompleted,
        animationSpeed, setAnimationSpeed,
        sliderValue, setSliderValue,
        arrayState, setArrayState,
        value, setValue,
        toast, setToast,
    } = useWorkspaceLogic();
    
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
        if (isPlaying && currentStep < animationHistory.length - 1) {
            const timer = setTimeout(() => {setCurrentStep(currentStep + 1);}, animationSpeed);
            return () => clearTimeout(timer);
        } else if (isPlaying && currentStep === animationHistory.length - 1) {
             // When animation finishes
            setIsPlaying(false);
            const finalFrame = animationHistory[animationHistory.length - 2]; // Second to last frame has the result
            if (finalFrame.type === 'found') {showToast(`Value ${finalFrame.arrayState[finalFrame.foundIndex]} found at index ${finalFrame.foundIndex}.`, 'success');}
            else if (finalFrame.type === 'not-found') {showToast(`The value was not found in the array.`, 'error');}
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
    };

    const handleSearch = () => {
        if (value === '') {
            showToast("Please enter a value to search for.", "info");
            return;
        }
        if (arrayState.length === 0) {
            showToast("Please create an array first using the 'Random' button.", "info");
            return;
        }
        const valueToFind = parseInt(value, 10);
        algo.current = new Algo_LinearSearch(arrayState, valueToFind);
        const history = algo.current.run();
        setAnimationHistory(history);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleValueChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        setValue(numericValue.slice(0, 3));
    };

    const handleSpeedChange = (e) => {
        const newSliderValue = parseInt(e.target.value, 10);
        setSliderValue(newSliderValue);
        setAnimationSpeed(1050 - newSliderValue * 10);
    };

    const handlePlayPause = () => {
        if (!isPlaying && currentStep >= animationHistory.length - 1) {setCurrentStep(0);}
        setIsPlaying(!isPlaying);
    };

    const handleStepBack = () => {
        setIsPlaying(false);
        if (currentStep > 0) {setCurrentStep(currentStep - 1);}
    };

    const handleStepForward = () => {
        setIsPlaying(false);
        if (currentStep < animationHistory.length - 1) {setCurrentStep(currentStep + 1);}
    };

    const currentFrame = animationHistory[currentStep] || {};
    const displayArray = currentFrame.arrayState || arrayState;
    const pointerPosition = currentFrame.comparingIndex !== undefined 
        ? (currentFrame.comparingIndex * 108) + 54 
        : null;

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Linear Search</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-control-group">
                        <input type="number" placeholder="value" className="ds-input-field" value={value} onChange={handleValueChange} />
                        <button className="ds-action-button" onClick={handleSearch}>Search</button>
                    </div>
                     <div className="ds-separator"></div>
                    <div className="ds-control-group">
                        <button className="ds-action-button" onClick={handleRandom}>Random Array</button>
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
            <div className="search-canvas">
                <div className="search-container">
                    {pointerPosition !== null && <div className="search-pointer" style={{ left: `${pointerPosition}px` }}></div>}
                    {displayArray.map((val, index) => (
                        <SearchCell
                            key={index}
                            value={val}
                            index={index}
                            isComparing={index === currentFrame.comparingIndex}
                            isFound={index === currentFrame.foundIndex}
                        />
                    ))}
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
            {isInfoPanelOpen && <InfoPanel data={algoInfo.linearSearch} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}
export default LinearSearchWorkspace;
