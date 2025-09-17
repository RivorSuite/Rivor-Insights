import React, { useState, useEffect, useRef } from 'react';
import { parseCode } from '../../parser/core.js';
import './CodeVisualizerPage.css';

const renderValue = (value) => {
    if (typeof value === 'string') {return `"${value}"`;}
    if (value === null || value === undefined) return String(value);
    if (value.type === 'list') {return <ListVisualizer data={value.value} />;} 
    else if (value.type === 'tuple') {return <TupleVisualizer data={value.value} />;}
    else if (value.type === 'dict') {return <DictionaryVisualizer data={value.value} />;}
    else {
        return typeof value === 'number' && !Number.isInteger(value)
            ? value.toFixed(4)
            : String(value);
    }
};

const ListVisualizer = ({ data }) => (
    <div className="list-container">
        {data.map((item, index) => (
            <div className="list-item" key={index}>
                <span className="list-index">{index}</span>
                <span className="list-value">{renderValue(item)}</span>
            </div>
        ))}
    </div>
);

const TupleVisualizer = ({ data }) => (
    <div className="tuple-container">
        {data.map((item, index) => (
            <div className="tuple-item" key={index}>
                <span className="tuple-index">{index}</span>
                <span className="tuple-value">{renderValue(item)}</span>
            </div>
        ))}
    </div>
);

const DictionaryVisualizer = ({ data }) => (
    <div className="dict-container">
        <table className="dict-table">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(data).map(([key, value]) => (
                    <tr key={key}>
                        <td className="dict-key">{String(key)}</td>
                        <td>{renderValue(value)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

function CodeVisualizerPage({ onBack, initialCode }) {
    const [code, setCode] = useState(initialCode || 'print("Hello, Rivor!")');
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const activeLineRef = useRef(null);
    const codeEditorRef = useRef(null);
    const codeDisplayRef = useRef(null);
    const statePanelRef = useRef(null);
    const outputPanelRef = useRef(null);
    useEffect(() => {
        if (isVisualizing) {
            if (activeLineRef.current) {
                activeLineRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
            if (statePanelRef.current) {
                statePanelRef.current.scrollTop = statePanelRef.current.scrollHeight;
            }
            if (outputPanelRef.current) {
                outputPanelRef.current.scrollTop = outputPanelRef.current.scrollHeight;
            }
        }
    }, [currentStep, isVisualizing]);

    useEffect(() => {
        if (!isVisualizing && codeEditorRef.current) {
            codeEditorRef.current.scrollTop = codeEditorRef.current.scrollHeight;
        }
    }, [code, isVisualizing]);

    const handleVisualize = () => {
        try {
            const { steps: executionSteps } = parseCode(code);
            setSteps(executionSteps);
            setCurrentStep(0);
            setIsVisualizing(true);
        } 
        catch (e) {
            console.error("Error during parsing:", e);
            alert("An error occurred while parsing your code. Please check the console for details.");
        }
    };

    const handleReset = () => {
        setIsVisualizing(false);
        setCurrentStep(0);
        setSteps([]);
    };

    const handleKeyDown = (e) => {
        const textarea = e.target;
        const { value, selectionStart } = textarea;
        if (e.key === 'Tab') {
            e.preventDefault();
            const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionStart);
            setCode(newValue);
            setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = selectionStart + 2; }, 0);
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const currentLine = value.substring(currentLineStart, selectionStart);
            const currentIndent = currentLine.match(/^\s*/)[0];
            let indent = currentIndent;
            if (currentLine.trim().endsWith(':')) { indent += '  '; }
            const newValue = value.substring(0, selectionStart) + '\n' + indent + value.substring(selectionStart);
            setCode(newValue);
            setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length; }, 0);
        }
    };

    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
    const handlePrev = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

    return (
        <div className="code-visualizer-wrapper">
            <div className="visualizer-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Code Visualizer</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back</button>
            </div>
            <div className="visualizer-main-content">
                <div className="visualizer-panel code-panel">
                    <h2 style={{ margin: '0 0 16px 0' }}>Code</h2>
                    <div className="panel-content">
                        {isVisualizing ? (
                            <div className="code-display-area" ref={codeDisplayRef}>
                                {code.split('\n').map((line, index) => {
                                    const isActive = index === steps[currentStep]?.line;
                                    return (
                                        <pre 
                                            key={index} 
                                            ref={isActive ? activeLineRef : null}
                                            className={`code-line ${isActive ? 'active' : ''}`}
                                        >
                                            <code>{line}</code>
                                        </pre>
                                    );
                                })}
                            </div>
                        ) : (
                            <textarea 
                                ref={codeEditorRef}
                                className="code-editor-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        )}
                    </div>
                     <div className="panel-controls">
                        {isVisualizing ? (
                            <button onClick={handleReset} className="auth-button" style={{ flex: 1 }}>Reset & Edit</button>
                        ) : (
                            <button onClick={handleVisualize} className="auth-button" style={{ flex: 1 }}>Visualize</button>
                        )}
                        <button onClick={handlePrev} className="auth-button" style={{ flex: 1, backgroundColor: 'var(--surface)', color: 'var(--primary-text)' }} disabled={!isVisualizing || currentStep === 0}>« Prev</button>
                        <button onClick={handleNext} className="auth-button" style={{ flex: 1, backgroundColor: 'var(--surface)', color: 'var(--primary-text)' }} disabled={!isVisualizing || currentStep >= steps.length - 1}>Next »</button>
                    </div>
                </div>
                <div className="visualizer-panel state-panel">
                    <h2 style={{ margin: '0 0 16px 0' }}>State</h2>
                    <div className="panel-content" ref={statePanelRef}>
                        {Object.keys(steps[currentStep]?.variables || {}).length > 0 ? (
                            <table>
                                <thead><tr><th style={{textAlign: 'left', padding: '8px'}}>Variable</th><th style={{textAlign: 'left', padding: '8px'}}>Value</th></tr></thead>
                                <tbody>
                                    {Object.entries(steps[currentStep]?.variables || {}).map(([name, value]) => (
                                        <tr key={name}>
                                            <td style={{padding: '8px', verticalAlign: 'top'}}>{name}</td>
                                            <td style={{padding: '8px'}}>{renderValue(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (<p style={{color: 'var(--secondary-text)'}}>Variables will appear here.</p>)}
                    </div>
                </div>
            </div>
            <div className="visualizer-panel output-panel">
                <h2 style={{ margin: '0 0 16px 0' }}>Output</h2>
                <div className="panel-content" ref={outputPanelRef}>
                    {steps[currentStep]?.output?.length > 0 ? (
                        steps[currentStep].output.map((line, index) => (
                            <pre key={index} style={{ margin: 0 }}>{line}</pre>
                        ))
                    ) : (
                        <p style={{color: 'var(--secondary-text)', margin: 0}}>The output of print() will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default CodeVisualizerPage;