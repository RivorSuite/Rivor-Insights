import React from 'react';

export const ArrayIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2, 3].map(i => (
            <rect key={i} x={10 + i * 30} y="10" width="25" height="20" className="ds-icon-box" />
        ))}
    </svg>
);

export const SinglyLinkedListIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2].map(i => (
            <g key={i}>
                <rect x={10 + i * 40} y="10" width="25" height="20" className="ds-icon-box" />
                {i < 2 && (
                    <g fill="none" className="ds-icon-line">
                        <line x1={35 + i * 40} y1="20" x2={50 + i * 40} y2="20" />
                        <polyline points={`${46 + i * 40} 16, ${50 + i * 40} 20, ${46 + i * 40} 24`} />
                    </g>
                )}
            </g>
        ))}
    </svg>
);

export const StackIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Stacked items */}
        {[0, 1, 2].map(i => (
            <rect key={i} x="60" y={26 - i * 8} width="30" height="7" className="ds-icon-box" />
        ))}
        {/* Container */}
        <g className="ds-icon-line" fill="none">
            <line x1="55" y1="5" x2="55" y2="35" />
            <line x1="95" y1="5" x2="95" y2="35" />
            <line x1="55" y1="35" x2="95" y2="35" />
        </g>
    </svg>
);

export const QueueIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Centered items in the queue */}
        {[0, 1, 2].map(i => (
            <rect key={i} x={25 + i * 37.5} y="10" width="25" height="20" className="ds-icon-box" />
        ))}

        <g className="ds-icon-line" fill="none">
            {/* Centered container borders */}
            <line x1="15" y1="8" x2="135" y2="8" />
            <line x1="15" y1="32" x2="135" y2="32" />

            {/* Incoming arrow (right), spaced symmetrically */}
            <line x1="140" y1="20" x2="130" y2="20" />
            <polyline points="134 16, 130 20, 134 24" />

            {/* Outgoing arrow (left), spaced symmetrically */}
            <line x1="20" y1="20" x2="10" y2="20" />
            <polyline points="14 16, 10 20, 14 24" />
        </g>
    </svg>
);

export const BstIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 50">
        {/* Level 1 (Root) */}
        <rect x="65" y="2" width="20" height="10" rx="3" className="ds-icon-box" />
        {/* Level 2 */}
        <rect x="40" y="20" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="90" y="20" width="20" height="10" rx="3" className="ds-icon-box" />
        {/* Level 3 (Leaves under the LEFT child) */}
        <rect x="25" y="38" width="20" height="10" rx="3" className="ds-icon-box" />
        <rect x="55" y="38" width="20" height="10" rx="3" className="ds-icon-box" />
        {/* Edges connecting the nodes */}
        <g className="ds-icon-line" fill="none">
            <line x1="75" y1="12" x2="50" y2="20" />
            <line x1="75" y1="12" x2="100" y2="20" />
            <line x1="50" y1="30" x2="35" y2="38" />
            <line x1="50" y1="30" x2="65" y2="38" />
        </g>
    </svg>
);

export const DoublyLinkedListIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {[0, 1, 2].map(i => (
            <g key={i}>
                <rect x={10 + i * 40} y="10" width="25" height="20" className="ds-icon-box" />
                {i < 2 && (
                    <g fill="none" className="ds-icon-line">
                        {/* Forward pointer and arrowhead */}
                        <line x1={35 + i * 40} y1="17" x2={50 + i * 40} y2="17" />
                        <polyline points={`${46 + i * 40} 13, ${50 + i * 40} 17, ${46 + i * 40} 21`} />
                        {/* Backward pointer and arrowhead */}
                        <line x1={50 + i * 40} y1="23" x2={35 + i * 40} y2="23" />
                        <polyline points={`${39 + i * 40} 19, ${35 + i * 40} 23, ${39 + i * 40} 27`} />
                    </g>
                )}
            </g>
        ))}
    </svg>
);

export const DequeIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Items in the deque */}
        {[0, 1, 2].map(i => (
            <rect key={i} x={25 + i * 37.5} y="10" width="25" height="20" className="ds-icon-box" />
        ))}
        <g className="ds-icon-line" fill="none">
            {/* Centered container borders */}
            <line x1="15" y1="8" x2="135" y2="8" />
            <line x1="15" y1="32" x2="135" y2="32" />
            {/* Symmetrically placed double arrow on the left */}
            <line x1="5" y1="20" x2="20" y2="20" />
            <polyline points="9 16, 5 20, 9 24" />
            <polyline points="16 16, 20 20, 16 24" />
            {/* Symmetrically placed double arrow on the right */}
            <line x1="145" y1="20" x2="130" y2="20" />
            <polyline points="141 16, 145 20, 141 24" />
            <polyline points="134 16, 130 20, 134 24" />
        </g>
    </svg>
);
{/* EXTRA */}
export const HashMapIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Key (rounded rectangle) */}
        <rect x="20" y="15" width="25" height="12" rx="4" className="ds-icon-box" />
        {/* The array of thicker buckets on the right */}
        {[0, 1, 2, 3].map(i => (
            <g key={i}>
                {/* Main bucket rectangle */}
                <rect x="90" y={1 + i * 9.5} width="50" height="9" className="ds-icon-box" />
                {/* Centered and visible nested value rectangle */}
                <rect 
                    x="102.5" 
                    y={3.5 + i * 9.5} 
                    width="25" 
                    height="4" 
                    fill="var(--secondary-text)" 
                />
            </g>
        ))}
        {/* Simple line representing the lookup from the key to the table */}
        <g className="ds-icon-line" fill="none">
            <line x1="45" y1="21" x2="90" y2="21" />
            <circle cx="90" cy="21" r="2" fill="currentColor" stroke="none" />
        </g>
    </svg>
);

export const BTreeIcon = () => (
     <svg className="ds-icon-svg" viewBox="0 0 150 40">
        <rect x="50" y="5" width="50" height="12" className="ds-icon-box" />
        <rect x="20" y="23" width="50" height="12" className="ds-icon-box" />
        <rect x="80" y="23" width="50" height="12" className="ds-icon-box" />
        <line x1="75" y1="17" x2="45" y2="23" className="ds-icon-line" />
        <line x1="75" y1="17" x2="105" y2="23" className="ds-icon-line" />
    </svg>
);
export const CircularLinkedListIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 50">
        {/* Nodes and straight connectors */}
        {[0, 1, 2].map(i => (
            <g key={i}>
                <rect x={10 + i * 40} y="5" width="25" height="20" className="ds-icon-box" />
                {i < 2 && <line x1={35 + i * 40} y1="15" x2={50 + i * 40} y2="15" className="ds-icon-line" />}
            </g>
        ))}
        
        {/* Group for the path and its line-based arrowhead */}
        <g fill="none" className="ds-icon-line">
            {/* Path with straight lines */}
            <path d="M 102.5 25 V 40 H 22.5 V 28" />
            {/* arrowhead */}
            <polyline points="18.5 32, 22.5 28, 26.5 32" />
        </g>
    </svg>
);

export const CodeIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

export const DSBranchIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* The nodes/vertices */}
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        {/* The connecting lines/edges */}
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

export const AlgoIcon = () => (
     <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"></path>
        <path d="M18 20V4"></path>
        <path d="M6 20V16"></path>
    </svg>
);

export const SendIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const ArticleIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const CodeConceptsIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 9 12 6 15"></polyline>
        <line x1="11" y1="15" x2="18" y2="15"></line>
    </svg>
);

export const AboutUsIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* The 'i' (info) symbol */}
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);