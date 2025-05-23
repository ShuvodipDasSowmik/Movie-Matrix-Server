const express = require('express');
const db = require('./database');
const router = express.Router();

router.post('/adminEntry', async (req, res) => {

    try{
        const data = req.body;
        console.log('Received admin entry request:', data);
    }
    catch (error) {
        console.error('Error processing admin entry:', error);
        return res.status(500).json('Internal server error');
    }

})

module.exports = router;
