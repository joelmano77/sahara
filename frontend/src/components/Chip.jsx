import React from 'react';

const Chip = ({ label, selected, onToggle }) => {
    return (
        <div
            onClick={onToggle}
            style={{
                padding: '9px 16px',
                border: selected ? '1.5px solid var(--deep-teal)' : '1.5px solid var(--border)',
                borderRadius: '22px',
                cursor: 'pointer',
                userSelect: 'none',
                backgroundColor: selected ? 'var(--deep-teal)' : '#fff',
                color: selected ? '#fff' : 'var(--text-mid)',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
            }}
        >
            {label}
        </div>
    );
};

export default Chip;
