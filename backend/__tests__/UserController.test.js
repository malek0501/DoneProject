/**
 * Tests unitaires pour UserController
 * @module __tests__/UserController.test
 */

const UserController = require('../controllers/UserController');

// Helpers pour créer des objets mock req/res
const mockReq = (params = {}, body = {}, query = {}) => ({
    params,
    body,
    query
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController', () => {
    let controller;

    beforeEach(() => {
        controller = new UserController();
    });

    describe('Constructor', () => {
        test('devrait initialiser avec un utilisateur par défaut', () => {
            expect(controller.users).toHaveLength(1);
            expect(controller.users[0].name).toBe('John Doe');
            expect(controller.users[0].email).toBe('john@example.com');
        });

        test('devrait initialiser nextId à 2 après la création de l\'utilisateur par défaut', () => {
            expect(controller.nextId).toBe(2);
        });
    });

    describe('getAllUsers()', () => {
        test('devrait retourner tous les utilisateurs avec statut 200', () => {
            const req = mockReq();
            const res = mockRes();

            controller.getAllUsers(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'John Doe', email: 'john@example.com' })
                ])
            );
        });

        test('devrait retourner un tableau vide après suppression de tous les utilisateurs', () => {
            controller.users = [];
            const req = mockReq();
            const res = mockRes();

            controller.getAllUsers(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });

        test('devrait retourner des objets JSON (pas des instances User)', () => {
            const req = mockReq();
            const res = mockRes();

            controller.getAllUsers(req, res);

            const result = res.json.mock.calls[0][0];
            result.forEach(user => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('email');
                expect(user).toHaveProperty('createdAt');
            });
        });
    });

    describe('getUserById()', () => {
        test('devrait retourner un utilisateur existant', () => {
            const req = mockReq({ id: '1' });
            const res = mockRes();

            controller.getUserById(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1, name: 'John Doe' })
            );
        });

        test('devrait retourner 404 pour un ID inexistant', () => {
            const req = mockReq({ id: '999' });
            const res = mockRes();

            controller.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé' });
        });

        test('devrait retourner 404 pour un ID non numérique', () => {
            const req = mockReq({ id: 'abc' });
            const res = mockRes();

            controller.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('devrait retourner 404 pour un ID négatif', () => {
            const req = mockReq({ id: '-1' });
            const res = mockRes();

            controller.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('devrait parser l\'ID comme un entier', () => {
            const req = mockReq({ id: '1' });
            const res = mockRes();

            controller.getUserById(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.id).toBe(1);
        });
    });

    describe('createUser()', () => {
        test('devrait créer un utilisateur valide avec statut 201', () => {
            const req = mockReq({}, { name: 'Jane Doe', email: 'jane@example.com' });
            const res = mockRes();

            controller.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Jane Doe', email: 'jane@example.com' })
            );
        });

        test('devrait incrémenter l\'ID automatiquement', () => {
            const req = mockReq({}, { name: 'Jane', email: 'jane@example.com' });
            const res = mockRes();

            controller.createUser(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.id).toBe(2);
        });

        test('devrait retourner 400 pour un utilisateur sans nom', () => {
            const req = mockReq({}, { name: '', email: 'test@example.com' });
            const res = mockRes();

            controller.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Données invalides' });
        });

        test('devrait retourner 400 pour un utilisateur sans email valide', () => {
            const req = mockReq({}, { name: 'Test', email: 'invalid-email' });
            const res = mockRes();

            controller.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('devrait retourner 400 pour des données manquantes', () => {
            const req = mockReq({}, {});
            const res = mockRes();

            controller.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('devrait ajouter l\'utilisateur à la liste interne', () => {
            const req = mockReq({}, { name: 'Jane', email: 'jane@example.com' });
            const res = mockRes();

            controller.createUser(req, res);

            expect(controller.users).toHaveLength(2);
        });

        test('devrait inclure createdAt dans la réponse', () => {
            const req = mockReq({}, { name: 'Jane', email: 'jane@example.com' });
            const res = mockRes();

            controller.createUser(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result).toHaveProperty('createdAt');
        });
    });

    describe('updateUser()', () => {
        test('devrait mettre à jour le nom d\'un utilisateur existant', () => {
            const req = mockReq({ id: '1' }, { name: 'John Updated' });
            const res = mockRes();

            controller.updateUser(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1, name: 'John Updated' })
            );
        });

        test('devrait mettre à jour l\'email d\'un utilisateur existant', () => {
            const req = mockReq({ id: '1' }, { email: 'john.updated@example.com' });
            const res = mockRes();

            controller.updateUser(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1, email: 'john.updated@example.com' })
            );
        });

        test('devrait mettre à jour le nom et l\'email simultanément', () => {
            const req = mockReq({ id: '1' }, { name: 'Jane Doe', email: 'jane@example.com' });
            const res = mockRes();

            controller.updateUser(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.name).toBe('Jane Doe');
            expect(result.email).toBe('jane@example.com');
        });

        test('devrait retourner 404 pour un utilisateur inexistant', () => {
            const req = mockReq({ id: '999' }, { name: 'Test' });
            const res = mockRes();

            controller.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé' });
        });

        test('devrait retourner 409 si l\'email est déjà utilisé par un autre utilisateur', () => {
            // Créer un second utilisateur
            const createReq = mockReq({}, { name: 'Jane', email: 'jane@example.com' });
            const createRes = mockRes();
            controller.createUser(createReq, createRes);

            // Tenter de mettre à jour l'email du second vers celui du premier
            const req = mockReq({ id: '2' }, { email: 'john@example.com' });
            const res = mockRes();

            controller.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: expect.stringContaining('email') })
            );
        });

        test('devrait permettre de garder le même email', () => {
            const req = mockReq({ id: '1' }, { email: 'john@example.com' });
            const res = mockRes();

            controller.updateUser(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'john@example.com' })
            );
        });

        test('ne devrait pas modifier les champs non fournis', () => {
            const req = mockReq({ id: '1' }, { name: 'Updated Name' });
            const res = mockRes();

            controller.updateUser(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.name).toBe('Updated Name');
            expect(result.email).toBe('john@example.com'); // inchangé
        });

        test('devrait conserver l\'ID original après mise à jour', () => {
            const req = mockReq({ id: '1' }, { name: 'Updated' });
            const res = mockRes();

            controller.updateUser(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.id).toBe(1);
        });

        test('devrait retourner 404 pour un ID non numérique', () => {
            const req = mockReq({ id: 'abc' }, { name: 'Test' });
            const res = mockRes();

            controller.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteUser()', () => {
        test('devrait supprimer un utilisateur existant avec statut 204', () => {
            const req = mockReq({ id: '1' });
            const res = mockRes();

            controller.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
            expect(controller.users).toHaveLength(0);
        });

        test('devrait retourner 404 pour un utilisateur inexistant', () => {
            const req = mockReq({ id: '999' });
            const res = mockRes();

            controller.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Utilisateur non trouvé' });
        });

        test('devrait retourner 404 pour un ID non numérique', () => {
            const req = mockReq({ id: 'abc' });
            const res = mockRes();

            controller.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('ne devrait pas affecter les autres utilisateurs lors de la suppression', () => {
            // Créer un second utilisateur
            const createReq = mockReq({}, { name: 'Jane', email: 'jane@example.com' });
            const createRes = mockRes();
            controller.createUser(createReq, createRes);

            expect(controller.users).toHaveLength(2);

            // Supprimer le premier
            const req = mockReq({ id: '1' });
            const res = mockRes();
            controller.deleteUser(req, res);

            expect(controller.users).toHaveLength(1);
            expect(controller.users[0].name).toBe('Jane');
        });

        test('devrait retourner 404 si on tente de supprimer deux fois', () => {
            const req = mockReq({ id: '1' });
            const res1 = mockRes();
            const res2 = mockRes();

            controller.deleteUser(req, res1);
            controller.deleteUser(req, res2);

            expect(res1.status).toHaveBeenCalledWith(204);
            expect(res2.status).toHaveBeenCalledWith(404);
        });
    });

    describe('Scénarios d\'intégration', () => {
        test('CRUD complet: créer, lire, mettre à jour, supprimer', () => {
            // Créer
            const createReq = mockReq({}, { name: 'Alice', email: 'alice@example.com' });
            const createRes = mockRes();
            controller.createUser(createReq, createRes);
            expect(createRes.status).toHaveBeenCalledWith(201);
            const userId = createRes.json.mock.calls[0][0].id;

            // Lire
            const getReq = mockReq({ id: String(userId) });
            const getRes = mockRes();
            controller.getUserById(getReq, getRes);
            expect(getRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Alice' })
            );

            // Mettre à jour
            const updateReq = mockReq({ id: String(userId) }, { name: 'Alice Updated' });
            const updateRes = mockRes();
            controller.updateUser(updateReq, updateRes);
            expect(updateRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Alice Updated' })
            );

            // Supprimer
            const deleteReq = mockReq({ id: String(userId) });
            const deleteRes = mockRes();
            controller.deleteUser(deleteReq, deleteRes);
            expect(deleteRes.status).toHaveBeenCalledWith(204);

            // Vérifier suppression
            const getAfterDeleteReq = mockReq({ id: String(userId) });
            const getAfterDeleteRes = mockRes();
            controller.getUserById(getAfterDeleteReq, getAfterDeleteRes);
            expect(getAfterDeleteRes.status).toHaveBeenCalledWith(404);
        });

        test('devrait gérer plusieurs utilisateurs simultanément', () => {
            for (let i = 0; i < 5; i++) {
                const req = mockReq({}, { name: `User ${i}`, email: `user${i}@example.com` });
                const res = mockRes();
                controller.createUser(req, res);
            }

            const getAllReq = mockReq();
            const getAllRes = mockRes();
            controller.getAllUsers(getAllReq, getAllRes);

            const result = getAllRes.json.mock.calls[0][0];
            // 1 par défaut + 5 créés
            expect(result).toHaveLength(6);
        });
    });
});
