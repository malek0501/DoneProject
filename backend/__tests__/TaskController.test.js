/**
 * Tests unitaires pour TaskController
 * @module __tests__/TaskController.test
 */

const TaskController = require('../controllers/TaskController');

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

describe('TaskController', () => {
    let controller;

    beforeEach(() => {
        controller = new TaskController();
    });

    describe('Constructor', () => {
        test('devrait initialiser avec une liste de tâches vide', () => {
            expect(controller.tasks).toHaveLength(0);
        });

        test('devrait initialiser nextId à 1', () => {
            expect(controller.nextId).toBe(1);
        });
    });

    describe('getAllTasks()', () => {
        test('devrait retourner un tableau vide au départ', () => {
            const req = mockReq();
            const res = mockRes();

            controller.getAllTasks(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });

        test('devrait retourner toutes les tâches créées', () => {
            // Créer 2 tâches
            controller.createTask(
                mockReq({}, { title: 'Tâche 1', description: 'Desc 1', userId: 1 }),
                mockRes()
            );
            controller.createTask(
                mockReq({}, { title: 'Tâche 2', description: 'Desc 2', userId: 1 }),
                mockRes()
            );

            const req = mockReq();
            const res = mockRes();
            controller.getAllTasks(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result).toHaveLength(2);
        });

        test('devrait filtrer les tâches par userId', () => {
            controller.createTask(
                mockReq({}, { title: 'Tâche User 1', description: 'Desc', userId: 1 }),
                mockRes()
            );
            controller.createTask(
                mockReq({}, { title: 'Tâche User 2', description: 'Desc', userId: 2 }),
                mockRes()
            );
            controller.createTask(
                mockReq({}, { title: 'Autre Tâche User 1', description: 'Desc', userId: 1 }),
                mockRes()
            );

            const req = mockReq({}, {}, { userId: '1' });
            const res = mockRes();
            controller.getAllTasks(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result).toHaveLength(2);
            result.forEach(task => {
                expect(task.userId).toBe(1);
            });
        });

        test('devrait retourner un tableau vide si aucun userId ne correspond', () => {
            controller.createTask(
                mockReq({}, { title: 'Tâche', description: 'Desc', userId: 1 }),
                mockRes()
            );

            const req = mockReq({}, {}, { userId: '999' });
            const res = mockRes();
            controller.getAllTasks(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });

        test('devrait retourner toutes les tâches sans filtre userId', () => {
            controller.createTask(
                mockReq({}, { title: 'T1', description: 'D1', userId: 1 }),
                mockRes()
            );
            controller.createTask(
                mockReq({}, { title: 'T2', description: 'D2', userId: 2 }),
                mockRes()
            );

            const req = mockReq({}, {}, {}); // pas de userId
            const res = mockRes();
            controller.getAllTasks(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result).toHaveLength(2);
        });
    });

    describe('getTaskById()', () => {
        test('devrait retourner une tâche existante', () => {
            controller.createTask(
                mockReq({}, { title: 'Ma Tâche', description: 'Desc', userId: 1 }),
                mockRes()
            );

            const req = mockReq({ id: '1' });
            const res = mockRes();
            controller.getTaskById(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ id: 1, title: 'Ma Tâche' })
            );
        });

        test('devrait retourner 404 pour un ID inexistant', () => {
            const req = mockReq({ id: '999' });
            const res = mockRes();

            controller.getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Tâche non trouvée' });
        });

        test('devrait retourner 404 pour un ID non numérique', () => {
            const req = mockReq({ id: 'abc' });
            const res = mockRes();

            controller.getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createTask()', () => {
        test('devrait créer une tâche valide avec statut 201', () => {
            const req = mockReq({}, { title: 'Nouvelle Tâche', description: 'Description', userId: 1 });
            const res = mockRes();

            controller.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    title: 'Nouvelle Tâche',
                    description: 'Description',
                    userId: 1,
                    status: 'pending'
                })
            );
        });

        test('devrait retourner 400 pour un titre vide', () => {
            const req = mockReq({}, { title: '', description: 'Desc', userId: 1 });
            const res = mockRes();

            controller.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Données invalides' });
        });

        test('devrait retourner 400 sans userId', () => {
            const req = mockReq({}, { title: 'Tâche', description: 'Desc' });
            const res = mockRes();

            controller.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('devrait retourner 400 pour un titre null', () => {
            const req = mockReq({}, { title: null, description: 'Desc', userId: 1 });
            const res = mockRes();

            controller.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('devrait incrémenter l\'ID automatiquement', () => {
            controller.createTask(
                mockReq({}, { title: 'T1', description: 'D1', userId: 1 }),
                mockRes()
            );

            const req = mockReq({}, { title: 'T2', description: 'D2', userId: 1 });
            const res = mockRes();
            controller.createTask(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.id).toBe(2);
        });

        test('devrait ajouter la tâche à la liste interne', () => {
            const req = mockReq({}, { title: 'Tâche', description: 'Desc', userId: 1 });
            const res = mockRes();

            controller.createTask(req, res);

            expect(controller.tasks).toHaveLength(1);
        });

        test('devrait créer avec le statut "pending" par défaut', () => {
            const req = mockReq({}, { title: 'Tâche', description: 'Desc', userId: 1 });
            const res = mockRes();

            controller.createTask(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.status).toBe('pending');
        });

        test('devrait inclure les dates dans la réponse', () => {
            const req = mockReq({}, { title: 'Tâche', description: 'Desc', userId: 1 });
            const res = mockRes();

            controller.createTask(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
        });
    });

    describe('updateTask()', () => {
        beforeEach(() => {
            controller.createTask(
                mockReq({}, { title: 'Tâche originale', description: 'Desc originale', userId: 1 }),
                mockRes()
            );
        });

        test('devrait mettre à jour le titre', () => {
            const req = mockReq({ id: '1' }, { title: 'Titre mis à jour' });
            const res = mockRes();

            controller.updateTask(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Titre mis à jour' })
            );
        });

        test('devrait mettre à jour la description', () => {
            const req = mockReq({ id: '1' }, { description: 'Nouvelle description' });
            const res = mockRes();

            controller.updateTask(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ description: 'Nouvelle description' })
            );
        });

        test('devrait mettre à jour le statut via updateStatus', () => {
            const req = mockReq({ id: '1' }, { status: 'completed' });
            const res = mockRes();

            controller.updateTask(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'completed' })
            );
        });

        test('devrait mettre à jour tous les champs simultanément', () => {
            const req = mockReq({ id: '1' }, {
                title: 'Nouveau titre',
                description: 'Nouvelle desc',
                status: 'in-progress'
            });
            const res = mockRes();

            controller.updateTask(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.title).toBe('Nouveau titre');
            expect(result.description).toBe('Nouvelle desc');
            expect(result.status).toBe('in-progress');
        });

        test('devrait retourner 404 pour une tâche inexistante', () => {
            const req = mockReq({ id: '999' }, { title: 'Test' });
            const res = mockRes();

            controller.updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Tâche non trouvée' });
        });

        test('ne devrait pas modifier les champs non fournis', () => {
            const req = mockReq({ id: '1' }, { title: 'Nouveau titre' });
            const res = mockRes();

            controller.updateTask(req, res);

            const result = res.json.mock.calls[0][0];
            expect(result.title).toBe('Nouveau titre');
            expect(result.description).toBe('Desc originale'); // inchangé
        });

        test('devrait retourner 404 pour un ID non numérique', () => {
            const req = mockReq({ id: 'abc' }, { title: 'Test' });
            const res = mockRes();

            controller.updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteTask()', () => {
        beforeEach(() => {
            controller.createTask(
                mockReq({}, { title: 'Tâche à supprimer', description: 'Desc', userId: 1 }),
                mockRes()
            );
        });

        test('devrait supprimer une tâche existante avec statut 204', () => {
            const req = mockReq({ id: '1' });
            const res = mockRes();

            controller.deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
            expect(controller.tasks).toHaveLength(0);
        });

        test('devrait retourner 404 pour une tâche inexistante', () => {
            const req = mockReq({ id: '999' });
            const res = mockRes();

            controller.deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Tâche non trouvée' });
        });

        test('devrait retourner 404 pour un ID non numérique', () => {
            const req = mockReq({ id: 'abc' });
            const res = mockRes();

            controller.deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('ne devrait pas affecter les autres tâches lors de la suppression', () => {
            controller.createTask(
                mockReq({}, { title: 'Tâche 2', description: 'Desc', userId: 1 }),
                mockRes()
            );

            expect(controller.tasks).toHaveLength(2);

            const req = mockReq({ id: '1' });
            const res = mockRes();
            controller.deleteTask(req, res);

            expect(controller.tasks).toHaveLength(1);
            expect(controller.tasks[0].title).toBe('Tâche 2');
        });

        test('devrait retourner 404 si suppression double', () => {
            const req = mockReq({ id: '1' });
            const res1 = mockRes();
            const res2 = mockRes();

            controller.deleteTask(req, res1);
            controller.deleteTask(req, res2);

            expect(res1.status).toHaveBeenCalledWith(204);
            expect(res2.status).toHaveBeenCalledWith(404);
        });
    });

    describe('Scénarios d\'intégration', () => {
        test('CRUD complet: créer, lire, mettre à jour, supprimer', () => {
            // Créer
            const createReq = mockReq({}, { title: 'Task CRUD', description: 'Test', userId: 1 });
            const createRes = mockRes();
            controller.createTask(createReq, createRes);
            expect(createRes.status).toHaveBeenCalledWith(201);
            const taskId = createRes.json.mock.calls[0][0].id;

            // Lire
            const getReq = mockReq({ id: String(taskId) });
            const getRes = mockRes();
            controller.getTaskById(getReq, getRes);
            expect(getRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Task CRUD' })
            );

            // Mettre à jour
            const updateReq = mockReq({ id: String(taskId) }, { status: 'completed', title: 'Task Done' });
            const updateRes = mockRes();
            controller.updateTask(updateReq, updateRes);
            expect(updateRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Task Done', status: 'completed' })
            );

            // Supprimer
            const deleteReq = mockReq({ id: String(taskId) });
            const deleteRes = mockRes();
            controller.deleteTask(deleteReq, deleteRes);
            expect(deleteRes.status).toHaveBeenCalledWith(204);

            // Vérifier suppression
            const getAfterDeleteReq = mockReq({ id: String(taskId) });
            const getAfterDeleteRes = mockRes();
            controller.getTaskById(getAfterDeleteReq, getAfterDeleteRes);
            expect(getAfterDeleteRes.status).toHaveBeenCalledWith(404);
        });

        test('devrait filtrer correctement après création de multiples tâches', () => {
            for (let i = 1; i <= 3; i++) {
                controller.createTask(
                    mockReq({}, { title: `Task U1-${i}`, description: 'D', userId: 1 }),
                    mockRes()
                );
            }
            for (let i = 1; i <= 2; i++) {
                controller.createTask(
                    mockReq({}, { title: `Task U2-${i}`, description: 'D', userId: 2 }),
                    mockRes()
                );
            }

            const reqUser1 = mockReq({}, {}, { userId: '1' });
            const resUser1 = mockRes();
            controller.getAllTasks(reqUser1, resUser1);
            expect(resUser1.json.mock.calls[0][0]).toHaveLength(3);

            const reqUser2 = mockReq({}, {}, { userId: '2' });
            const resUser2 = mockRes();
            controller.getAllTasks(reqUser2, resUser2);
            expect(resUser2.json.mock.calls[0][0]).toHaveLength(2);

            const reqAll = mockReq();
            const resAll = mockRes();
            controller.getAllTasks(reqAll, resAll);
            expect(resAll.json.mock.calls[0][0]).toHaveLength(5);
        });
    });
});
