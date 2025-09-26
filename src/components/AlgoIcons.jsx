import React from 'react';

export const LinearSearchIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2, 3, 4].map(i => (
            <rect 
                key={i} 
                x={15 + i * 25} 
                y="10" 
                width="20" 
                height="20" 
                rx="3"
                className="ds-icon-box"
                style={{ fill: i === 2 ? 'var(--accent)' : 'var(--surface)' }}
            />
        ))}
    </svg>
);

export const BinarySearchIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2, 3, 4].map(i => {
            let fillColor = 'var(--surface)';
            if (i === 0) fillColor = '#3b82f6'; // Blue for Low
            if (i === 2) fillColor = 'var(--accent)'; // Accent for Mid
            if (i === 4) fillColor = '#ef4444'; // Red for High

            return (
                <rect 
                    key={i} 
                    x={15 + i * 25} 
                    y="10" 
                    width="20" 
                    height="20" 
                    rx="3"
                    className="ds-icon-box"
                    style={{ fill: fillColor }}
                />
            );
        })}
    </svg>
);

export const BubbleSortIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2, 3, 4].map(i => (
            <rect 
                key={i} 
                x={15 + i * 25} 
                y="10" 
                width="20" 
                height="20" 
                rx="3"
                className="ds-icon-box"
                style={{ 
                    // Highlight the two adjacent blocks to represent a swap
                    fill: (i === 2 || i === 3) ? 'var(--key-color)' : 'var(--surface)' 
                }}
            />
        ))}
    </svg>
);

export const InsertionSortIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Render the main 5 array boxes */}
        {[0, 1, 2, 3, 4].map(i => (
            <rect 
                key={`array-box-${i}`}
                x={10 + i * 22} 
                y="10" 
                width="18" 
                height="20" 
                rx="3"
                className="ds-icon-box"
                style={{ 
                    // Highlight the first block as the "sorted" part
                    fill: i === 0 ? 'var(--accent)' : 'var(--surface)' 
                }}
            />
        ))}
        {/* Render the separate "key" box to the right */}
        <rect 
            x={125} 
            y="10" 
            width="18" 
            height="20" 
            rx="3"
            className="ds-icon-box"
            style={{ 
                fill: 'var(--key-color)' // Use the opposite accent color for the key
            }}
        />
    </svg>
);

export const BFSIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 50">
        {/* Nodes */}
        <rect x="65" y="2" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="40" y="20" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="90" y="20" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="25" y="38" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="55" y="38" width="20" height="10" rx="3" className="ds-icon-box" />
        {/* Edges connecting nodes */}
        <g className="ds-icon-line" fill="none">
            <line x1="75" y1="12" x2="50" y2="20" />
            <line x1="75" y1="12" x2="100" y2="20" />
            <line x1="50" y1="30" x2="35" y2="38" />
            <line x1="50" y1="30" x2="65" y2="38" />
        </g>

        <g fill="none" className="ds-icon-line" stroke="var(--accent)" strokeWidth="2">
            {/* Arrow #1*/}
            <path d="M 60 5 Q 45 4, 42 14" />
            <polyline points="46 12, 43 15, 40 12" />

            {/* Arrow #2*/}
            <path d="M 65 25 H 85" />
            <polyline points="82 22, 85 25, 82 28" />
        </g>
    </svg>
);

export const DFSIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 50">
        {/* Nodes */}
        <rect x="65" y="2" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="40" y="20" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="90" y="20" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="25" y="38" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="55" y="38" width="20" height="10" rx="3" className="ds-icon-box" />
        {/* Edges connecting nodes */}
        <g className="ds-icon-line" fill="none">
            <line x1="75" y1="12" x2="50" y2="20" />
            <line x1="75" y1="12" x2="100" y2="20" />
            <line x1="50" y1="30" x2="35" y2="38" />
            <line x1="50" y1="30" x2="65" y2="38" />
        </g>
        {/* DFS Traversal Arrows */}
        <g fill="none" className="ds-icon-line" stroke="var(--accent)" strokeWidth="2">
        {/* Arrow #1*/}
            <path d="M 60 5 Q 45 4, 42 14" />
            <polyline points="46 12, 43 15, 40 12" />
            {/* Arrow #2 */}
            <path d="M 36 23 Q 23 23, 26 32" />
            <polyline points="29 31, 26 34, 23 31" />
        </g>
    </svg>
);