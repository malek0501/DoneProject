const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`📦 MongoDB connecté: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('📦 MongoDB déconnecté');
    } catch (error) {
        console.error(`❌ Erreur de déconnexion MongoDB: ${error.message}`);
    }
};

module.exports = { connectDB, disconnectDB };
