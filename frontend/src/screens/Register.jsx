import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { registerUser, googleLoginUser } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const { navigate, login } = useContext(AppContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const res = await registerUser({ name, email, password });
            login(res.data.token, res.data.user);
            navigate('setup'); // New users go to setup
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const res = await googleLoginUser({ credential: credentialResponse.credential });
            login(res.data.token, res.data.user);
            // We should maybe check if they have completed setup. 
            // For now, new users get pushed to setup.
            // If they already exist, we could route them to dashboard, but let's default to setup if they just registered.
            // A more complex check could see if their profile is complete.
            navigate('setup');
        } catch (err) {
            setError(err.response?.data?.error || 'Google signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            flex: 1, backgroundColor: 'var(--warm-white)',
            display: 'flex', flexDirection: 'column',
            paddingTop: 'var(--sat)', overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('login')}
                    style={{
                        width: '40px', height: '40px',
                        backgroundColor: 'var(--cream)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--border)'
                    }}
                >
                    <ArrowLeft size={20} color="var(--deep-teal)" />
                </button>
            </div>

            <div className="scroll-container" style={{ flex: 1, padding: '0 20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🕊️</div>
                    <h1 style={{ fontSize: '32px', color: 'var(--deep-teal)', marginBottom: '8px', fontFamily: "'Cormorant Garamond', serif" }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>
                        Start your journey with Sahara
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px',
                                border: '1px solid var(--border)', backgroundColor: '#fff',
                                fontSize: '16px', outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px',
                                border: '1px solid var(--border)', backgroundColor: '#fff',
                                fontSize: '16px', outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px',
                                border: '1px solid var(--border)', backgroundColor: '#fff',
                                fontSize: '16px', outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: 'var(--deep-teal)', color: '#fff',
                            fontWeight: 600, padding: '16px', borderRadius: '12px',
                            width: '100%', fontSize: '16px',
                            opacity: loading ? 0.7 : 1, marginTop: '8px'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', color: 'var(--text-light)', fontSize: '14px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                    <span>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Sign-In was unsuccessful. Try again later.')}
                        useOneTap
                        theme="outline"
                        size="large"
                        shape="pill"
                        text="continue_with"
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '15px', color: 'var(--text-mid)' }}>
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('login')}
                        style={{ color: 'var(--gold)', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Sign In
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
