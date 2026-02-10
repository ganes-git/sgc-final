import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.background = 'transparent';
            }}
        >
            <span>{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? '#fff' : '#000'
            }}></div>
        </button>
    );
};

export default ThemeToggle;
