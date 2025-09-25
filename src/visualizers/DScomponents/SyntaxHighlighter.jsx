import React from 'react';

// A simple parser to identify tokens for highlighting
const pythonKeywords = [
    'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'len'
];

const tokenize = (code) => {
    const tokens = [];
    const regex = new RegExp(
        `(#.*)|(".*?")|('.*?')|(\\w+)`, 'g'
    );

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(code)) !== null) {
        const startIndex = match.index;
        // Add plain text (like spaces, colons, parentheses) before this match
        if (startIndex > lastIndex) {
            tokens.push({ type: 'default', value: code.substring(lastIndex, startIndex) });
        }

        // Determine the token type and add it
        const [fullMatch, comment, doubleString, singleString, word] = match;
        if (comment) {
            tokens.push({ type: 'comment', value: fullMatch });
        } else if (doubleString || singleString) {
            tokens.push({ type: 'string', value: fullMatch });
        } else if (word) {
            // After finding a word, check if it's a keyword
            if (pythonKeywords.includes(word)) {
                tokens.push({ type: 'keyword', value: fullMatch });
            } else {
                // If it's not a keyword (like 'add_to_head'), treat it as default text
                tokens.push({ type: 'default', value: fullMatch });
            }
        }
        
        lastIndex = regex.lastIndex;
    }

    // Add any remaining plain text at the very end of the code
    if (lastIndex < code.length) {
        tokens.push({ type: 'default', value: code.substring(lastIndex) });
    }

    return tokens;
};

function SyntaxHighlighter({ code }) {
    const tokens = tokenize(code);
    return (
        <pre>
            <code style={{ fontFamily: "'Fira Code', 'Courier New', Courier, monospace" }}>
                {tokens.map((token, index) => (
                    <span key={index} className={`token-${token.type}`}>
                        {token.value}
                    </span>
                ))}
            </code>
        </pre>
    );
}

export default SyntaxHighlighter;