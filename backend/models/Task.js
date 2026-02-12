/**
 * Classe Task - Représente une tâche
 */
class Task {
    constructor(id, title, description, userId, status = 'En attente') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.status = status; // En attente, En cours, Terminée
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    /**
     * Valide les données de la tâche
     * @returns {boolean}
     */
    validate() {
        return this.title && this.title.length > 0 && 
               this.userId && 
               ['En attente', 'En cours', 'Terminée'].includes(this.status);
    }

    /**
     * Met à jour le statut de la tâche
     * @param {string} newStatus
     */
    updateStatus(newStatus) {
        if (['En attente', 'En cours', 'Terminée'].includes(newStatus)) {
            this.status = newStatus;
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * Retourne une représentation JSON de la tâche
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            userId: this.userId,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Task;
