import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Onboarding = () => {
    const { navigate } = useContext(AppContext);

    return (
        <div style={{
            flex: 1,
            backgroundColor: 'var(--deep-teal)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Circles */}
            <div style={{
                position: 'absolute',
                top: '-12vw',
                right: '-12vw',
                width: '60vw',
                height: '60vw',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.03)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '18vw',
                left: '-10vw',
                width: '40vw',
                height: '40vw',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.03)'
            }} />
            <div style={{
                position: 'absolute',
                top: '35%',
                left: '5%',
                width: '30vw',
                height: '30vw',
                borderRadius: '50%',
                backgroundColor: 'rgba(201,169,110,0.05)'
            }} />

            {/* Hero Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '16px 32px',
                zIndex: 1
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--gold)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    marginBottom: '24px'
                }}>
                    🕊️
                </div>

                <h1 style={{
                    fontSize: 'clamp(44px, 12vw, 56px)',
                    fontWeight: 300,
                    margin: '0 0 8px 0',
                    color: '#fff'
                }}>
                    Sahara
                </h1>

                <div style={{
                    fontSize: '12px',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '24px'
                }}>
                    BEREAVEMENT ASSISTANT
                </div>

                <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: 'clamp(18px, 5vw, 22px)',
                    color: 'rgba(255,255,255,0.65)',
                    margin: 0,
                    lineHeight: 1.55,
                    maxWidth: '280px'
                }}>
                    Guiding you through life's most difficult paperwork, with care.
                </p>
            </div>

            {/* Footer CTA */}
            <div style={{
                padding: '24px 32px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 1
            }}>
                <button
                    onClick={() => navigate('register')}
                    style={{
                        backgroundColor: 'var(--gold)',
                        color: 'var(--deep-teal)',
                        fontWeight: 700,
                        padding: '18px',
                        borderRadius: '16px',
                        width: '100%',
                        fontSize: '16px',
                        transition: 'opacity 0.2s',
                        cursor: 'pointer'
                    }}
                    onActive={(e) => e.target.style.opacity = 0.8}
                >
                    Begin Your Journey
                </button>

                <button
                    onClick={() => navigate('login')}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.75)',
                        padding: '17px',
                        borderRadius: '16px',
                        width: '100%',
                        fontSize: '16px',
                        fontWeight: 500
                    }}
                >
                    I have an existing case
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
