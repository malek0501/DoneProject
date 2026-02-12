const Task = require('../models/Task');

/**
 * Contrôleur pour gérer les opérations sur les tâches
 */
class TaskController {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    /**
     * Récupère toutes les tâches
     * @param {Object} req 
     * @param {Object} res 
     */
    getAllTasks(req, res) {
        const userId = req.query.userId;
        let filteredTasks = this.tasks;
        
        if (userId) {
            filteredTasks = this.tasks.filter(task => task.userId === parseInt(userId));
        }
        
        res.json({ success: true, data: filteredTasks.map(task => task.toJSON()) });
    }

    /**
     * Récupère les tâches filtrées par statut
     * @param {Object} req 
     * @param {Object} res 
     */
    getFilteredTasks(req, res) {
        const { status, userId } = req.query;
        let filtered = this.tasks;

        if (status) {
            filtered = filtered.filter(task => task.status === status);
        }
        if (userId) {
            filtered = filtered.filter(task => task.userId === parseInt(userId));
        }

        res.json({ success: true, data: filtered.map(task => task.toJSON()), count: filtered.length });
    }

    /**
     * Récupère une tâche par son ID
     * @param {Object} req 
     * @param {Object} res 
     */
    getTaskById(req, res) {
        const task = this.tasks.find(t => t.id === parseInt(req.params.id));
        
        if (!task) {
            return res.status(404).json({ success: false, error: 'Tâche non trouvée' });
        }
        
        res.json({ success: true, data: task.toJSON() });
    }

    /**
     * Crée une nouvelle tâche
     * @param {Object} req 
     * @param {Object} res 
     */
    createTask(req, res) {
        const { title, description, userId, status } = req.body;
        
        const task = new Task(this.nextId++, title, description, userId, status);
        
        if (!task.validate()) {
            return res.status(400).json({ success: false, error: 'Données invalides' });
        }
        
        this.tasks.push(task);
        res.status(201).json({ success: true, data: task.toJSON() });
    }

    /**
     * Met à jour une tâche
     * @param {Object} req 
     * @param {Object} res 
     */
    updateTask(req, res) {
        const task = this.tasks.find(t => t.id === parseInt(req.params.id));
        
        if (!task) {
            return res.status(404).json({ success: false, error: 'Tâche non trouvée' });
        }
        
        const { title, description, status } = req.body;
        
        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.updateStatus(status);
        
        res.json({ success: true, data: task.toJSON() });
    }

    /**
     * Supprime une tâche
     * @param {Object} req 
     * @param {Object} res 
     */
    deleteTask(req, res) {
        const index = this.tasks.findIndex(t => t.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Tâche non trouvée' });
        }
        
        this.tasks.splice(index, 1);
        res.json({ success: true, message: 'Tâche supprimée' });
    }
}

module.exports = TaskController;
