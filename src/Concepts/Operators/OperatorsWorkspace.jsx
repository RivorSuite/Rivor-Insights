import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import './Operators.css';
import { conceptsInfo } from '../../visualizers/data/concepts-data.js';
import { ConceptInfoPanel } from '../ConceptInfoPanel';
import { Toast } from '../../visualizers/components/Toast/Toast';

const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );
const BookIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> );

const CodeLine = ({ a, b, op, result, type }) => {
    const renderValue = (val) => {
        if (type === 'boolean') {
            const pythonBoolean = String(val).charAt(0).toUpperCase() + String(val).slice(1);
            return <span className="token-boolean">{pythonBoolean}</span>;
        }
        return <span className="token-number">{String(val)}</span>;
    };

    if (op === 'not') {
        return (
            <p className="code-line">
                <span className="token-variable">result</span>
                <span className="token-operator"> = </span>
                <span className="token-operator">not </span>
                {renderValue(a)}
            </p>
        );
    }

    if (['=', '+=', '-=', '*=', '/=', '%='].includes(op)) {
        return (
             <p className="code-line">
                <span className="token-variable">x</span>
                <span className="token-operator"> {op} </span>
                {renderValue(b)}
            </p>
        );
    }
    
    return (
        <p className="code-line">
            <span className="token-variable">result</span>
            <span className="token-operator"> = </span>
            {renderValue(a)}
            <span className="token-operator"> {op} </span>
            {renderValue(b)}
        </p>
    );
};


const operatorsConfig = {
    arithmetic: ['+', '-', '*', '/', '%', '**', '//'],
    assignment: ['=', '+=', '-=', '*=', '/=', '%='],
    bitwise: ['&', '|', '^', '<<', '>>'],
    comparison: ['==', '!=', '>', '<', '>=', '<='],
    logical: ['and', 'or', 'not'],
};

function OperatorsWorkspace({ onBack, onPractice }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const topicId = 'basics-operators';

    const [opCategory, setOpCategory] = useState('arithmetic');
    const [operator, setOperator] = useState('+');
    const [operandA, setOperandA] = useState('');
    const [operandB, setOperandB] = useState('');
    
    const [assignmentState, setAssignmentState] = useState({ prev: 10, current: 10 });
    const [isAnimating, setIsAnimating] = useState(false);

     useEffect(() => {
        if (opCategory === 'assignment' && !isAnimating) {
            setIsAnimating(true);
            const a = parseFloat(operandA) || 0;
            const b = parseFloat(operandB) || 0;
            setAssignmentState({ prev: a, current: a });
            
            setTimeout(() => {
                let newCurrent = 0;
                switch (operator) {
                    case '=':  newCurrent = b; break;
                    case '+=': newCurrent = a + b; break;
                    case '-=': newCurrent = a - b; break;
                    case '*=': newCurrent = a * b; break;
                    case '/=': newCurrent = b !== 0 ? a / b : a; break;
                    case '%=': newCurrent = b !== 0 ? a % b : a; break;
                }
                setAssignmentState({ prev: a, current: newCurrent });
                setTimeout(() => setIsAnimating(false), 500);
            }, 100);
        }
    }, [operandA, operandB, operator, opCategory]);

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
            } else {
                await updateDoc(docRef, { completed: arrayUnion(topicId) });
                setIsCompleted(true);
            }
        } catch (error) {
            if (error.code === 'not-found' && !isCompleted) {
                await setDoc(docRef, { completed: [topicId] });
                setIsCompleted(true);
            } else {
                console.error("Error updating progress:", error);
            }
        }
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setOpCategory(newCategory);
        setOperator(operatorsConfig[newCategory][0]);
        if (newCategory === 'logical') {
            setOperandA('true');
            setOperandB('false');
        } else {
            setOperandA('10');
            setOperandB('5');
        }
    };

    const parseOperand = (val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return parseFloat(val) || 0;
    };

    const a = parseOperand(operandA);
    const b = parseOperand(operandB);
    let result;
    let error = null;

    try {
        switch (operator) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': 
                if (b === 0) throw new Error("Division by zero is not allowed.");
                result = a / b;
                break;
            case '%': 
                if (b === 0) throw new Error("Division by zero is not allowed.");
                result = a % b;
                break;
            case '**': result = a ** b; break;
            case '//': 
                if (b === 0) throw new Error("Division by zero is not allowed.");
                result = Math.floor(a / b);
                break;
            case '&': result = a & b; break;
            case '|': result = a | b; break;
            case '^': result = a ^ b; break;
            case '<<': result = a << b; break;
            case '>>': result = a >> b; break;
            case '==': result = a == b; break;
            case '!=': result = a != b; break;
            case '>': result = a > b; break;
            case '<': result = a < b; break;
            case '>=': result = a >= b; break;
            case '<=': result = a <= b; break;
            case 'and': result = a && b; break;
            case 'or': result = a || b; break;
            case 'not': result = !a; break;
            case '=': case '+=': case '-=': case '*=': case '/=': case '%=':
                result = assignmentState.current;
                break;
            default: result = 'N/A';
        }
    } catch (e) {
        error = e.message;
        result = 'Error';
    }
    
    const isUnary = operator === 'not';

    const renderVisualization = () => {
        if (error) {
            return <div className="boolean-result false">{error}</div>;
        }

        const formatDisplayValue = (val) => {
            if (val === 'true' || val === true) return 'True';
            if (val === 'false' || val === false) return 'False';
            return val;
        };
        
        if (opCategory === 'assignment') {
            const displayValue = isAnimating ? assignmentState.prev : assignmentState.current;
            return (
                <div className="assignment-visualization">
                    <div className={`assignment-box ${!isAnimating ? 'updated' : ''}`}>
                        <div className={`box-value ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                            {Number.isFinite(displayValue) ? displayValue.toLocaleString() : 'N/A'}
                        </div>
                        <div className="box-label">Variable (x)</div>
                    </div>
                </div>
            );
        }

        if (opCategory === 'bitwise') {
            const toBinary = (num) => (num >>> 0).toString(2).padStart(8, '0');
            const a_int = parseInt(a, 10);
            const b_int = parseInt(b, 10);
            const result_int = parseInt(result, 10);

            return (
                <div className="binary-visualization">
                    <span></span>
                    <span className="binary-decimal">{a_int}</span>
                    <span className="binary-string">{toBinary(a_int)}</span>

                    <span className="binary-operator">{operator}</span>
                    <span className="binary-decimal">{b_int}</span>
                    <span className="binary-string">{toBinary(b_int)}</span>

                    <div className="binary-result-line"></div>

                    <span></span>
                    <span className="binary-decimal" style={{color: 'var(--accent)'}}>{result_int}</span>
                    <span className="binary-string" style={{borderColor: 'var(--accent)'}}>{result_int === 0 ? '00000000' : toBinary(result_int)}</span>
                </div>
            );
        }

        if (opCategory === 'logical' || opCategory === 'comparison') {
            return (
                <div className="expression-container">
                    {isUnary && (
                        <>
                            <div className="operator-symbol" style={{width: 'auto', paddingRight: '10px'}}>not</div>
                            <div className="operand-box">
                                <div className="box-value">{formatDisplayValue(operandA)}</div>
                                <div className="box-label">Operand</div>
                            </div>
                        </>
                    )}
                    {!isUnary && (
                         <>
                            <div className="operand-box">
                                <div className="box-value">{formatDisplayValue(operandA)}</div>
                                <div className="box-label">Operand A</div>
                            </div>
                            <div className="operator-symbol">{operator}</div>
                            <div className="operand-box">
                                <div className="box-value">{formatDisplayValue(operandB)}</div>
                                <div className="box-label">Operand B</div>
                            </div>
                        </>
                    )}
                    <div className="operator-symbol">=</div>
                    <div className={`boolean-result ${result ? 'true' : 'false'}`}>
                        {formatDisplayValue(result)}
                    </div>
                </div>
            );
        }

        return (
            <div className="expression-container">
                <div className="operand-box">
                    <div className="box-value">{operandA}</div>
                    <div className="box-label">Operand A</div>
                </div>
                <div className="operator-symbol">{operator}</div>
                <div className="operand-box">
                    <div className="box-value">{operandB}</div>
                    <div className="box-label">Operand B</div>
                </div>
                <div className="operator-symbol">=</div>
                <div className="result-box">
                    <div className="box-value">{Number.isFinite(result) ? result.toLocaleString() : 'N/A'}</div>
                    <div className="box-label">Result</div>
                </div>
            </div>
        );
    };

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Operators & Expressions</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>

            <div className="ds-controls-panel">
                <div className="ds-controls-left">
                    <div className="ds-control-group">
                        <span>Category:</span>
                        <select className="ds-input-field" value={opCategory} onChange={handleCategoryChange}>
                            <option value="arithmetic">Arithmetic</option>
                            <option value="assignment">Assignment</option>
                            <option value="bitwise">Bitwise</option>
                            <option value="comparison">Comparison</option>
                            <option value="logical">Logical</option>
                        </select>
                    </div>
                    <div className="ds-control-group">
                        <span>Operator:</span>
                        <select className="ds-input-field" value={operator} onChange={(e) => setOperator(e.target.value)}>
                            {operatorsConfig[opCategory].map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>
                    <div className="ds-control-group">
                        <span>{opCategory === 'assignment' ? 'Variable (x):' : 'Operand A:'}</span>
                        {opCategory === 'logical' ? (
                            <select className="ds-input-field" value={operandA} onChange={e => setOperandA(e.target.value)}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        ) : (
                            <input type="number" className="ds-input-field" value={operandA} onChange={e => setOperandA(e.target.value)} />
                        )}
                    </div>
                    {!isUnary && (
                        <div className="ds-control-group">
                            <span>{opCategory === 'assignment' ? 'Value:' : 'Operand B:'}</span>
                             {opCategory === 'logical' ? (
                                <select className="ds-input-field" value={operandB} onChange={e => setOperandB(e.target.value)}>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            ) : (
                                <input type="number" className="ds-input-field" value={operandB} onChange={e => setOperandB(e.target.value)} />
                            )}
                        </div>
                    )}
                </div>
                <div className="ds-controls-right">
                     <div> 
                        <button onClick={onPractice} className="auth-button" style={{ maxWidth: '150px', marginRight: '16px' }}>Practice</button>
                    </div>
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

            <div className="operators-workspace-content">
                <div className="op-code-panel">
                    <h3 className="code-editor-header">Code</h3>
                    <CodeLine a={operandA} b={operandB} op={operator} result={result} type={opCategory === 'logical' ? 'boolean' : 'number'} />
                </div>
                <div className="op-visualization-panel">
                    {renderVisualization()}
                </div>
            </div>
            {isInfoPanelOpen && <ConceptInfoPanel data={conceptsInfo.operators} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}

export default OperatorsWorkspace;