import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ChatBubble from '../components/ChatBubble';
import RagBar from '../components/RagBar';
import { ArrowLeft, Send } from 'lucide-react';
import { sendChat, getChatHistory } from '../services/api';

const Chat = () => {
    const { navigate, accounts, history, setHistory, userId, busy, setBusy } = useContext(AppContext);
    const [inputVal, setInputVal] = useState('');
    const [showQuick, setShowQuick] = useState(history.length === 0);
    const scrollRef = useRef(null);

    // Initial load of chat history
    useEffect(() => {
        if (userId) {
            getChatHistory(userId)
                .then(res => {
                    const loadedHistory = res.data || [];
                    setHistory(loadedHistory);
                    if (loadedHistory.length > 0) {
                        setShowQuick(false);
                    }
                })
                .catch(err => console.error("Failed to load chat history", err));
        }
    }, [userId, setHistory]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, busy]);

    const handleSend = async (text) => {
        if (!text.trim() || busy) return;

        setShowQuick(false);
        setBusy(true);
        setInputVal('');

        const newMsg = { role: 'user', content: text };
        const updatedHistory = [...history, newMsg];
        setHistory(updatedHistory);

        try {
            const res = await sendChat({
                message: text,
                history: history, // Send original history, backend will append the new message
                userId,
                accounts
            });

            const aiReply = {
                role: 'assistant',
                content: res.data.reply,
                sources: res.data.sources,
                showDocCTA: res.data.showDocCTA
            };

            setHistory([...updatedHistory, aiReply]);
        } catch (err) {
            console.error(err);
            setHistory([
                ...updatedHistory,
                { role: 'assistant', content: 'Connection failed. Please try again.' }
            ]);
        } finally {
            setBusy(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(inputVal);
        }
    };

    return (
        <div style={{
            flex: 1, backgroundColor: 'var(--warm-white)',
            display: 'flex', flexDirection: 'column',
            paddingTop: 'var(--sat)', overflow: 'hidden'
        }}>
            {/* Top Bar */}
            <div style={{
                padding: '10px 16px 12px',
                borderBottom: '1px solid var(--border)',
                backgroundColor: '#fff',
                display: 'flex', alignItems: 'center', gap: '12px'
            }}>
                <button onClick={() => navigate('setup')} style={{ padding: '8px' }}>
                    <ArrowLeft size={24} color="var(--deep-teal)" />
                </button>

                <div style={{
                    width: '40px', height: '40px',
                    backgroundColor: 'var(--deep-teal)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                }}>
                    🕊️
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)' }}>
                        Sahara Assistant
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: busy ? 'var(--gold)' : '#388E3C' }}>
                        <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: busy ? 'var(--gold)' : '#388E3C',
                            animation: busy ? 'pulse 1s infinite' : 'none'
                        }} />
                        {busy ? 'Thinking…' : 'Online · RAG-powered'}
                    </div>
                </div>
            </div>

            <RagBar accounts={accounts} />

            {/* Chat feed */}
            <div ref={scrollRef} className="scroll-container" style={{
                flex: 1, padding: '14px 16px 20px', // Removed arbitrary large padding
                display: 'flex', flexDirection: 'column', gap: '12px',
                overflowY: 'auto' // Added explicit scrolling constraint
            }}>

                {history.length === 0 && (
                    <div style={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#fff', padding: '16px',
                        borderRadius: '16px', borderBottomLeftRadius: '4px',
                        boxShadow: 'var(--shadow-sm)', maxWidth: '85%',
                        fontSize: '15px', lineHeight: 1.5, color: 'var(--text-dark)'
                    }}>
                        Namaste 🙏 I'm here to help you navigate what lies ahead. Based on your details, I can guide you through {accounts.join(', ').toLowerCase()} closures and claims.
                        <br /><br />
                        Where would you like to start?
                    </div>
                )}

                {history.map((msg, idx) => (
                    <React.Fragment key={idx}>
                        <ChatBubble
                            role={msg.role}
                            content={msg.content}
                            showSource={msg.sources && msg.sources.length > 0}
                        />
                        {msg.showDocCTA && (
                            <div style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                                <button
                                    onClick={() => navigate('documents')}
                                    style={{
                                        backgroundColor: 'var(--pale-teal)',
                                        color: 'var(--deep-teal)',
                                        padding: '8px 16px', borderRadius: '20px',
                                        fontSize: '13px', fontWeight: 600, border: 'none'
                                    }}
                                >
                                    📝 Open Documents
                                </button>
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {busy && (
                    <div style={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#fff', padding: '14px 20px',
                        borderRadius: '16px', borderBottomLeftRadius: '4px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex', gap: '6px'
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-light)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-light)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-light)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                    </div>
                )}

            </div>

            {/* Input Area */}
            <div style={{
                // Changed from absolute to standard block level element in the flex column
                backgroundColor: '#fff', borderTop: '1px solid var(--border)',
                padding: '12px 16px', zIndex: 10,
                paddingBottom: 'calc(var(--nav-h) + 12px)' // padding for bottom nav space
            }}>

                {showQuick && accounts.length > 0 && (
                    <div className="scroll-container" style={{
                        display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', whiteSpace: 'nowrap'
                    }}>
                        {accounts.slice(0, 3).map(acc => (
                            <button
                                key={acc}
                                onClick={() => handleSend(`${acc} guidance`)}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid var(--soft-teal)',
                                    color: 'var(--soft-teal)',
                                    borderRadius: '20px',
                                    backgroundColor: '#fff',
                                    fontSize: '13px', fontWeight: 500
                                }}
                            >
                                {acc}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <textarea
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        disabled={busy}
                        style={{
                            flex: 1, backgroundColor: 'var(--warm-white)',
                            border: '1px solid var(--border)', borderRadius: '22px',
                            padding: '13px 18px', fontSize: '15px', color: 'var(--text-dark)',
                            resize: 'none', height: '48px', maxHeight: '80px',
                            fontFamily: 'inherit', outline: 'none'
                        }}
                    />
                    <button
                        onClick={() => handleSend(inputVal)}
                        disabled={!inputVal.trim() || busy}
                        style={{
                            width: '48px', height: '48px', borderRadius: '24px',
                            backgroundColor: inputVal.trim() && !busy ? 'var(--deep-teal)' : 'var(--cream)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', transition: 'all 0.2s', flexShrink: 0
                        }}
                    >
                        <Send size={20} color={inputVal.trim() && !busy ? '#fff' : 'var(--text-light)'} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
