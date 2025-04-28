const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/users', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;