import React from 'react';

// This is a simplified version of the InfoPanel for Code Concepts
export function ConceptInfoPanel({ data, onClose }) {

    // If data or data.about is not available, don't render anything
    if (!data || !data.about) {
        return null;
    }

    return (
        <div className="info-panel-overlay" onClick={onClose}>
            <div className="info-panel" onClick={(e) => e.stopPropagation()}>
                <div className="info-panel-header">
                    {/* We only have one "About" tab now */}
                    <button className={'active'}>About</button>
                    <button className="info-panel-close" onClick={onClose}>&times;</button>
                </div>

                <div className="info-panel-content">
                    <div className="info-tab-content">
                        <h3>{data.about.title}</h3>
                        <p>{data.about.description}</p>
                        <strong>Key Concepts:</strong>
                        <ul>
                            {data.about.details.map(item => (
                                <li key={item.title}><b>{item.title}:</b> {item.note} (<code>{item.complexity}</code>)</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}