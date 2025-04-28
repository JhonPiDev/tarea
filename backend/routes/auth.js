const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = req.app.get('db');
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        res.json({ message: 'Login exitoso', user });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const db = req.app.get('db');
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")',
            [name, email, password]
        );
        res.status(201).json({ message: 'Registro exitoso' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
    }
});

module.exports = router;