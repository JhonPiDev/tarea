const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/tasks/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [results] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.post('/tasks', async (req, res) => {
    const { userId, title, description } = req.body;
    if (!userId || !title) {
        return res.status(400).json({ message: 'El userId y el título son obligatorios' });
    }
    try {
        await db.query(
            'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
            [userId, title, description || null]
        );
        res.json({ message: 'Tarea agregada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar la tarea' });
    }
});

router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }
    try {
        await db.query(
            'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
            [title, description || null, taskId]
        );
        res.json({ message: 'Tarea actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});

router.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});

module.exports = router;