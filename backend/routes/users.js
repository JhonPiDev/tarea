const express = require('express');
const router = express.Router();

router.get('/tasks/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const db = req.app.get('db');
        const tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

router.post('/tasks', async (req, res) => {
    const { userId, title, description } = req.body;
    if (!userId || !title) {
        return res.status(400).json({ message: 'El userId y el título son obligatorios' });
    }
    try {
        const db = req.app.get('db');
        await db.run(
            'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
            [userId, title, description || null]
        );
        res.json({ message: 'Tarea agregada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al agregar la tarea', error: err.message });
    }
});

router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }
    try {
        const db = req.app.get('db');
        await db.run(
            'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
            [title, description || null, taskId]
        );
        res.json({ message: 'Tarea actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar la tarea', error: err.message });
    }
});

router.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        const db = req.app.get('db');
        await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la tarea', error: err.message });
    }
});

module.exports = router;