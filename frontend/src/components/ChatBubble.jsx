import React from 'react';

const ChatBubble = ({ role, content, showSource }) => {
    const isUser = role === 'user';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start',
            animation: 'msgIn 0.28s ease',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                backgroundColor: isUser ? 'var(--deep-teal)' : '#fff',
                color: isUser ? '#fff' : 'var(--text-dark)',
                borderRadius: '16px',
                borderBottomRightRadius: isUser ? '4px' : '16px',
                borderBottomLeftRadius: isUser ? '16px' : '4px',
                boxShadow: isUser ? 'none' : 'var(--shadow-sm)',
                fontSize: '15px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
            }}>
                {content}
            </div>

            {showSource && (
                <div style={{
                    marginTop: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(74,139,139,0.1)',
                    border: '1px solid rgba(74,139,139,0.2)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: 'var(--soft-teal)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    📚 RAG · Official source
                </div>
            )}
        </div>
    );
};

export default ChatBubble;
