import React from 'react';

const StepCard = ({ number, title, description, status, tags = [] }) => {
    const isDone = status === 'done';
    const isActive = status === 'active';

    const circleBg = isDone ? '#E8F5E9' : (isActive ? 'var(--deep-teal)' : 'var(--cream)');
    const circleColor = isDone ? '#2E7D32' : (isActive ? '#fff' : 'var(--text-light)');
    const circleContent = isDone ? '✓' : number;

    return (
        <div style={{
            display: 'flex',
            gap: '16px',
            position: 'relative',
            paddingBottom: '24px'
        }}>
            {/* Connecting line */}
            <div style={{
                position: 'absolute',
                left: '17px',
                top: '36px',
                bottom: 0,
                width: '2px',
                backgroundColor: isDone ? '#43A047' : 'var(--border)',
                zIndex: 0
            }} />

            {/* Circle */}
            <div style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                borderRadius: '11px',
                backgroundColor: circleBg,
                color: circleColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 600,
                zIndex: 1,
                border: isDone ? 'none' : (isActive ? 'none' : '1px solid var(--border)')
            }}>
                {circleContent}
            </div>

            {/* Content */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '16px',
                flex: 1,
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                border: isActive ? '1.5px solid var(--deep-teal)' : '1px solid var(--border)'
            }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: isActive ? 'var(--text-dark)' : (isDone ? 'var(--text-mid)' : 'var(--text-light)'),
                    marginBottom: '6px'
                }}>
                    {title}
                </div>
                <div style={{
                    fontSize: '14px',
                    color: 'var(--text-mid)',
                    lineHeight: 1.5,
                    marginBottom: tags.length > 0 ? '12px' : 0
                }}>
                    {description}
                </div>

                {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {tags.map((tag, idx) => (
                            <span key={idx} style={{
                                padding: '4px 10px',
                                backgroundColor: 'var(--cream)',
                                color: 'var(--text-mid)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 500
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepCard;
