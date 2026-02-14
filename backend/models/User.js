/**
 * Classe User - Représente un utilisateur du système
 * @class
 * @description Modèle de données pour un utilisateur avec validation et sérialisation JSON
 */
class User {
    /** @type {number} Identifiant unique */
    id;
    /** @type {string} Nom complet de l'utilisateur */
    name;
    /** @type {string} Adresse email */
    email;
    /** @type {Date} Date de création de l'utilisateur */
    createdAt;

    /**
     * Crée une instance d'utilisateur
     * @constructor
     * @param {number} id - Identifiant unique de l'utilisateur
     * @param {string} name - Nom complet de l'utilisateur (min 2 caractères)
     * @param {string} email - Adresse email valide de l'utilisateur
     * @throws {Error} Si les paramètres sont invalides lors de la validation
     */
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }

    /**
     * Valide les données de l'utilisateur selon les règles métier
     * @returns {boolean} true si toutes les validations passent, false sinon
     * @description Vérifie que le nom n'est pas vide et que l'email contient un @
     */
    validate() {
        if (!this.name || this.name.length === 0) {
            return false;
        }
        if (!this.email || !this.email.includes('@')) {
            return false;
        }
        return true;
    }

    /**
     * Sérialise l'utilisateur en objet JSON
     * @returns {{id: number, name: string, email: string, createdAt: Date}} Objet JSON représentant l'utilisateur
     * @description Utilisé pour les réponses API et la persistance
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt
        };
    }
}

module.exports = User;
