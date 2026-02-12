/**
 * Classe User - Représente un utilisateur du système
 */
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }

    /**
     * Valide les données de l'utilisateur
     * @returns {boolean}
     */
    validate() {
        return this.name && this.name.length > 0 && 
               this.email && this.email.includes('@');
    }

    /**
     * Retourne une représentation JSON de l'utilisateur
     * @returns {Object}
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
