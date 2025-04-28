const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const user = results[0];
        res.json({ message: 'Login exitoso', user });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")',
            [name, email, password]
        );
        res.status(201).json({ message: 'Registro exitoso' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

module.exports = router;