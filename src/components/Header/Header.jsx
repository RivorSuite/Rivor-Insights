import React from 'react';

const AccentColorSwitcher = ({ onSetAccent }) => {
    const colors = ['indigo', 'green', 'pink', 'orange', 'cyan'];
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            {colors.map(color => (
                <button 
                    key={color}
                    onClick={() => onSetAccent(color)}
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: `var(--accent)`,
                        cursor: 'pointer',
                        border: '2px solid var(--surface)',
                        boxShadow: '0 0 0 1px var(--border)'
                    }}
                    data-accent={color}
                    aria-label={`Set accent color to ${color}`}
                />
            ))}
        </div>
    );
};


function Header({ theme, onToggleTheme, onSetAccent, accent }) {
    // Gradient map for each accent color
    const accentGradients = {
        indigo: 'linear-gradient(45deg, #4f46e5, #c084fc)', // Indigo to a bright Lavender
        green: 'linear-gradient(45deg, #16a34a, #bef264)',  // Green to a bright Lime
        pink: 'linear-gradient(45deg, #db2777, #fda4af)',   // Pink to a light Rose
        orange: 'linear-gradient(45deg, #ea580c, #fde047)', // Orange to a bright Saffron Yellow
        cyan: 'linear-gradient(45deg, #0891b2, #67e8f9)',   // Cyan to a bright Sky Blue
    };

    const headerStyle = {
        margin: 0,
        fontSize: '32px',
        fontWeight: '800',
        background: accentGradients[accent] || accentGradients.indigo,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            backgroundColor: 'color-mix(in srgb, var(--surface) 80%, transparent)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--border)',
            zIndex: 100
        }}>

            <h2 style={headerStyle} key={accent}> Rivor </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <AccentColorSwitcher onSetAccent={onSetAccent} />
                <button onClick={onToggleTheme} className="auth-button" style={{ width: 'auto', padding: '8px 12px' }}>
                    {theme === 'dark' ? 'Light ☀️' : 'Dark 🌙'}
                </button>
            </div>
        </div>
    );
}
export default Header;