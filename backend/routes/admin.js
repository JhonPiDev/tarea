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

router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const db = req.app.get('db');
        const result = await db.run('DELETE FROM users WHERE id = ?', [userId]);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
});

module.exports = router;