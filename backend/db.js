const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // SIN contraseña por defecto en XAMPP
    database: 'miproyecto'
});

db.getConnection()
    .then(() => console.log('Conectado a la base de datos MySQL'))
    .catch(err => console.error('Error de conexión a la BD:', err));

module.exports = db;