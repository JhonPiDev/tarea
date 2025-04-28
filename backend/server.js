const express = require('express');
const cors = require('cors');
const prom = require('prom-client'); // Importa prom-client para métricas
const httpProxy = require('http-proxy'); // Añade http-proxy para Netdata
const basicAuth = require('express-basic-auth'); // Añade express-basic-auth para autenticación
const app = express();
const initDb = require('./db_sqlite');

// Crear un proxy para redirigir a Netdata
const proxy = httpProxy.createProxyServer({});

// Habilita la recolección de métricas predeterminadas (CPU, memoria, etc.)
const collectDefaultMetrics = prom.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Crea un contador personalizado para solicitudes HTTP
const httpRequestCounter = new prom.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

// Middleware para contar solicitudes
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.path,
            status: res.statusCode
        });
    });
    next();
});

// Endpoint para métricas de Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prom.register.contentType);
    res.end(await prom.register.metrics());
});

// Añadir proxy para Netdata con autenticación básica
app.use('/netdata', basicAuth({
    users: { 'admin': 'tu-contraseña-secreta' }, // Cambia 'tu-contraseña-secreta'
    challenge: true
}), (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:19999' });
});

// Manejar errores del proxy
proxy.on('error', (err, req, res) => {
    res.status(500).send('Error al conectar con Netdata');
});

// Configuración de CORS y JSON
app.use(cors({
    origin: "https://front-rkxq.onrender.com" // Asegúrate de que esta URL sea correcta
}));
app.use(express.json());

// Inicializa la base de datos y configura las rutas
initDb.then(db => {
    app.set('db', db);
    console.log('Conectado a SQLite');

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/admin', require('./routes/admin'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al conectar a SQLite:', err);
});