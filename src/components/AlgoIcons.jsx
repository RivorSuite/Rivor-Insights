import React from 'react';

export const LinearSearchIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2, 3, 4].map(i => (
            <rect 
                key={i} 
                x={10 + i * 25} 
                y="10" 
                width="20" 
                height="20" 
                className="ds-icon-box"
                style={{ fill: i === 2 ? 'var(--accent)' : 'var(--surface)' }}
            />
        ))}
        {/* Magnifying glass */}
        <g transform="translate(125, 20) scale(0.8)">
            <circle cx="0" cy="0" r="8" stroke="var(--accent)" strokeWidth="2.5" fill="none" />
            <line x1="6" y1="6" x2="12" y2="12" stroke="var(--accent)" strokeWidth="2.5" />
        </g>
    </svg>
);

export const BinarySearchIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <rect 
                key={i} 
                x={5 + i * 20} 
                y="10" 
                width="18" 
                height="20" 
                className="ds-icon-box"
                style={{ opacity: (i >= 2 && i <= 4) ? 1 : 0.3 }}
            />
        ))}
        {/* Arrows pointing inwards */}
        <g fill="none" stroke="var(--accent)" strokeWidth="2">
            <line x1="40" y1="5" x2="50" y2="15" />
            <line x1="60" y1="5" x2="50" y2="15" />
            <line x1="110" y1="5" x2="100" y2="15" />
            <line x1="90" y1="5" x2="100" y2="15" />
        </g>
    </svg>
);

export const BubbleSortIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        <rect x="20" y="20" width="15" height="15" className="ds-icon-box" />
        <rect x="40" y="15" width="15" height="20" className="ds-icon-box" />
        <rect x="60" y="5" width="15" height="30" className="ds-icon-box" style={{ fill: 'var(--accent)' }}/>
        <rect x="80" y="10" width="15" height="25" className="ds-icon-box" style={{ fill: 'var(--accent)' }}/>
        <rect x="100" y="18" width="15" height="17" className="ds-icon-box" />
        
        {/* Swap Arrows */}
        <g fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M 67.5 3 C 60 0, 80 0, 87.5 3" />
            <path d="M 67.5 3 L 65 0" />
            <path d="M 87.5 3 L 90 0" />
        </g>
    </svg>
);

export const InsertionSortIcon = () => (
     <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Sorted portion */}
        <rect x="10" y="15" width="15" height="20" className="ds-icon-box" />
        <rect x="30" y="10" width="15" height="25" className="ds-icon-box" />
        <rect x="50" y="5" width="15" height="30" className="ds-icon-box" />
        
        {/* Element being inserted */}
        <rect x="80" y="12" width="15" height="23" className="ds-icon-box" style={{ fill: 'var(--accent)' }}/>
        
        {/* Unsorted portion */}
        <rect x="110" y="20" width="15" height="15" className="ds-icon-box" style={{ opacity: 0.5 }} />
        <rect x="130" y="18" width="15" height="17" className="ds-icon-box" style={{ opacity: 0.5 }} />

        {/* Arrow showing insertion point */}
        <g fill="none" stroke="var(--accent)" strokeWidth="2">
             <line x1="87.5" y1="5" x2="87.5" y2="0" />
             <line x1="82.5" y1="5" x2="87.5" y2="0" />
             <line x1="92.5" y1="5" x2="87.5" y2="0" />
        </g>
    </svg>
);

export const GraphTraversalIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Nodes */}
        <circle cx="30" cy="20" r="8" className="ds-icon-box" style={{ fill: 'var(--accent)' }} />
        <circle cx="75" cy="10" r="8" className="ds-icon-box" />
        <circle cx="75" cy="30" r="8" className="ds-icon-box" />
        <circle cx="120" cy="20" r="8" className="ds-icon-box" />
        
        {/* Edges */}
        <g stroke="var(--secondary-text)" strokeWidth="1.5">
            <line x1="38" y1="20" x2="67" y2="12" />
            <line x1="38" y1="20" x2="67" y2="28" />
            <line x1="83" y1="12" x2="112" y2="20" />
            <line x1="83" y1="30" x2="112" y2="20" />
        </g>
    </svg>
);