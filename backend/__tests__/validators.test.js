/**
 * Tests unitaires pour les validateurs Joi et le middleware validate
 * @module __tests__/validators.test
 */

const { userSchema, userUpdateSchema, validate } = require('../validators');

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
            // Le schema Joi rejette les champs inconnus par défaut
            // Mais le middleware validate() utilise stripUnknown: true pour les supprimer silencieusement
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
            // stripUnknown est activé dans le middleware
        });

        test('devrait retourner toutes les erreurs (abortEarly: false)', () => {
            const middleware = validate(userSchema);
            const req = mockReq({ name: 'A', email: 'invalid' }); // nom trop court + email invalide
            const res = mockRes();
            const next = mockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            const response = res.json.mock.calls[0][0];
            expect(response.errors.length).toBe(2);
        });
    });
});
