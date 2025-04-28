const express = require('express');
const cors = require('cors');
const app = express();
const initDb = require('./db_sqlite');

app.use(cors());
app.use(express.json());

initDb.then(db => {
    app.set('db', db);
    console.log('Conectado a SQLite');

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/admin', require('./routes/admin'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al conectar a SQLite:', err);
});