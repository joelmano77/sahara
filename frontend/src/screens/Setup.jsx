import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Chip from '../components/Chip';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { updateUser } from '../services/api';

const Setup = () => {
    const {
        userName, setUserName,
        relationship, setRelationship,
        state, setState,
        employment, setEmployment,
        accounts, setAccounts,
        userId, navigate
    } = useContext(AppContext);

    const [loading, setLoading] = useState(false);

    const relOptions = ['Spouse', 'Child (Son/Daughter)', 'Parent', 'Sibling', 'Legal heir/Other'];
    const stateOptions = ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Other'];
    const empOptions = ['Salaried (Private)', 'Government Employee', 'Self-employed', 'Retired', 'Not sure'];
    const accOptions = [
        { id: 'Bank Account', icon: '🏦' },
        { id: 'Life Insurance', icon: '🛡' },
        { id: 'EPF/PF', icon: '📊' },
        { id: 'Demat/Stocks', icon: '📈' },
        { id: 'UPI Wallet', icon: '💸' }
    ];

    const handleToggleAcc = (id) => {
        if (accounts.includes(id)) {
            setAccounts(accounts.filter(a => a !== id));
        } else {
            setAccounts([...accounts, id]);
        }
    };

    const handleToggleEmp = (id) => {
        setEmployment(employment === id ? '' : id);
    };

    const handleContinue = async () => {
        if (!userName || !relationship || accounts.length === 0) {
            alert("Please fill name, relationship, and select at least one account type.");
            return;
        }

        setLoading(true);
        try {
            await updateUser(userId, {
                name: userName,
                relationship,
                state,
                employment,
                accounts
            });
            navigate('chat');
        } catch (err) {
            console.error(err);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'var(--sat)',
            overflow: 'hidden',
            backgroundColor: 'var(--warm-white)',
            animation: 'slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('onboarding')}
                    style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--cream)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)'
                    }}
                >
                    <ArrowLeft size={20} color="var(--deep-teal)" />
                </button>
            </div>

            {/* Main content scrollable */}
            <div className="scroll-container" style={{ flex: 1, padding: '0 20px 24px' }}>
                <h1 style={{ fontSize: '32px', color: 'var(--deep-teal)', marginBottom: '8px' }}>
                    Tell us about your situation
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '15px', marginBottom: '32px' }}>
                    Personalises your guidance & document drafts
                </p>

                {/* Form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Full Name"
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            Relationship to the deceased
                        </label>
                        <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                appearance: 'none',
                                outline: 'none'
                            }}
                        >
                            <option value="" disabled>Select relation...</option>
                            {relOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            State of Residence (India)
                        </label>
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                backgroundColor: '#fff',
                                fontSize: '16px',
                                appearance: 'none',
                                outline: 'none'
                            }}
                        >
                            <option value="" disabled>Select state...</option>
                            {stateOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            Employment Status of Deceased
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {empOptions.map(opt => (
                                <Chip
                                    key={opt}
                                    label={opt}
                                    selected={employment === opt}
                                    onToggle={() => handleToggleEmp(opt)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            Accounts to Manage (Select all that apply)
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {accOptions.map(opt => (
                                <Chip
                                    key={opt.id}
                                    label={`${opt.icon} ${opt.id}`}
                                    selected={accounts.includes(opt.id)}
                                    onToggle={() => handleToggleAcc(opt.id)}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border)',
                backgroundColor: '#fff',
                paddingBottom: 'calc(16px + var(--sab))'
            }}>
                <button
                    onClick={handleContinue}
                    disabled={loading}
                    style={{
                        backgroundColor: 'var(--deep-teal)',
                        color: '#fff',
                        fontWeight: 600,
                        padding: '18px',
                        borderRadius: '16px',
                        width: '100%',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Setting up...' : 'Continue to Assistant'}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </div>
        </div>
    );
};

export default Setup;
