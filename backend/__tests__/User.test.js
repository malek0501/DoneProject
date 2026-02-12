/**
 * Tests unitaires pour le modèle User
 * @module __tests__/User.test
 */

const User = require('../models/User');

describe('User Model', () => {
    describe('Constructor', () => {
        test('devrait créer un utilisateur avec toutes les propriétés', () => {
            const user = new User(1, 'John Doe', 'john@example.com');
            
            expect(user.id).toBe(1);
            expect(user.name).toBe('John Doe');
            expect(user.email).toBe('john@example.com');
            expect(user.createdAt).toBeInstanceOf(Date);
        });

        test('devrait créer un utilisateur avec une date de création automatique', () => {
            const beforeCreate = new Date();
            const user = new User(1, 'Test User', 'test@example.com');
            const afterCreate = new Date();
            
            expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
            expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
        });
    });

    describe('validate()', () => {
        test('devrait retourner true pour un utilisateur valide', () => {
            const user = new User(1, 'John Doe', 'john@example.com');
            expect(user.validate()).toBe(true);
        });

        test('devrait retourner false si le nom est vide', () => {
            const user = new User(1, '', 'john@example.com');
            expect(user.validate()).toBe(false);
        });

        test('devrait retourner false si le nom est null', () => {
            const user = new User(1, null, 'john@example.com');
            expect(user.validate()).toBe(false);
        });

        test('devrait retourner false si le nom est undefined', () => {
            const user = new User(1, undefined, 'john@example.com');
            expect(user.validate()).toBe(false);
        });

        test('devrait retourner false si l\'email ne contient pas de @', () => {
            const user = new User(1, 'John Doe', 'johnexample.com');
            expect(user.validate()).toBe(false);
        });

        test('devrait retourner false si l\'email est vide', () => {
            const user = new User(1, 'John Doe', '');
            expect(user.validate()).toBe(false);
        });

        test('devrait retourner false si l\'email est null', () => {
            const user = new User(1, 'John Doe', null);
            expect(user.validate()).toBe(false);
        });

        test('devrait retourner false si l\'email est undefined', () => {
            const user = new User(1, 'John Doe', undefined);
            expect(user.validate()).toBe(false);
        });

        test('devrait accepter un nom avec espaces', () => {
            const user = new User(1, 'John Michael Doe', 'john@example.com');
            expect(user.validate()).toBe(true);
        });

        test('devrait accepter un nom avec caractères spéciaux', () => {
            const user = new User(1, 'Jean-François', 'jean@example.com');
            expect(user.validate()).toBe(true);
        });

        test('devrait accepter un email complexe', () => {
            const user = new User(1, 'John Doe', 'john.doe+test@example.co.uk');
            expect(user.validate()).toBe(true);
        });
    });

    describe('toJSON()', () => {
        test('devrait retourner un objet avec toutes les propriétés', () => {
            const user = new User(1, 'John Doe', 'john@example.com');
            const json = user.toJSON();
            
            expect(json).toHaveProperty('id', 1);
            expect(json).toHaveProperty('name', 'John Doe');
            expect(json).toHaveProperty('email', 'john@example.com');
            expect(json).toHaveProperty('createdAt');
        });

        test('devrait retourner un objet sérialisable en JSON', () => {
            const user = new User(1, 'John Doe', 'john@example.com');
            const json = user.toJSON();
            
            expect(() => JSON.stringify(json)).not.toThrow();
        });

        test('devrait préserver les valeurs exactes', () => {
            const id = 42;
            const name = 'Test User';
            const email = 'test@test.com';
            const user = new User(id, name, email);
            const json = user.toJSON();
            
            expect(json.id).toBe(id);
            expect(json.name).toBe(name);
            expect(json.email).toBe(email);
        });

        test('devrait inclure la date de création', () => {
            const user = new User(1, 'John Doe', 'john@example.com');
            const json = user.toJSON();
            
            expect(json.createdAt).toBeInstanceOf(Date);
            expect(json.createdAt).toEqual(user.createdAt);
        });
    });

    describe('Immutabilité des propriétés', () => {
        test('devrait permettre la modification des propriétés', () => {
            const user = new User(1, 'John Doe', 'john@example.com');
            
            user.name = 'Jane Doe';
            user.email = 'jane@example.com';
            
            expect(user.name).toBe('Jane Doe');
            expect(user.email).toBe('jane@example.com');
        });
    });

    describe('Cas limites', () => {
        test('devrait gérer un ID de 0', () => {
            const user = new User(0, 'Test', 'test@example.com');
            expect(user.id).toBe(0);
            expect(user.validate()).toBe(true);
        });

        test('devrait gérer un ID négatif', () => {
            const user = new User(-1, 'Test', 'test@example.com');
            expect(user.id).toBe(-1);
            expect(user.validate()).toBe(true);
        });

        test('devrait gérer un nom très long', () => {
            const longName = 'A'.repeat(200);
            const user = new User(1, longName, 'test@example.com');
            expect(user.name).toBe(longName);
            expect(user.validate()).toBe(true);
        });

        test('devrait gérer un nom d\'un caractère', () => {
            const user = new User(1, 'A', 'test@example.com');
            expect(user.validate()).toBe(true);
        });
    });
});
