import React from 'react';

const RagBar = ({ accounts = [] }) => {
    if (accounts.length === 0) return null;

    return (
        <div style={{
            padding: '8px 16px',
            backgroundColor: 'var(--cream)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
        }} className="scroll-container">
            <span style={{ fontSize: '13px', color: 'var(--text-mid)', fontWeight: 500 }}>
                📚 Knowledge loaded:
            </span>
            {accounts.map((acc, idx) => (
                <span key={idx} style={{
                    padding: '4px 10px',
                    backgroundColor: 'var(--pale-teal)',
                    color: 'var(--deep-teal)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600
                }}>
                    {acc}
                </span>
            ))}
        </div>
    );
};

export default RagBar;
