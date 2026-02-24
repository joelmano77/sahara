import React from 'react';

const TaskCard = ({ icon, type, name, sub, status, onClick }) => {
    const getColors = () => {
        switch (type) {
            case 'bank': return '#E3F2FD';
            case 'insurance': return '#F3E5F5';
            case 'digital': return '#E8F5E9';
            case 'investment': return '#FFF3E0';
            case 'pension': return '#FCE4EC';
            default: return '#E3F2FD';
        }
    };

    const getStatusBadge = () => {
        switch (status) {
            case 'pending': return { bg: '#FFF3E0', color: '#E65100', text: 'Pending' };
            case 'progress': return { bg: '#E3F2FD', color: '#1565C0', text: 'In Progress' };
            case 'submitted': return { bg: '#EDE7F6', color: '#4527A0', text: 'Submitted' };
            case 'done': return { bg: '#E8F5E9', color: '#2E7D32', text: 'Done ✓' };
            default: return { bg: '#FFF3E0', color: '#E65100', text: 'Pending' };
        }
    };

    const badge = getStatusBadge();

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px',
                cursor: onClick ? 'pointer' : 'default',
                border: '1px solid var(--border)'
            }}
        >
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: getColors(),
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
                    {sub}
                </div>
            </div>

            <div style={{
                padding: '6px 10px',
                backgroundColor: badge.bg,
                color: badge.color,
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                whiteSpace: 'nowrap'
            }}>
                {badge.text}
            </div>
        </div>
    );
};

export default TaskCard;
