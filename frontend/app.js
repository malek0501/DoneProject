/**
 * Configuration de l'API
 */
const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_USER_ID = 1; // ID de l'utilisateur par défaut

/**
 * Classe principale de l'application
 */
class TaskApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.init();
    }

    /**
     * Initialise l'application
     */
    init() {
        this.setupEventListeners();
        this.loadTasks();
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Formulaire de création de tâche
        const form = document.getElementById('createTaskForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        // Boutons de filtrage
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderTasks();
            });
        });
    }

    /**
     * Charge toutes les tâches depuis l'API
     */
    async loadTasks() {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks?userId=${DEFAULT_USER_ID}`);
            if (response.ok) {
                this.tasks = await response.json();
                this.renderTasks();
            } else {
                this.showMessage('Erreur lors du chargement des tâches', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Impossible de se connecter au serveur', 'error');
        }
    }

    /**
     * Crée une nouvelle tâche
     */
    async createTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;

        const taskData = {
            title,
            description,
            userId: DEFAULT_USER_ID,
            status: 'pending'
        };

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                const newTask = await response.json();
                this.tasks.push(newTask);
                this.renderTasks();
                this.showMessage('Tâche créée avec succès!', 'success');
                document.getElementById('createTaskForm').reset();
            } else {
                this.showMessage('Erreur lors de la création de la tâche', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Impossible de créer la tâche', 'error');
        }
    }

    /**
     * Met à jour le statut d'une tâche
     */
    async updateTaskStatus(taskId, newStatus) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                const index = this.tasks.findIndex(t => t.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = updatedTask;
                    this.renderTasks();
                    this.showMessage('Statut mis à jour!', 'success');
                }
            } else {
                this.showMessage('Erreur lors de la mise à jour', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Impossible de mettre à jour la tâche', 'error');
        }
    }

    /**
     * Supprime une tâche
     */
    async deleteTask(taskId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok || response.status === 204) {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.renderTasks();
                this.showMessage('Tâche supprimée!', 'success');
            } else {
                this.showMessage('Erreur lors de la suppression', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Impossible de supprimer la tâche', 'error');
        }
    }

    /**
     * Filtre les tâches selon le filtre actuel
     */
    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.status === this.currentFilter);
    }

    /**
     * Affiche les tâches
     */
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Aucune tâche à afficher</p>';
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => this.createTaskCard(task)).join('');

        // Ajouter les écouteurs d'événements pour les boutons d'action
        filteredTasks.forEach(task => {
            // Bouton de changement de statut
            if (task.status === 'pending') {
                const startBtn = document.getElementById(`start-${task.id}`);
                if (startBtn) {
                    startBtn.addEventListener('click', () => this.updateTaskStatus(task.id, 'in-progress'));
                }
            } else if (task.status === 'in-progress') {
                const completeBtn = document.getElementById(`complete-${task.id}`);
                if (completeBtn) {
                    completeBtn.addEventListener('click', () => this.updateTaskStatus(task.id, 'completed'));
                }
            }

            // Bouton de suppression
            const deleteBtn = document.getElementById(`delete-${task.id}`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            }
        });
    }

    /**
     * Crée le HTML d'une carte de tâche
     */
    createTaskCard(task) {
        const statusClass = `status-${task.status}`;
        const statusText = {
            'pending': 'En attente',
            'in-progress': 'En cours',
            'completed': 'Terminée'
        }[task.status];

        let actionButton = '';
        if (task.status === 'pending') {
            actionButton = `<button id="start-${task.id}" class="btn btn-sm btn-warning">Démarrer</button>`;
        } else if (task.status === 'in-progress') {
            actionButton = `<button id="complete-${task.id}" class="btn btn-sm btn-success">Terminer</button>`;
        }

        return `
            <div class="task-card">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <span class="task-status ${statusClass}">${statusText}</span>
                </div>
                <p class="task-description">${this.escapeHtml(task.description || 'Aucune description')}</p>
                <div class="task-actions">
                    ${actionButton}
                    <button id="delete-${task.id}" class="btn btn-sm btn-danger">Supprimer</button>
                </div>
                <div class="task-meta">
                    Créée le: ${new Date(task.createdAt).toLocaleString('fr-FR')}
                </div>
            </div>
        `;
    }

    /**
     * Échappe les caractères HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Affiche un message à l'utilisateur
     */
    showMessage(message, type) {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

        const main = document.querySelector('main');
        main.insertBefore(messageDiv, main.firstChild);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new TaskApp();
});
