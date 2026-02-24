import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import DocCard from '../components/DocCard';
import { generateDoc } from '../services/docgen';
import { generateDocument, updateTask } from '../services/api';

const Documents = () => {
    const { navigate, userName, relationship, state, tasks, setTasks, userId } = useContext(AppContext);

    // We build a payload dynamically when generating documents so templates can
    // be filled with extra fields (deceased name, IDs).

    const handleGenerate = async (type) => {
        // Collect minimal required fields for certain document types so templates
        // can be filled. Use simple prompts for now; later we can replace with
        // a modal form for better UX.
        const extra = {};
        if (type === 'transmission') {
            extra.deceasedName = window.prompt('Deceased name (for Demat transmission):', '') || '';
            extra.dematAccountNo = window.prompt('Demat account number:', '') || '';
        } else if (type === 'lic') {
            extra.deceasedName = window.prompt('Deceased name (for LIC claim):', '') || '';
            extra.policyNumber = window.prompt('Policy number:', '') || '';
        } else if (type === 'epf') {
            extra.deceasedName = window.prompt('Deceased name (for EPF):', '') || '';
            extra.UAN = window.prompt('UAN number:', '') || '';
        } else if (type === 'account_closure' || type === 'sbi') {
            extra.deceasedName = window.prompt('Deceased name (for account closure):', '') || '';
            extra.accountNumber = window.prompt('Account number:', '') || '';
            extra.IFSC = window.prompt('IFSC (optional):', '') || '';
            extra.bankName = window.prompt('Bank / Branch name (optional):', '') || '';
        }

        const payload = { userName, relationship, state: state || 'Maharashtra', ...extra };

        try {
            // Try backend generation first (safer for larger templates)
            const resp = await generateDocument(type, payload);
            // download blob
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type.toUpperCase()}_Sahara.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            // Fallback to client-side generation
            try {
                await generateDoc(type, payload);
            } catch (e) {
                console.error('Document generation failed', e);
            }
        }

        // Mark task done if matching task exists (simple substring match)
        try {
            if (!userId) return;
            const map = {
                sbi: 'SBI',
                lic: 'LIC',
                epf: 'EPF',
                account_closure: 'Account',
                transmission: 'Demat'
            };
            const needle = map[type] || '';
            const idx = tasks.findIndex(t => (t.name && t.name.includes(needle)) || (t.category && t.category === type));
            if (idx >= 0) {
                const res = await updateTask(userId, idx, 'done');
                if (res && res.data) setTasks(res.data);
            }
        } catch (err) {
            console.error('Failed to update task status', err);
        }
    };

    return (
        <div style={{
            flex: 1, backgroundColor: 'var(--warm-white)',
            display: 'flex', flexDirection: 'column',
            paddingTop: 'var(--sat)', overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>

            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('dashboard')}
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

            <div className="scroll-container" style={{ flex: 1, padding: '0 20px 100px' }}>

                <h1 style={{ fontSize: '36px', color: 'var(--deep-teal)', marginBottom: '8px' }}>
                    Documents
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '15px', marginBottom: '32px' }}>
                    Ready-to-print letters & forms
                </p>

                <DocCard
                    icon="�"
                    name="Transmission Request Letter"
                    meta="Demat / securities transmission"
                    onDownload={() => handleGenerate('transmission')}
                />

                <DocCard
                    icon="🛡"
                    name="LIC Insurance Claim"
                    meta="Death claim · Policy number required"
                    onDownload={() => handleGenerate('lic')}
                />

                <DocCard
                    icon="📊"
                    name="EPF Form 10D / 20"
                    meta="Pension / PF withdrawal · Family member"
                    onDownload={() => handleGenerate('epf')}
                />

                <DocCard
                    icon="📄"
                    name="Account Closure Request"
                    meta="Bank account closure / nomination checks"
                    onDownload={() => handleGenerate('account_closure')}
                />

                <DocCard
                    icon="�"
                    name="Transmission Request Letter"
                    meta="Demat / securities transmission"
                    onDownload={() => handleGenerate('transmission')}
                />

                {/* CTA */}
                <div style={{
                    backgroundColor: 'var(--cream)',
                    borderRadius: '20px',
                    padding: '24px',
                    marginTop: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                        Need another document?
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '20px' }}>
                        Tell the assistant what you need
                    </p>
                    <button
                        onClick={() => navigate('chat')}
                        style={{
                            backgroundColor: 'var(--deep-teal)',
                            color: '#fff',
                            fontWeight: 600,
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontSize: '15px'
                        }}
                    >
                        Ask Assistant
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Documents;
