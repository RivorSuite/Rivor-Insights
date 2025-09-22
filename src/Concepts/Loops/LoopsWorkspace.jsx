import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './Loops.css';
import { conceptsInfo } from '../concepts-data.js';
import { ConceptInfoPanel } from '../ConceptInfoPanel';
import { Toast } from '../../visualizers/Toast/Toast.jsx';
import { CheckIcon, BookIcon } from '../../common/Icons.jsx';

// --- Animation Timeline Generation ---
const generateForLoopTimeline = (data, options) => {
    const timeline = [];
    const { useContinue, continuePoint, useBreak, breakPoint } = options;
    const continueVal = parseInt(continuePoint, 10);
    const breakVal = parseInt(breakPoint, 10);
    const output = [];

    timeline.push({ activeLines: [0], currentIndex: -1, currentItem: null, status: 'Initializing...', output: [] });

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        timeline.push({ activeLines: [1], currentIndex: i, currentItem: item, status: `Iterator points to index ${i}`, output: [...output] });

        if (useContinue) {
            timeline.push({ activeLines: [2], currentIndex: i, currentItem: item, status: `Checking if ${item} == ${continueVal}`, output: [...output] });
            if (item === continueVal) {
                timeline.push({ activeLines: [3], currentIndex: i, currentItem: item, status: `Condition met. Skipping to next iteration.`, output: [...output] });
                continue;
            }
        }

        if (useBreak) {
            timeline.push({ activeLines: [4], currentIndex: i, currentItem: item, status: `Checking if ${item} == ${breakVal}`, output: [...output] });
            if (item === breakVal) {
                timeline.push({ activeLines: [5], currentIndex: i, currentItem: item, status: `Condition met. Breaking the loop.`, output: [...output] });
                output.push("Loop Finished");
                timeline.push({ activeLines: [7], currentIndex: i, currentItem: item, status: 'Loop terminated.', output: [...output] });
                return timeline;
            }
        }

        output.push(`Processing ${item}`);
        timeline.push({ activeLines: [6], currentIndex: i, currentItem: item, status: `Processing item: ${item}`, output: [...output] });
    }

    output.push("Loop Finished");
    timeline.push({ activeLines: [7], currentIndex: -1, currentItem: null, status: 'Loop finished.', output: [...output] });
    return timeline;
};


const generateWhileLoopTimeline = (options) => {
    const timeline = [];
    const { useContinue, continuePoint, useBreak, breakPoint } = options;
    const continueVal = parseInt(continuePoint, 10);
    const breakVal = parseInt(breakPoint, 10);
    let count = 5;
    const output = [];

    timeline.push({ activeLines: [0], count: 5, output: [], status: 'Initializing countdown.' });

    while (count > 0) {
        timeline.push({ activeLines: [1], count, output: [...output], status: `Checking if ${count} > 0` });

        if (useContinue) {
             timeline.push({ activeLines: [2], count, output: [...output], status: `Checking if ${count} == ${continueVal}` });
            if (count === continueVal) {
                timeline.push({ activeLines: [3, 4], count, output: [...output], status: `Condition met. Skipping print.` });
                count--;
                continue;
            }
        }

        if (useBreak) {
            timeline.push({ activeLines: [5], count, output: [...output], status: `Checking if ${count} == ${breakVal}` });
            if (count === breakVal) {
                timeline.push({ activeLines: [6], count, output: [...output], status: `Condition met. Breaking the loop.` });
                output.push("Liftoff!");
                timeline.push({ activeLines: [9], count, output: [...output], status: 'Loop terminated.' });
                return timeline;
            }
        }

        output.push(count);
        timeline.push({ activeLines: [7], count, output: [...output], status: `Printing ${count}.` });

        timeline.push({ activeLines: [8], count, output: [...output], status: `Decrementing countdown.` });
        count--;
    }

    timeline.push({ activeLines: [1], count, output: [...output], status: `Checking if ${count} > 0 (False)` });
    output.push("Liftoff!");
    timeline.push({ activeLines: [9], count, output: [...output], status: 'Liftoff!' });
    return timeline;
};


function LoopsWorkspace({ onBack, onPractice, initialType = 'for' }) {
    const [isForLoopCompleted, setIsForLoopCompleted] = useState(false);
    const [isWhileLoopCompleted, setIsWhileLoopCompleted] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [loopType, setLoopType] = useState(initialType);
    const toastTimerRef = useRef(null);

    const [timeline, setTimeline] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);

    const forLoopData = [11, 22, 33, 44, 55];
    const [useForBreak, setUseForBreak] = useState(false);
    const [forBreakPoint, setForBreakPoint] = useState('33');
    const [useForContinue, setUseForContinue] = useState(false);
    const [forContinuePoint, setForContinuePoint] = useState('22');

    const [useWhileBreak, setUseWhileBreak] = useState(false);
    const [whileBreakPoint, setWhileBreakPoint] = useState('2');
    const [useWhileContinue, setUseWhileContinue] = useState(false);
    const [whileContinuePoint, setWhileContinuePoint] = useState('4');

    const showToast = (message, type = 'info') => {
        clearTimeout(toastTimerRef.current);
        setToast({ show: true, message, type });
        toastTimerRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 2000);
    };

    useEffect(() => {
        let newTimeline;
        if (loopType === 'for') {
            newTimeline = generateForLoopTimeline(forLoopData, { useContinue: useForContinue, continuePoint: forContinuePoint, useBreak: useForBreak, breakPoint: forBreakPoint });
        } else {
            newTimeline = generateWhileLoopTimeline({ useContinue: useWhileContinue, continuePoint: whileContinuePoint, useBreak: useWhileBreak, breakPoint: whileBreakPoint });
        }
        setTimeline(newTimeline);
        setCurrentStep(0);
        setIsPlaying(true);
    }, [loopType, useForBreak, forBreakPoint, useForContinue, forContinuePoint, useWhileBreak, whileBreakPoint, useWhileContinue, whileContinuePoint]);

    useEffect(() => {
        const currentFrame = timeline[currentStep];
        if (currentFrame?.status) {
            const statusType = (currentFrame.status.includes('terminated') || currentFrame.status.includes('finished') || currentFrame.status.includes('Liftoff')) ? 'success' : 'info';
            showToast(currentFrame.status, statusType);
        }

        clearInterval(timerRef.current);
        if (isPlaying && currentStep < timeline.length - 1) {
            timerRef.current = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 1200);
        } else if (currentStep >= timeline.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, currentStep, timeline]);

    useEffect(() => {
        const checkCompletion = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const docRef = doc(db, "userProgress", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const completedTopics = docSnap.data().completed || [];
                setIsForLoopCompleted(completedTopics.includes('basics-for-loops'));
                setIsWhileLoopCompleted(completedTopics.includes('basics-while-loops'));
            }
        };
        checkCompletion();
    }, []);

    const handleCompleteTopic = async () => {
        const user = auth.currentUser; if (!user) return;
        const topicId = loopType === 'for' ? 'basics-for-loops' : 'basics-while-loops';
        const isCompleted = loopType === 'for' ? isForLoopCompleted : isWhileLoopCompleted;
        const setIsCompleted = loopType === 'for' ? setIsForLoopCompleted : setIsWhileLoopCompleted;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) { await updateDoc(docRef, { completed: arrayRemove(topicId) }); setIsCompleted(false); }
            else { await setDoc(docRef, { completed: arrayUnion(topicId) }, { merge: true }); setIsCompleted(true); }
        } catch (error) { console.error("Error updating progress:", error); }
    };

    const handlePlayPause = () => {
        if (!isPlaying && currentStep >= timeline.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(!isPlaying);
    };

    const currentFrame = timeline[currentStep] || {};
    const isActive = (lines, targetLine) => lines?.includes(targetLine);

    const renderForLoop = () => {
        const { activeLines, currentIndex, currentItem, output } = currentFrame;
        const pointerPosition = (currentIndex * 58.2) + (53.2 / 2);

        return (
            <>
                <div className="loops-code-panel">
                    <h3 className="code-editor-header">For Loop: Processing Numbers</h3>
                    <p className={`code-line ${isActive(activeLines, 0) ? 'active' : ''}`}><span className="token-variable">numbers</span> = [11, 22, 33, 44, 55]</p>
                    <p className={`code-line ${isActive(activeLines, 1) ? 'active' : ''}`}><span className="token-keyword">for</span> item <span className="token-keyword">in</span> numbers:</p>
                    {useForContinue && (<>
                        <p className={`code-line ${isActive(activeLines, 2) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}><span className="token-keyword">if</span> item == {forContinuePoint}:</p>
                        <p className={`code-line ${isActive(activeLines, 3) ? 'active' : ''}`} style={{ paddingLeft: '40px' }}><span className="token-keyword">continue</span></p>
                    </>)}
                    {useForBreak && (<>
                        <p className={`code-line ${isActive(activeLines, 4) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}><span className="token-keyword">if</span> item == {forBreakPoint}:</p>
                        <p className={`code-line ${isActive(activeLines, 5) ? 'active' : ''}`} style={{ paddingLeft: '40px' }}><span className="token-keyword">break</span></p>
                    </>)}
                    <p className={`code-line ${isActive(activeLines, 6) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print("Processing", item)</p>
                    <p className={`code-line ${isActive(activeLines, 7) ? 'active' : ''}`}>print("Loop Finished")</p>
                </div>
                <div className="loops-visualization-panel">
                     <div className="for-loop-viz">
                        <div className="collection-container">
                            <div className="iterator-pointer" style={{ left: `${pointerPosition}px`, opacity: currentIndex > -1 ? 1: 0 }}>
                                <div className="label">iterator</div><div className="arrow"></div>
                            </div>
                            {forLoopData.map((item, index) => (
                                <div className="collection-item-wrapper" key={index}>
                                    <div className={`collection-item ${currentIndex === index ? 'active' : ''}`}>{item}</div>
                                    <div className="collection-index">[{index}]</div>
                                </div>
                            ))}
                        </div>
                        <div className="for-viz-bottom-row">
                            <div className={`loop-variable-box ${isActive(activeLines, 6) ? 'pop-in' : ''}`}>
                                <div className="box-value">{currentItem ?? '?'}</div>
                                <div className="box-label">item</div>
                            </div>
                             <div className="output-box-viz">
                                <h4>Output</h4>
                                {output?.map((line, i) => <div key={i} className="output-line">{line}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderWhileLoop = () => {
        const { activeLines, count, output } = currentFrame;
        return (
             <>
                <div className="loops-code-panel">
                    <h3 className="code-editor-header">While Loop: Rocket Countdown</h3>
                    <p className={`code-line ${isActive(activeLines, 0) ? 'active' : ''}`}><span className="token-variable">countdown</span> = 5</p>
                    <p className={`code-line ${isActive(activeLines, 1) ? 'active' : ''}`}><span className="token-keyword">while</span> countdown {'>'} 0:</p>
                    {useWhileContinue && (<>
                        <p className={`code-line ${isActive(activeLines, 2) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}><span className="token-keyword">if</span> countdown == {whileContinuePoint}:</p>
                        <p className={`code-line ${isActive(activeLines, 3) ? 'active' : ''}`} style={{ paddingLeft: '40px' }}>countdown -= 1</p>
                        <p className={`code-line ${isActive(activeLines, 4) ? 'active' : ''}`} style={{ paddingLeft: '40px' }}><span className="token-keyword">continue</span></p>
                    </>)}
                    {useWhileBreak && (<>
                        <p className={`code-line ${isActive(activeLines, 5) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}><span className="token-keyword">if</span> countdown == {whileBreakPoint}:</p>
                        <p className={`code-line ${isActive(activeLines, 6) ? 'active' : ''}`} style={{ paddingLeft: '40px' }}><span className="token-keyword">break</span></p>
                    </>)}
                    <p className={`code-line ${isActive(activeLines, 7) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print(countdown)</p>
                    <p className={`code-line ${isActive(activeLines, 8) ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>countdown -= 1</p>
                    <p className={`code-line ${isActive(activeLines, 9) ? 'active' : ''}`}>print("Liftoff!")</p>
                </div>
                <div className="loops-visualization-panel">
                    <div className="while-loop-viz">
                        <div className="while-viz-top">
                            <div className={`while-condition-box ${(count > 0 && timeline.length > 0) ? 'true' : 'false'}`}>
                                <span>countdown {'>'} 0</span>
                                <span className="result">{(count > 0 && timeline.length > 0) ? 'True' : 'False'}</span>
                            </div>
                             <div className="loop-variable-box pop-in">
                                <div className="box-value">{count}</div>
                                <div className="box-label">countdown</div>
                            </div>
                            <div className="output-box-viz">
                                <h4>Output</h4>
                                {output?.map((line, i) => <div key={i} className="output-line">{line}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Loops</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="loop-type-switcher">
                        <button className={`loop-type-button ${loopType === 'for' ? 'active' : ''}`} onClick={() => setLoopType('for')}>For Loop</button>
                        <button className={`loop-type-button ${loopType === 'while' ? 'active' : ''}`} onClick={() => setLoopType('while')}>While Loop</button>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section" style={{flexDirection: 'row', gap: '24px'}}>
                        {loopType === 'for' ? (
                            <>
                                <div className="ds-control-group">
                                    <input type="checkbox" checked={useForBreak} onChange={() => setUseForBreak(!useForBreak)} style={{width: '20px', height: '20px'}}/>
                                    <span>Break at:</span>
                                    <input type="number" className="ds-input-field" value={forBreakPoint} onChange={(e) => setForBreakPoint(e.target.value)} disabled={!useForBreak} style={{width: '60px'}}/>
                                </div>
                                <div className="ds-control-group">
                                    <input type="checkbox" checked={useForContinue} onChange={() => setUseForContinue(!useForContinue)} style={{width: '20px', height: '20px'}}/>
                                    <span>Continue at:</span>
                                    <input type="number" className="ds-input-field" value={forContinuePoint} onChange={(e) => setForContinuePoint(e.target.value)} disabled={!useForContinue} style={{width: '60px'}}/>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="ds-control-group">
                                    <input type="checkbox" checked={useWhileBreak} onChange={() => setUseWhileBreak(!useWhileBreak)} style={{width: '20px', height: '20px'}}/>
                                    <span>Break at:</span>
                                    <input type="number" className="ds-input-field" value={whileBreakPoint} onChange={(e) => setWhileBreakPoint(e.target.value)} disabled={!useWhileBreak} style={{width: '60px'}}/>
                                </div>
                                <div className="ds-control-group">
                                    <input type="checkbox" checked={useWhileContinue} onChange={() => setUseWhileContinue(!useWhileContinue)} style={{width: '20px', height: '20px'}}/>
                                    <span>Continue at:</span>
                                    <input type="number" className="ds-input-field" value={whileContinuePoint} onChange={(e) => setWhileContinuePoint(e.target.value)} disabled={!useWhileContinue} style={{width: '60px'}}/>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="ds-controls-right">
                    <div className="ds-playback-buttons">
                         <button className="ds-playback-button" onClick={handlePlayPause}> {isPlaying ? 'Pause' : 'Play'} </button>
                    </div>
                     <div className="ds-separator"></div>
                    <div><button onClick={() => onPractice(loopType === 'for' ? 'basics-for-loops' : 'basics-while-loops')} className="auth-button" style={{ maxWidth: '150px' }}>Practice</button></div>
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${(loopType === 'for' ? isForLoopCompleted : isWhileLoopCompleted) ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon />
                            {(loopType === 'for' ? isForLoopCompleted : isWhileLoopCompleted) ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}><BookIcon /></button>
                    </div>
                </div>
            </div>
            <div className="loops-workspace-content">{loopType === 'for' ? renderForLoop() : renderWhileLoop()}</div>
            {isInfoPanelOpen && <ConceptInfoPanel data={conceptsInfo.loops} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}
export default LoopsWorkspace;