import React from 'react';

function AlgoVisualizerPage({ onBack }) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1 className="auth-title">Algorithm Visualizer</h1>
            <p className="auth-subtitle">This is where the interactive algorithm animations will go.</p>
            <button onClick={onBack} className="auth-button" style={{maxWidth: '200px'}}>Back to Home</button>
        </div>
    );
}

export default AlgoVisualizerPage;