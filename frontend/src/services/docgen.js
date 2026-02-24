import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

export const generateDoc = async (type, data = {}) => {
    // Accept a larger data object with optional fields to fill templates
    const {
        userName, relationship, state,
        deceasedName, accountNumber, branchName, policyNumber,
        UAN, dematAccountNo, IFSC, bankName
    } = data;

    const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    let title = 'Claim Letter';
    let lines = [];

    if (type === 'sbi') {
        title = 'SBI Account Closure Application';
        lines = [
            'To,',
            'The Branch Manager,',
            'State Bank of India,',
            branchName || '[Branch Name/Address]',
            '',
            `Date: ${date}`,
            '',
            `Subject: Application for Closure of Account Without Nominee (Under \u20B95,00,000)`,
            '',
            'Respected Sir / Madam,',
            '',
            `I, ${userName}, am the ${relationship} of the late ${deceasedName || '[Deceased Name]'} who held a savings account ${accountNumber || '[Account Number]'} at your branch.`,
            `The account holder passed away on ${date /* placeholder for death date - replace if needed */}, and unfortunately, there is no nominee registered in the account. The total balance is under \u20B95,00,000/-.`,
            '',
            'As an eligible legal heir, I request you to process the claim and release the balance amount using the simplified indemnity bond procedure, as per RBI master directions.',
            '',
            'I am enclosing the following documents:',
            '1. Original Death Certificate and 3 attested copies',
            '2. Passbook / ATM Card of the deceased',
            '3. My KYC Documents (Aadhaar & PAN)',
            '4. Indemnity Bond on appropriate stamp paper',
            '',
            'Please transfer the balance to my account details below:',
            `Account Name: ${userName || '[Your Name as per Bank]'} ,`,
            `Account Number: ${accountNumber || '[Your Account Number]'}`,
            `IFSC Code: ${IFSC || '[Your Bank IFSC]'}`,
            `Bank Name: ${bankName || '[Your Bank Name]'}`,
            '',
            'I kindly request you to acknowledge receipt and process this claim at your earliest convenience.',
            '',
            'Thanking you,',
            '',
            'Yours faithfully,',
            '',
            '(Signature)',
            userName,
            '[Your Contact Number]',
            `[Your Address in ${state || '[State]'}]`
        ];
    } else if (type === 'lic') {
        title = 'LIC Policy Death Claim';
        lines = [
            'To,',
            'The Branch Manager,',
            'Life Insurance Corporation of India,',
            branchName || '[Branch Name/Address]',
            '',
            `Date: ${date}`,
            '',
            `Subject: Death Claim intimation for Policy Number: ${policyNumber || '[Policy Number]'}`,
            '',
            'Respected Sir / Madam,',
            '',
            `I, ${userName}, am the ${relationship} of the policyholder late ${deceasedName || '[Deceased Name]'}.`,
            `I am writing to intimate the death claim for the above-mentioned policy.`,
            '',
            'Enclosed are the necessary documents: Form 3783, original policy bond, death certificate, and my NEFT mandate.',
            '',
            'Please process the claim within the stipulated time.',
            '',
            'Yours faithfully,',
            '',
            '(Signature)',
            userName
        ];
    } else if (type === 'epf') {
        title = 'EPF Pension Claim Form 10D Cover Letter';
        lines = [
            'To,',
            'The Regional PF Commissioner,',
            'Employees\' Provident Fund Organisation,',
            '[Regional Office Address]',
            '',
            `Date: ${date}`,
            '',
            `Subject: Submission of Form 10D for Monthly Pension Claim`,
            '',
            'Respected Sir / Madam,',
            '',
            `I, ${userName}, am submitting this as the ${relationship} of late ${deceasedName || '[Deceased Name]'} (UAN: ${UAN || '[UAN Number]'}).`,
            `Please find enclosed the Form 10D along with the death certificate and other required proofs for commencing the monthly family pension.`,
            '',
            'Yours faithfully,',
            '',
            '(Signature)',
            userName
        ];
    } else {
        lines = [`Generic letter for ${userName} (${relationship} from ${state})`];
    }

    if (type === 'account_closure') {
        title = 'Bank Account Closure Request';
        lines = [
            'To,',
            'The Branch Manager,',
            bankName || '[Bank Name & Branch Address]',
            '',
            `Date: ${date}`,
            '',
            'Subject: Request for closure of bank account and transfer of balance',
            '',
            'Respected Sir / Madam,',
            '',
            `I, ${userName}, hereby request the closure of account number ${accountNumber || '[Account Number]'} held in the name of the late ${deceasedName || '[Deceased Name]'}. I am the ${relationship} and enclose the required documents for verification.`,
            '',
            'Please transfer the remaining balance to the following account:',
            `Account Name: ${userName || '[Your Name]'}`,
            `Account Number: ${accountNumber || '[Your Account Number]'}`,
            `IFSC: ${IFSC || '[IFSC CODE]'}`,
            '',
            'Enclosures:',
            '- Death Certificate (original + attested copies)',
            '- Proof of relationship',
            '- KYC of claimant',
            '',
            'Yours faithfully,',
            '',
            '(Signature)',
            userName
        ];
    }

    if (type === 'transmission') {
        title = 'Demat Transmission Request';
        lines = [
            'To,',
            'The Depository Participant / Broker,',
            '[DP Name & Address]',
            '',
            `Date: ${date}`,
            '',
            'Subject: Transmission of securities on account of death of the holder',
            '',
            'Respected Sir / Madam,',
            '',
            `I, ${userName}, am the ${relationship} of the deceased ${deceasedName || '[Deceased Name]'}, holding Demat Account No: ${dematAccountNo || '[Demat Account No]'}. I request transmission of the securities to the legal heir’s demat account as per the attached documents.`,
            '',
            'Enclosed Documents:',
            '- Death Certificate (original + attested copies)',
            '- Legal Heir Certificate / Succession Certificate (if applicable)',
            '- KYC of claimant',
            '- Copy of account statements',
            '',
            'Please confirm receipt and advise the next steps.',
            '',
            'Yours faithfully,',
            '',
            '(Signature)',
            userName
        ];
    }

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: title,
                        heading: HeadingLevel.HEADING_1,
                        style: 'Title'
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Generated by Sahara · Replace all [ ] before printing", italics: true, color: "8A9E9E", size: 18 })
                        ],
                        spacing: { after: 200 }
                    }),
                    ...lines.map(line => {
                        if (line === '') return new Paragraph({ text: '', spacing: { after: 160 } });
                        return new Paragraph({
                            children: [new TextRun({ text: line, font: "Calibri", size: 22 })],
                            spacing: { after: 60 }
                        });
                    })
                ]
            }
        ]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toUpperCase()}_Claim_Letter_Sahara.docx`;
    a.click();
    URL.revokeObjectURL(url);
};
