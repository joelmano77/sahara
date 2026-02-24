import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';

const DocCard = ({ icon, name, meta, onDownload, disabled }) => {
    const [status, setStatus] = useState('idle'); // idle | loading | success

    const handleDownload = async () => {
        if (disabled || status !== 'idle') return;
        setStatus('loading');
        try {
            await onDownload();
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('idle');
        }
    };

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '12px',
            border: '1px solid var(--border)',
            opacity: disabled ? 0.6 : 1
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
            }}>
                {icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-dark)',
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {name}
                </div>
                <div style={{
                    fontSize: '13px',
                    color: 'var(--text-light)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {meta}
                </div>
            </div>

            <button
                onClick={handleDownload}
                disabled={disabled}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: disabled ? 'var(--cream)' : (status === 'success' ? '#43A047' : 'var(--deep-teal)'),
                    color: disabled ? 'var(--text-light)' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    border: 'none'
                }}
            >
                {status === 'idle' && (disabled ? <span style={{ fontWeight: 'bold' }}>-</span> : <Download size={20} />)}
                {status === 'loading' && <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />}
                {status === 'success' && <Check size={20} />}
            </button>
        </div>
    );
};

export default DocCard;
