/**
 * Tests unitaires pour les validateurs Joi et le middleware validate
 * @module __tests__/validators.test
 */

const { userSchema, userUpdateSchema, taskSchema, taskUpdateSchema, validate } = require('../validators');

// Helpers pour créer des objets mock req/res/next
const mockReq = (body = {}) => ({ body });

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext = () => jest.fn();

describe('Validators', () => {
    describe('userSchema', () => {
        test('devrait valider un utilisateur avec nom et email valides', () => {
            const { error } = userSchema.validate({ name: 'John Doe', email: 'john@example.com' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter si le nom est absent', () => {
            const { error } = userSchema.validate({ email: 'john@example.com' });
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('name');
        });

        test('devrait rejeter si l\'email est absent', () => {
            const { error } = userSchema.validate({ name: 'John' });
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('email');
        });

        test('devrait rejeter un nom trop court (< 2 caractères)', () => {
            const { error } = userSchema.validate({ name: 'A', email: 'john@example.com' });
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('2');
        });

        test('devrait rejeter un nom trop long (> 100 caractères)', () => {
            const longName = 'A'.repeat(101);
            const { error } = userSchema.validate({ name: longName, email: 'john@example.com' });
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('100');
        });

        test('devrait rejeter un email invalide', () => {
            const { error } = userSchema.validate({ name: 'John', email: 'not-an-email' });
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('email');
        });

        test('devrait accepter un nom de 2 caractères', () => {
            const { error } = userSchema.validate({ name: 'Ab', email: 'test@test.com' });
            expect(error).toBeUndefined();
        });

        test('devrait accepter un nom de 100 caractères', () => {
            const name = 'A'.repeat(100);
            const { error } = userSchema.validate({ name, email: 'test@test.com' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter un nom numérique (non-string)', () => {
            const { error } = userSchema.validate({ name: 123, email: 'test@test.com' });
            expect(error).toBeDefined();
        });

        test('devrait accepter un email avec sous-domaine', () => {
            const { error } = userSchema.validate({ name: 'John', email: 'john@sub.example.com' });
            expect(error).toBeUndefined();
        });

        test('devrait accepter un email avec +', () => {
            const { error } = userSchema.validate({ name: 'John', email: 'john+tag@example.com' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter un body vide', () => {
            const { error } = userSchema.validate({});
            expect(error).toBeDefined();
        });
    });

    describe('userUpdateSchema', () => {
        test('devrait valider avec seulement le nom', () => {
            const { error } = userUpdateSchema.validate({ name: 'Updated Name' });
            expect(error).toBeUndefined();
        });

        test('devrait valider avec seulement l\'email', () => {
            const { error } = userUpdateSchema.validate({ email: 'updated@example.com' });
            expect(error).toBeUndefined();
        });

        test('devrait valider avec nom et email', () => {
            const { error } = userUpdateSchema.validate({ name: 'Updated', email: 'new@test.com' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter un body vide (min 1 champ requis)', () => {
            const { error } = userUpdateSchema.validate({});
            expect(error).toBeDefined();
        });

        test('devrait rejeter un nom trop court', () => {
            const { error } = userUpdateSchema.validate({ name: 'A' });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un nom trop long', () => {
            const { error } = userUpdateSchema.validate({ name: 'A'.repeat(101) });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un email invalide', () => {
            const { error } = userUpdateSchema.validate({ email: 'invalid' });
            expect(error).toBeDefined();
        });

        test('devrait accepter un nom de 2 caractères', () => {
            const { error } = userUpdateSchema.validate({ name: 'Ab' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter les champs inconnus par défaut (le middleware utilise stripUnknown)', () => {
            const { error } = userUpdateSchema.validate({ name: 'Test', unknownField: 'value' });
            expect(error).toBeDefined();
            expect(error.details[0].message).toContain('unknownField');
        });
    });

    describe('validate() middleware', () => {
        test('devrait appeler next() pour des données valides', () => {
            const middleware = validate(userSchema);
            const req = mockReq({ name: 'John Doe', email: 'john@example.com' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('devrait retourner 400 pour des données invalides', () => {
            const middleware = validate(userSchema);
            const req = mockReq({ name: '', email: '' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        test('devrait retourner les détails des erreurs', () => {
            const middleware = validate(userSchema);
            const req = mockReq({});
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            const response = res.json.mock.calls[0][0];
            expect(response).toHaveProperty('success', false);
            expect(response).toHaveProperty('errors');
            expect(response.errors).toBeInstanceOf(Array);
            expect(response.errors.length).toBeGreaterThan(0);
        });

        test('devrait retourner les champs en erreur', () => {
            const middleware = validate(userSchema);
            const req = mockReq({});
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            const response = res.json.mock.calls[0][0];
            const fields = response.errors.map(e => e.field);
            expect(fields).toContain('name');
            expect(fields).toContain('email');
        });

        test('devrait retourner les messages d\'erreur', () => {
            const middleware = validate(userSchema);
            const req = mockReq({});
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            const response = res.json.mock.calls[0][0];
            response.errors.forEach(err => {
                expect(err).toHaveProperty('field');
                expect(err).toHaveProperty('message');
                expect(typeof err.message).toBe('string');
            });
        });

        test('devrait fonctionner avec userUpdateSchema', () => {
            const middleware = validate(userUpdateSchema);
            const req = mockReq({ name: 'Valid Name' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('devrait rejeter un body vide avec userUpdateSchema', () => {
            const middleware = validate(userUpdateSchema);
            const req = mockReq({});
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });

        test('devrait supprimer les champs inconnus (stripUnknown)', () => {
            const middleware = validate(userSchema);
            const req = mockReq({ name: 'John', email: 'john@test.com', hack: 'malicious' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('devrait retourner toutes les erreurs (abortEarly: false)', () => {
            const middleware = validate(userSchema);
            const req = mockReq({ name: 'A', email: 'invalid' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            const response = res.json.mock.calls[0][0];
            expect(response.errors.length).toBe(2);
        });
    });

    describe('taskSchema', () => {
        test('devrait valider une tâche complète valide', () => {
            const { error } = taskSchema.validate({ title: 'Ma tâche', description: 'Desc', userId: 1 });
            expect(error).toBeUndefined();
        });

        test('devrait valider une tâche avec statut explicite', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', description: 'Desc', userId: 1, status: 'in-progress' });
            expect(error).toBeUndefined();
        });

        test('devrait valider une tâche sans description', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1 });
            expect(error).toBeUndefined();
        });

        test('devrait valider une tâche avec description vide', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', description: '', userId: 1 });
            expect(error).toBeUndefined();
        });

        test('devrait valider une tâche avec description null', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', description: null, userId: 1 });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter si le titre est absent', () => {
            const { error } = taskSchema.validate({ description: 'Desc', userId: 1 });
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('title');
        });

        test('devrait rejeter un titre vide', () => {
            const { error } = taskSchema.validate({ title: '', userId: 1 });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un titre trop long (> 200 chars)', () => {
            const { error } = taskSchema.validate({ title: 'A'.repeat(201), userId: 1 });
            expect(error).toBeDefined();
        });

        test('devrait accepter un titre de 200 caractères', () => {
            const { error } = taskSchema.validate({ title: 'A'.repeat(200), userId: 1 });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter si userId est absent', () => {
            const { error } = taskSchema.validate({ title: 'Tâche' });
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain('userId');
        });

        test('devrait rejeter un userId de 0', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 0 });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un userId négatif', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: -1 });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un userId non-entier', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1.5 });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un userId string', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 'abc' });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un statut invalide', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1, status: 'invalid' });
            expect(error).toBeDefined();
        });

        test('devrait accepter le statut "pending"', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1, status: 'pending' });
            expect(error).toBeUndefined();
        });

        test('devrait accepter le statut "in-progress"', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1, status: 'in-progress' });
            expect(error).toBeUndefined();
        });

        test('devrait accepter le statut "completed"', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1, status: 'completed' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter une description trop longue (> 1000 chars)', () => {
            const { error } = taskSchema.validate({ title: 'Tâche', userId: 1, description: 'A'.repeat(1001) });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un body vide', () => {
            const { error } = taskSchema.validate({});
            expect(error).toBeDefined();
        });
    });

    describe('taskUpdateSchema', () => {
        test('devrait valider avec seulement le titre', () => {
            const { error } = taskUpdateSchema.validate({ title: 'Nouveau titre' });
            expect(error).toBeUndefined();
        });

        test('devrait valider avec seulement la description', () => {
            const { error } = taskUpdateSchema.validate({ description: 'Nouvelle desc' });
            expect(error).toBeUndefined();
        });

        test('devrait valider avec seulement le statut', () => {
            const { error } = taskUpdateSchema.validate({ status: 'completed' });
            expect(error).toBeUndefined();
        });

        test('devrait valider avec tous les champs', () => {
            const { error } = taskUpdateSchema.validate({ title: 'T', description: 'D', status: 'in-progress' });
            expect(error).toBeUndefined();
        });

        test('devrait rejeter un body vide (min 1 champ requis)', () => {
            const { error } = taskUpdateSchema.validate({});
            expect(error).toBeDefined();
        });

        test('devrait rejeter un titre vide', () => {
            const { error } = taskUpdateSchema.validate({ title: '' });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un titre trop long', () => {
            const { error } = taskUpdateSchema.validate({ title: 'A'.repeat(201) });
            expect(error).toBeDefined();
        });

        test('devrait rejeter un statut invalide', () => {
            const { error } = taskUpdateSchema.validate({ status: 'unknown' });
            expect(error).toBeDefined();
        });

        test('devrait rejeter une description trop longue', () => {
            const { error } = taskUpdateSchema.validate({ description: 'A'.repeat(1001) });
            expect(error).toBeDefined();
        });

        test('devrait accepter une description vide', () => {
            const { error } = taskUpdateSchema.validate({ description: '' });
            expect(error).toBeUndefined();
        });
    });

    describe('validate() middleware avec taskSchema', () => {
        test('devrait appeler next() pour une tâche valide', () => {
            const middleware = validate(taskSchema);
            const req = mockReq({ title: 'Tâche', description: 'Desc', userId: 1 });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('devrait retourner 400 pour une tâche sans titre ni userId', () => {
            const middleware = validate(taskSchema);
            const req = mockReq({});
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
            const response = res.json.mock.calls[0][0];
            expect(response.success).toBe(false);
            const fields = response.errors.map(e => e.field);
            expect(fields).toContain('title');
            expect(fields).toContain('userId');
        });

        test('devrait retourner 400 pour un statut invalide', () => {
            const middleware = validate(taskSchema);
            const req = mockReq({ title: 'T', userId: 1, status: 'bad' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('devrait fonctionner avec taskUpdateSchema valide', () => {
            const middleware = validate(taskUpdateSchema);
            const req = mockReq({ status: 'completed' });
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('devrait rejeter un body vide avec taskUpdateSchema', () => {
            const middleware = validate(taskUpdateSchema);
            const req = mockReq({});
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).not.toHaveBeenCalled();
        });
    });
});
