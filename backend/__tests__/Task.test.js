/**
 * Tests unitaires pour le modèle Task
 * @module __tests__/Task.test
 */

const Task = require('../models/Task');

describe('Task Model', () => {
    describe('Constructor', () => {
        test('devrait créer une tâche avec toutes les propriétés', () => {
            const task = new Task(1, 'Ma tâche', 'Description', 10);

            expect(task.id).toBe(1);
            expect(task.title).toBe('Ma tâche');
            expect(task.description).toBe('Description');
            expect(task.userId).toBe(10);
            expect(task.status).toBe('pending');
            expect(task.createdAt).toBeInstanceOf(Date);
            expect(task.updatedAt).toBeInstanceOf(Date);
        });

        test('devrait utiliser le statut par défaut "pending"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            expect(task.status).toBe('pending');
        });

        test('devrait accepter un statut personnalisé', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'in-progress');
            expect(task.status).toBe('in-progress');
        });

        test('devrait accepter le statut "completed"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'completed');
            expect(task.status).toBe('completed');
        });

        test('devrait créer des dates automatiquement', () => {
            const before = new Date();
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const after = new Date();

            expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
            expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(task.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
        });
    });

    describe('validate()', () => {
        test('devrait retourner true pour une tâche valide', () => {
            const task = new Task(1, 'Tâche valide', 'Description', 1);
            expect(task.validate()).toBe(true);
        });

        test('devrait retourner false si le titre est vide', () => {
            const task = new Task(1, '', 'Description', 1);
            expect(task.validate()).toBeFalsy();
        });

        test('devrait retourner false si le titre est null', () => {
            const task = new Task(1, null, 'Description', 1);
            expect(task.validate()).toBeFalsy();
        });

        test('devrait retourner false si le titre est undefined', () => {
            const task = new Task(1, undefined, 'Description', 1);
            expect(task.validate()).toBeFalsy();
        });

        test('devrait retourner false si userId est null', () => {
            const task = new Task(1, 'Tâche', 'Desc', null);
            expect(task.validate()).toBeFalsy();
        });

        test('devrait retourner false si userId est undefined', () => {
            const task = new Task(1, 'Tâche', 'Desc', undefined);
            expect(task.validate()).toBeFalsy();
        });

        test('devrait retourner false si userId est 0 (falsy)', () => {
            const task = new Task(1, 'Tâche', 'Desc', 0);
            expect(task.validate()).toBeFalsy();
        });

        test('devrait retourner false si le statut est invalide', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'invalid-status');
            expect(task.validate()).toBe(false);
        });

        test('devrait retourner true pour le statut "pending"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'pending');
            expect(task.validate()).toBe(true);
        });

        test('devrait retourner true pour le statut "in-progress"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'in-progress');
            expect(task.validate()).toBe(true);
        });

        test('devrait retourner true pour le statut "completed"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'completed');
            expect(task.validate()).toBe(true);
        });

        test('devrait accepter une description vide', () => {
            const task = new Task(1, 'Tâche', '', 1);
            expect(task.validate()).toBe(true);
        });

        test('devrait accepter une description null', () => {
            const task = new Task(1, 'Tâche', null, 1);
            expect(task.validate()).toBe(true);
        });
    });

    describe('updateStatus()', () => {
        test('devrait mettre à jour le statut vers "in-progress"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const result = task.updateStatus('in-progress');

            expect(result).toBe(true);
            expect(task.status).toBe('in-progress');
        });

        test('devrait mettre à jour le statut vers "completed"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const result = task.updateStatus('completed');

            expect(result).toBe(true);
            expect(task.status).toBe('completed');
        });

        test('devrait mettre à jour le statut vers "pending"', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1, 'completed');
            const result = task.updateStatus('pending');

            expect(result).toBe(true);
            expect(task.status).toBe('pending');
        });

        test('devrait refuser un statut invalide', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const result = task.updateStatus('invalid');

            expect(result).toBe(false);
            expect(task.status).toBe('pending');
        });

        test('devrait refuser un statut vide', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const result = task.updateStatus('');

            expect(result).toBe(false);
            expect(task.status).toBe('pending');
        });

        test('devrait refuser un statut null', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const result = task.updateStatus(null);

            expect(result).toBe(false);
            expect(task.status).toBe('pending');
        });

        test('devrait mettre à jour updatedAt lors du changement de statut', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const originalUpdatedAt = task.updatedAt;

            // Petit délai pour s'assurer que les dates diffèrent
            const before = new Date();
            task.updateStatus('completed');

            expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        });

        test('ne devrait pas modifier updatedAt si le statut est invalide', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const originalUpdatedAt = task.updatedAt;

            task.updateStatus('invalid');

            expect(task.updatedAt).toEqual(originalUpdatedAt);
        });
    });

    describe('toJSON()', () => {
        test('devrait retourner un objet avec toutes les propriétés', () => {
            const task = new Task(1, 'Tâche', 'Description', 5, 'in-progress');
            const json = task.toJSON();

            expect(json).toHaveProperty('id', 1);
            expect(json).toHaveProperty('title', 'Tâche');
            expect(json).toHaveProperty('description', 'Description');
            expect(json).toHaveProperty('userId', 5);
            expect(json).toHaveProperty('status', 'in-progress');
            expect(json).toHaveProperty('createdAt');
            expect(json).toHaveProperty('updatedAt');
        });

        test('devrait retourner un objet sérialisable en JSON', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const json = task.toJSON();

            expect(() => JSON.stringify(json)).not.toThrow();
        });

        test('devrait préserver les valeurs exactes', () => {
            const task = new Task(42, 'Test', 'Desc Test', 7, 'completed');
            const json = task.toJSON();

            expect(json.id).toBe(42);
            expect(json.title).toBe('Test');
            expect(json.description).toBe('Desc Test');
            expect(json.userId).toBe(7);
            expect(json.status).toBe('completed');
        });

        test('devrait inclure les dates', () => {
            const task = new Task(1, 'Tâche', 'Desc', 1);
            const json = task.toJSON();

            expect(json.createdAt).toBeInstanceOf(Date);
            expect(json.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('Cas limites', () => {
        test('devrait gérer un titre très long', () => {
            const longTitle = 'A'.repeat(500);
            const task = new Task(1, longTitle, 'Desc', 1);
            expect(task.title).toBe(longTitle);
            expect(task.validate()).toBe(true);
        });

        test('devrait gérer un ID négatif', () => {
            const task = new Task(-1, 'Tâche', 'Desc', 1);
            expect(task.id).toBe(-1);
        });

        test('devrait gérer un userId très grand', () => {
            const task = new Task(1, 'Tâche', 'Desc', 999999);
            expect(task.userId).toBe(999999);
            expect(task.validate()).toBe(true);
        });

        test('devrait gérer des caractères spéciaux dans le titre', () => {
            const task = new Task(1, 'Tâche éàü & <script>', 'Desc', 1);
            expect(task.title).toBe('Tâche éàü & <script>');
            expect(task.validate()).toBe(true);
        });

        test('devrait gérer une description undefined', () => {
            const task = new Task(1, 'Tâche', undefined, 1);
            expect(task.description).toBeUndefined();
        });
    });
});
