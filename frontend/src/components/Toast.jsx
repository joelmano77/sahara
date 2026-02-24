import React, { useEffect, useState } from 'react';

const Toast = ({ message, visible }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [visible, message]);

    return (
        <div style={{
            position: 'fixed',
            bottom: 'calc(var(--nav-h) + 12px)',
            left: '50%',
            transform: `translate(-50%, ${show ? '0' : '20px'})`,
            opacity: show ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            backgroundColor: 'var(--deep-teal)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '22px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: 'var(--shadow-md)',
            zIndex: 200,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
        }}>
            {message}
        </div>
    );
};

export default Toast;
