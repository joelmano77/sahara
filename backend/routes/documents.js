const express = require('express');
const router = express.Router();
const docxService = require('../services/docxService');

router.post('/generate', async (req, res, next) => {
    try {
        // Pass the entire request body through so the docx service can use
        // additional fields (deceasedName, accountNumber, policyNumber, UAN, etc.)
        const { type } = req.body;
        const buffer = await docxService.generateDoc(type, req.body);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${type.toUpperCase()}_Claim_Letter_Sahara.docx"`);
        res.send(buffer);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
