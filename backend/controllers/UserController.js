const User = require('../models/User');

/**
 * Contrôleur pour gérer les opérations sur les utilisateurs
 */
class UserController {
    constructor() {
        this.users = [];
        this.nextId = 1;
        
        // Créer un utilisateur par défaut
        const defaultUser = new User(this.nextId++, 'John Doe', 'john@example.com');
        this.users.push(defaultUser);
    }

    /**
     * Récupère tous les utilisateurs
     * @param {Object} req 
     * @param {Object} res 
     */
    getAllUsers(req, res) {
        res.json({ success: true, data: this.users.map(user => user.toJSON()) });
    }

    /**
     * Récupère un utilisateur par son ID
     * @param {Object} req 
     * @param {Object} res 
     */
    getUserById(req, res) {
        const user = this.users.find(u => u.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
        }
        
        res.json({ success: true, data: user.toJSON() });
    }

    /**
     * Crée un nouvel utilisateur
     * @param {Object} req 
     * @param {Object} res 
     */
    createUser(req, res) {
        const { name, email } = req.body;
        
        const user = new User(this.nextId++, name, email);
        
        if (!user.validate()) {
            return res.status(400).json({ success: false, error: 'Données invalides' });
        }
        
        this.users.push(user);
        res.status(201).json({ success: true, data: user.toJSON() });
    }

    /**
     * Met à jour un utilisateur
     * @param {Object} req 
     * @param {Object} res 
     */
    updateUser(req, res) {
        const user = this.users.find(u => u.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
        }
        
        const { name, email } = req.body;
        
        if (name) user.name = name;
        if (email) user.email = email;
        
        res.json({ success: true, data: user.toJSON() });
    }

    /**
     * Supprime un utilisateur
     * @param {Object} req 
     * @param {Object} res 
     */
    deleteUser(req, res) {
        const index = this.users.findIndex(u => u.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
        }
        
        this.users.splice(index, 1);
        res.json({ success: true, message: 'Utilisateur supprimé' });
    }
}

module.exports = UserController;
