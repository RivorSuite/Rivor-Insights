import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import '../../Concepts/Variables/Variables.css';
import { conceptsInfo } from '../concepts-data.js';
import { ConceptInfoPanel } from '../../Concepts/ConceptInfoPanel';
import { Toast } from '../../visualizers/components/Toast/Toast'; // <-- NEW: Import Toast
import { CheckIcon, BookIcon } from '../../common/Icons.jsx';

const dataTypeInfo = {
    integer: "Represents whole numbers, positive or negative, without decimals.",
    float: "Represents numbers with a decimal point for fractional values.",
    string: "Represents a sequence of characters, like text, enclosed in quotes.",
    char: "Represents a single character, like a letter or a symbol.",
    boolean: "Represents one of two values: True or False, used for logical operations.",
    none: "Represents the intentional absence of any value."
};

const reservedKeywords = new Set([
    'false', 'none', 'true', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 
    'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 
    'return', 'try', 'while', 'with', 'yield'
]);

const INT32_MAX = 2147483647; const INT32_MIN = -2147483648;

const CodeLine = ({ varName, value, type }) => {
    const renderValue = () => {
        switch (type) {
            case 'string': return <span className="token-string">"{value}"</span>;
            case 'char': return <span className="token-string">'{value}'</span>;
            case 'integer':
            case 'float': return <span className="token-number">{value}</span>;
            case 'boolean':
            case 'none': return <span className="token-boolean">{String(value)}</span>;
            default: return <span className="token-operator">{value}</span>;
        }
    };

    return (
        <p className="code-line">
            <span className="token-variable">{varName}</span>
            <span className="token-operator"> = </span>
            {renderValue()}
        </p>
    );
};

function VariablesWorkspace({ onBack, onPractice }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const topicId = 'basics-variables';
    const [varName, setVarName] = useState('my_variable');
    const [varType, setVarType] = useState('');
    const [varValue, setVarValue] = useState('');

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
            else { console.error("Error updating progress:", error); }
        }
    };
    
    const handleValueChange = (e) => {
        const rawValue = e.target.value;
        let sanitizedValue = rawValue;

        if (varType === 'integer') {
            if (/[^0-9-]/.test(rawValue)) {showToast("Only numbers and '-' are allowed for integers.", "error");}
            sanitizedValue = rawValue.replace(/[^0-9-]/g, '');
            if (sanitizedValue.indexOf('-', 1) > 0) {
                showToast("The '-' sign must be at the beginning.", "error");
                sanitizedValue = '-' + sanitizedValue.replace(/-/g, '');
            }

            if (sanitizedValue && sanitizedValue !== '-') {
                try {
                    const num = BigInt(sanitizedValue);
                    if (num > INT32_MAX) {
                        showToast("Value exceeds the 32-bit integer limit.", "error");
                        sanitizedValue = INT32_MAX.toString();
                    }
                    else if (num < INT32_MIN) {
                        showToast("Value is below the 32-bit integer limit.", "error");
                        sanitizedValue = INT32_MIN.toString();
                    }
                }
                catch (error) {}
            }
        }
        else if (varType === 'float') {
            if (/[^0-9.-]/.test(rawValue)) {showToast("Only numbers, '-', and one '.' are allowed for floats.", "error");}
            sanitizedValue = rawValue.replace(/[^0-9.-]/g, '');
            if (sanitizedValue.indexOf('-', 1) > 0) {
                showToast("The '-' sign must be at the beginning.", "error");
                sanitizedValue = '-' + sanitizedValue.replace(/-/g, '');
            }
            const parts = sanitizedValue.split('.');
            if (parts.length > 2) {
                showToast("Only one decimal point is allowed.", "error");
                sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
            }
        }
        else if (varType === 'char') {
            if (rawValue.length > 1) {showToast("Only a single character is allowed.", "info");}
            sanitizedValue = rawValue.slice(0, 1);
        }
        setVarValue(sanitizedValue);
    };

    const handleVarNameChange = (e) => {
        const newName = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
        if (reservedKeywords.has(newName.toLowerCase())) {
            showToast("Variable names cannot be reserved keywords.", "error");
            return;
        }
        if (newName.length > 0 && !isNaN(newName[0])) {
            showToast("Variable names cannot start with a number.", "error");
            return;
        }
        setVarName(newName);
    };

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Variables & Data Types</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-control-group">
                        <span>Variable Name:</span>
                        <input type="text" className="ds-input-field" value={varName} onChange={handleVarNameChange} />
                    </div>
                     <div className="ds-control-group">
                        <span>Data Type:</span>
                        <select
                            className="ds-input-field"
                            value={varType}
                            onChange={(e) => {
                                const newType = e.target.value;
                                setVarType(newType);
                                if (newType === 'boolean') setVarValue('true');
                                else if (newType === 'none') setVarValue('None');
                                else if (newType === 'char') setVarValue('a');
                                else if (newType === 'integer') setVarValue('123');
                                else if (newType === 'float') setVarValue('3.14');
                                else setVarValue('Hello World');
                            }}
                        >
                            <option value="" disabled>Select a type</option>
                            <option value="integer">Integer</option>
                            <option value="float">Float</option>
                            <option value="string">String</option>
                            <option value="char">Char</option>
                            <option value="boolean">Boolean</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    <div className="ds-control-group">
                        <span>Value:</span>
                        {(() => {
                            if (varType === 'boolean') {
                                return (
                                    <select className="ds-input-field" value={varValue} onChange={(e) => setVarValue(e.target.value)}>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                );
                            }
                            else if (varType === 'none') {return ( <input type="text" className="ds-input-field" value="None" disabled /> );
                            }
                            else {
                                return ( <input 
                                    type="text" 
                                    className="ds-input-field" 
                                    value={varValue} 
                                    onChange={handleValueChange} 
                                    disabled={!varType}
                                /> );
                            }
                        })()}
                    </div>
                </div>
                <div className="ds-controls-right">
                    <div> <button onClick={onPractice} className="auth-button" style={{ maxWidth: '150px', marginRight: '16px' }}>Practice</button> </div>
                     <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon />
                            {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}> <BookIcon /> </button>
                    </div>
                </div>
            </div>

            <div className="variables-workspace-content">
                <div className="code-editor-panel">
                    <h3 className="code-editor-header">Code</h3>
                    <CodeLine varName={varName} value={varValue} type={varType} />
                    <p style={{marginTop: '20px', color: 'var(--secondary-text)', fontSize: '14px', borderTop: '1px solid var(--border)', paddingTop: '16px'}}>
                        {dataTypeInfo[varType]}
                    </p>
                </div>
                <div className="visualization-panel">
                    <div className="memory-representation">
                        <div className="variable-label">
                            {varName}
                            <svg height="30" width="50" style={{'--color': 'var(--secondary-text)'}}><line x1="0" y1="15" x2="50" y2="15" stroke="var(--color)" strokeWidth="2"/><polyline points="45 10, 50 15, 45 20" fill="none" stroke="var(--color)" strokeWidth="2"/></svg>
                        </div>
                        <div className="memory-box">
                            <div className="memory-value">
                                { (varType === 'string' && `"${varValue}"`) || (varType === 'char' && `'${varValue}'`) || String(varValue) }
                            </div>
                            <div className="memory-type">{varType}</div>
                        </div>
                    </div>
                </div>
            </div>
            {isInfoPanelOpen && <ConceptInfoPanel data={conceptsInfo.variables} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}
export default VariablesWorkspace;