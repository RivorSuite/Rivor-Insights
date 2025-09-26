import React from 'react';

export const VariableIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Main window/container shape */}
        <rect x="35" y="2" width="80" height="36" rx="4" className="ds-icon-box" strokeWidth="3" />
        {/* Header bar of the window */}
        <path d="M 35 10 H 115" className="ds-icon-line" strokeWidth="3" />

        {/* The '(x)' text, with a new class and default color */}
        <text 
            x="75" y="29" 
            fontFamily="monospace" 
            fontSize="18" 
            fill="var(--secondary-text)" 
            textAnchor="middle" 
            fontWeight="600"
            fontStyle="italic"
            className="ds-icon-text"
        >
            (x)
        </text>
    </svg>
);

export const OperatorIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Main container, now larger */}
        <rect x="45" y="2" width="60" height="36" rx="5" className="ds-icon-box" fill="var(--background)" />
        {/* Quadrant 1: Arithmetic (+) */}
        <rect x="45" y="2" width="30" height="18" fill="var(--surface)" />
        <text x="60" y="16" className="ds-icon-text" textAnchor="middle" fontSize="14" fill="var(--secondary-text)">+</text>
        {/* Quadrant 2: Comparison (>) */}
        <rect x="75" y="2" width="30" height="18" fill="var(--background)" />
        <text x="90" y="16" className="ds-icon-text" textAnchor="middle" fontSize="14" fill="var(--secondary-text)">{'>'}</text>
        {/* Quadrant 3: Logical (and) */}
        <rect x="45" y="20" width="30" height="18" fill="var(--background)" />
        <text x="60" y="34" className="ds-icon-text" textAnchor="middle" fontSize="12" fill="var(--secondary-text)">and</text>
        {/* Quadrant 4: Bitwise (&) */}
        <rect x="75" y="20" width="30" height="18" fill="var(--surface)" />
        <text x="90" y="34" className="ds-icon-text" textAnchor="middle" fontSize="14" fill="var(--secondary-text)">&</text>
    </svg>
);

export const ConditionalIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Central decision node, moved down slightly */}
        <circle cx="75" cy="22" r="4" fill="var(--background)" stroke="var(--secondary-text)" strokeWidth="2" className="ds-icon-line" />
        {/* Top branch and node, line now connects to edge */}
        <line x1="75" y1="18" x2="75" y2="8" className="ds-icon-line" strokeWidth="2" />
        <circle cx="75" cy="5" r="4" fill="var(--secondary-text)" className="ds-icon-text" /> 
        {/* Left branch and node, path now connects to edge */}
        <path d="M 71 22 H 50 V 35" fill="none" className="ds-icon-line" strokeWidth="2" />
        <circle cx="50" cy="35" r="4" fill="var(--secondary-text)" className="ds-icon-text" />
        {/* Right branch and node, path now connects to edge */}
        <path d="M 79 22 H 100 V 35" fill="none" className="ds-icon-line" strokeWidth="2" />
        <circle cx="100" cy="35" r="4" fill="var(--secondary-text)" className="ds-icon-text" />
    </svg>
);

export const LoopIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* The main rounded rectangular path */}
        <path 
            d="M 105 15 V 25 A 5 5 0 0 1 100 30 H 50 A 5 5 0 0 1 45 25 V 15 A 5 5 0 0 1 50 10 H 95"
            fill="none" 
            className="ds-icon-line" 
            strokeWidth="3.5"
        />
        {/* The arrowhead */}
        <path 
            d="M 90 2 L 102 10 L 90 18 Z"
            className="ds-icon-line" 
            fill="currentColor"
        />
    </svg>
);

export const ListIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Inner boxes, now perfectly centered as a group */}
        {[0, 1, 2].map(i => (
            <rect key={i} x={40 + i * 25} y="10" width="20" height="20" className="ds-icon-box" />
        ))}
        {/* Brackets positioned for a larger, symmetrical gap */}
        <text x="24" y="28" fontFamily="monospace" fontSize="30" className="ds-icon-text" fill="var(--secondary-text)">[</text>
        <text x="110" y="28" fontFamily="monospace" fontSize="30" className="ds-icon-text" fill="var(--secondary-text)">]</text>
    </svg>
);

export const TupleIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Inner boxes, now perfectly centered as a group */}
        {[0, 1, 2].map(i => (
            <rect key={i} x={40 + i * 25} y="10" width="20" height="20" rx="4" className="ds-icon-box" />
        ))}
        {/* Parentheses positioned for a larger, symmetrical gap */}
        <text x="24" y="28" fontFamily="monospace" fontSize="30" className="ds-icon-text" fill="var(--secondary-text)">(</text>
        <text x="110" y="28" fontFamily="monospace" fontSize="30" className="ds-icon-text" fill="var(--secondary-text)">)</text>
    </svg>
);

export const DictionaryIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* Key on the left */}
        <text x="35" y="26" fontFamily="monospace" fontSize="14" className="ds-icon-text" fill="var(--secondary-text)">'k'</text>
        {/* Value box on the right */}
        <rect x="91" y="12" width="30" height="20" rx="4" className="ds-icon-box" />
        {/* Arrow connecting key to value */}
        <line x1="60" y1="23" x2="85" y2="23" className="ds-icon-line" strokeWidth="2"/>
        {/* Curly braces */}
        <text x="25" y="30" fontFamily="monospace" fontSize="30" className="ds-icon-text" fill="var(--secondary-text)">{'{'}</text>
        <text x="120" y="30" fontFamily="monospace" fontSize="30" className="ds-icon-text" fill="var(--secondary-text)">{'}'}</text>
    </svg>
);

export const FunctionIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* A gear inside a box, symbolizing a process or machine */}
        <rect x="45" y="5" width="60" height="30" rx="4" className="ds-icon-box" />
        <circle cx="75" cy="20" r="8" fill="none" className="ds-icon-line" />
        <path d="M 75 10 L 75 30 M 65 15 L 85 25 M 65 25 L 85 15" className="ds-icon-line" />
    </svg>
);

export const FibonacciIcon = () => (
    <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* A spiral, representing the Fibonacci sequence in nature */}
        <path d="M 75 20 C 85 20 85 10 75 10 C 60 10 60 25 75 25 C 95 25 95 5 75 5 C 50 5 50 30 75 30" fill="none" className="ds-icon-line" strokeWidth="2"/>
    </svg>
);

export const FactorialIcon = () => (
     <svg className="ds-icon-svg" viewBox="0 0 150 40">
        {/* "n!" symbol to be explicit */}
        <text x="60" y="30" fontFamily="monospace" fontSize="24" fill="var(--secondary-text)">n!</text>
    </svg>
);