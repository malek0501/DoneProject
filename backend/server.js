const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Gestionnaire de Tâches',
        endpoints: {
            tasks: '/api/tasks',
            users: '/api/users'
        }
    });
});

// Gestion des erreurs 404
app.use(notFound);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur (pas en mode test)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
        console.log(`📍 API disponible sur http://localhost:${PORT}`);
    });
}

module.exports = app;
