import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './Loops.css';
import { conceptsInfo } from '../../visualizers/data/concepts-data.js';
import { ConceptInfoPanel } from '../ConceptInfoPanel';
import { Toast } from '../../visualizers/components/Toast/Toast';

const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );
const BookIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> );

function LoopsWorkspace({ onBack, onPractice, initialType = 'for' }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const topicId = 'basics-loops';
    const [loopType, setLoopType] = useState(initialType);

    const forLoopData = ['A', 'B', 'C', 'D'];
    const [forLoopIndex, setForLoopIndex] = useState(-1);
    const [whileCount, setWhileCount] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (loopType === 'for') {
            setForLoopIndex(-1);
            let i = 0;
            timerRef.current = setInterval(() => {
                setForLoopIndex(i);
                i = (i + 1) % (forLoopData.length + 1);
            }, 1000);
        }
        else {
            setWhileCount(0);
            let count = 0;
            timerRef.current = setInterval(() => {
                setWhileCount(count);
                count = (count + 1) % 6;
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [loopType]);

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

    const renderForLoop = () => (
        <>
            <div className="loops-code-panel">
                <h3 className="code-editor-header">For Loop</h3>
                <p className="code-line"><span className="token-variable">my_list</span> = ['A', 'B', 'C', 'D']</p>
                <p className={`code-line ${forLoopIndex !== -1 && forLoopIndex < forLoopData.length ? 'active' : ''}`}><span className="token-keyword">for</span> item <span className="token-keyword">in</span> my_list:</p>
                <p className={`code-line ${forLoopIndex !== -1 && forLoopIndex < forLoopData.length ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print(item)</p>
            </div>
            <div className="loops-visualization-panel">
                <div className="for-loop-viz">
                    <div className="collection-box">{forLoopData.map((item, index) => (<div key={index} className={`collection-item ${forLoopIndex === index ? 'active' : ''}`}>{item}</div>))}</div>
                    <div className="loop-arrow">→</div>
                    <div className="loop-variable-box">
                        <div className="box-value">{forLoopIndex > -1 && forLoopIndex < forLoopData.length ? forLoopData[forLoopIndex] : '?'}</div>
                        <div className="box-label">item</div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderWhileLoop = () => (
         <>
            <div className="loops-code-panel">
                <h3 className="code-editor-header">While Loop</h3>
                <p className="code-line"><span className="token-variable">count</span> = 0</p>
                <p className={`code-line ${whileCount < 5 ? 'active' : ''}`}><span className="token-keyword">while</span> count {'<'} 5:</p>
                <p className={`code-line ${whileCount < 5 ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>print(count)</p>
                <p className={`code-line ${whileCount < 5 ? 'active' : ''}`} style={{ paddingLeft: '20px' }}>count += 1</p>
            </div>
            <div className="loops-visualization-panel">
                <div className="while-loop-viz">
                    <div className={`flowchart-node condition ${whileCount < 5 ? 'active' : ''}`}><div className="node-text">count {'<'} 5?</div></div>
                    <div className="counter-box">
                        <span style={{fontSize: '20px'}}>count:</span>
                        <div className="loop-variable-box"><div className="box-value">{whileCount}</div></div>
                    </div>
                    <div className={`flowchart-node ${whileCount < 5 ? 'active' : ''}`}>Execute Block</div>
                </div>
            </div>
        </>
    );

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Loops</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left"><div className="loop-type-switcher"><button className={`loop-type-button ${loopType === 'for' ? 'active' : ''}`} onClick={() => setLoopType('for')}>For Loop</button><button className={`loop-type-button ${loopType === 'while' ? 'active' : ''}`} onClick={() => setLoopType('while')}>While Loop</button></div></div>
                <div className="ds-controls-right">
                    <div><button onClick={() => onPractice(loopType === 'for' ? 'basics-for-loops' : 'basics-while-loops')} className="auth-button" style={{ maxWidth: '150px', marginRight: '16px' }}>Practice</button></div>
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}><CheckIcon />{isCompleted ? 'Completed' : 'Mark as Complete'}</button>
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