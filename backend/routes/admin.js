const express = require('express');
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const db = req.app.get('db');
        const users = await db.all('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

module.exports = router;