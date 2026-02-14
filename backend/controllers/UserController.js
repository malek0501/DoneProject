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
        res.json(this.users.map(user => user.toJSON()));
    }

    /**
     * Récupère un utilisateur par son ID
     * @param {Object} req 
     * @param {Object} res 
     */
    getUserById(req, res) {
        const user = this.users.find(u => u.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        res.json(user.toJSON());
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
            return res.status(400).json({ error: 'Données invalides' });
        }
        
        this.users.push(user);
        res.status(201).json(user.toJSON());
    }

    /**
     * Met à jour un utilisateur (avec validation Joi via middleware)
     * @param {Object} req - Requête Express (body validé par userUpdateSchema)
     * @param {Object} res - Réponse Express
     */
    updateUser(req, res) {
        const user = this.users.find(u => u.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        const { name, email } = req.body;
        
        // Vérifier l'unicité de l'email si modifié
        if (email && email !== user.email) {
            const emailExists = this.users.find(u => u.email === email && u.id !== user.id);
            if (emailExists) {
                return res.status(409).json({ error: 'Cet email est déjà utilisé par un autre utilisateur' });
            }
        }
        
        if (name) user.name = name;
        if (email) user.email = email;
        
        // Validation post-mise à jour pour garantir l'intégrité des données
        if (!user.validate()) {
            return res.status(400).json({ error: 'Données invalides après mise à jour' });
        }
        
        res.json(user.toJSON());
    }

    /**
     * Supprime un utilisateur
     * @param {Object} req 
     * @param {Object} res 
     */
    deleteUser(req, res) {
        const index = this.users.findIndex(u => u.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        this.users.splice(index, 1);
        res.status(204).send();
    }
}

module.exports = UserController;
