const request = require('supertest');
const app = require('../server');

// Note: L'utilisateur par défaut (John Doe, id=1) est pré-créé par UserController

describe('API Tests - Users', () => {
    describe('GET /api/users', () => {
        it('devrait retourner la liste des utilisateurs avec le user par défaut', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('POST /api/users', () => {
        it('devrait créer un utilisateur valide', async () => {
            const userData = {
                name: 'Jean Dupont',
                email: 'jean.dupont@example.com'
            };

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.name).toBe(userData.name);
            expect(response.body.data.email).toBe(userData.email);
        });

        it('devrait rejeter un utilisateur sans nom', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ email: 'jean@example.com' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Erreur de validation');
            expect(response.body.errors).toBeDefined();
        });

        it('devrait rejeter un email invalide', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ name: 'Jean Dupont', email: 'email-invalide' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors.some(e => e.field === 'email')).toBe(true);
        });

        it('devrait rejeter un nom trop court (< 2 caractères)', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ name: 'J', email: 'jean@example.com' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('devrait rejeter un body vide', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('GET /api/users/:id', () => {
        it('devrait retourner utilisateur par défaut (id=1)', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(1);
            expect(response.body.data.name).toBe('John Doe');
        });

        it('devrait retourner 404 pour un utilisateur inexistant', async () => {
            const response = await request(app)
                .get('/api/users/99999')
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('devrait mettre à jour utilisateur', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .send({ name: 'John Updated', email: 'john.updated@example.com' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('John Updated');
        });

        it('devrait rejeter mise à jour avec email invalide', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .send({ name: 'John', email: 'pas-un-email' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('devrait supprimer un utilisateur', async () => {
            const createRes = await request(app)
                .post('/api/users')
                .send({ name: 'A Supprimer', email: 'supprimer@example.com' });

            const userId = createRes.body.data.id;

            const response = await request(app)
                .delete('/api/users/' + userId)
                .expect(200);

            expect(response.body.success).toBe(true);

            await request(app)
                .get('/api/users/' + userId)
                .expect(404);
        });
    });
});

describe('API Tests - Tasks', () => {
    describe('POST /api/tasks', () => {
        it('devrait créer une tâche valide', async () => {
            const taskData = {
                title: 'Tâche de test',
                description: 'Description de la tâche',
                userId: 1
            };

            const response = await request(app)
                .post('/api/tasks')
                .send(taskData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.title).toBe(taskData.title);
            expect(response.body.data.status).toBe('En attente');
        });

        it('devrait créer une tâche avec statut En cours', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche en cours', userId: 1, status: 'En cours' })
                .expect(201);

            expect(response.body.data.status).toBe('En cours');
        });

        it('devrait rejeter une tâche sans titre', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ description: 'Desc', userId: 1 })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Erreur de validation');
        });

        it('devrait rejeter un titre trop court', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'AB', userId: 1 })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('devrait rejeter une tâche sans userId', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche sans user' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('devrait rejeter un statut invalide', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche test', userId: 1, status: 'invalide' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/tasks', () => {
        it('devrait retourner la liste des tâches', async () => {
            const response = await request(app)
                .get('/api/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/tasks/:id', () => {
        it('devrait retourner 404 pour tâche inexistante', async () => {
            await request(app)
                .get('/api/tasks/99999')
                .expect(404);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('devrait mettre à jour une tâche', async () => {
            const createRes = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche originale', userId: 1 });

            const taskId = createRes.body.data.id;

            const response = await request(app)
                .put('/api/tasks/' + taskId)
                .send({ title: 'Tâche modifiée', status: 'En cours' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe('Tâche modifiée');
            expect(response.body.data.status).toBe('En cours');
        });

        it('devrait rejeter mise à jour avec body vide', async () => {
            const createRes = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche pour vide', userId: 1 });

            const taskId = createRes.body.data.id;

            const response = await request(app)
                .put('/api/tasks/' + taskId)
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('devrait rejeter statut invalide en mise à jour', async () => {
            const createRes = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche bad status', userId: 1 });

            const taskId = createRes.body.data.id;

            const response = await request(app)
                .put('/api/tasks/' + taskId)
                .send({ status: 'invalide' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('devrait supprimer une tâche', async () => {
            const createRes = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche à supprimer', userId: 1 });

            const taskId = createRes.body.data.id;

            const response = await request(app)
                .delete('/api/tasks/' + taskId)
                .expect(200);

            expect(response.body.success).toBe(true);

            await request(app)
                .get('/api/tasks/' + taskId)
                .expect(404);
        });

        it('devrait retourner 404 pour tâche inexistante', async () => {
            await request(app)
                .delete('/api/tasks/99999')
                .expect(404);
        });
    });
});

describe('Validation Joi', () => {
    it('devrait supprimer les champs inconnus', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ name: 'Test Strip', email: 'strip@example.com', champInconnu: 'val' })
            .expect(201);

        expect(response.body.data).not.toHaveProperty('champInconnu');
    });

    it('devrait retourner toutes les erreurs (abortEarly: false)', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({})
            .expect(400);

        expect(response.body.errors.length).toBe(2);
    });
});

describe('API Tests - getFilteredTasks', () => {
    it('devrait filtrer les tâches par statut', async () => {
        // Créer des tâches avec différents statuts
        await request(app)
            .post('/api/tasks')
            .send({ title: 'Tâche en attente', userId: 1, status: 'En attente' });
        await request(app)
            .post('/api/tasks')
            .send({ title: 'Tâche en cours filtre', userId: 1, status: 'En cours' });

        const response = await request(app)
            .get('/api/tasks/filter?status=En cours')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBeGreaterThanOrEqual(1);
        response.body.data.forEach(task => {
            expect(task.status).toBe('En cours');
        });
    });

    it('devrait retourner un tableau vide si aucun match', async () => {
        // Créer une tâche 'Terminée' d'abord pour vider le filtre ensuite
        const response = await request(app)
            .get('/api/tasks/filter?status=' + encodeURIComponent('Terminée'))
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(0);
    });

    it('devrait retourner toutes les tâches sans filtre', async () => {
        const response = await request(app)
            .get('/api/tasks/filter')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});

describe('Error Handling Middleware', () => {
    it('devrait retourner 404 pour route inexistante', async () => {
        const response = await request(app)
            .get('/api/route-inexistante')
            .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('non trouvée');
    });

    it('devrait retourner JSON pour la route de base', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.body.message).toBe('API Gestionnaire de Tâches');
        expect(response.body.endpoints).toBeDefined();
    });
});
