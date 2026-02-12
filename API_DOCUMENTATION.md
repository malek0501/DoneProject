# Documentation des Endpoints API

## 📋 Vue d'ensemble
API RESTful pour la gestion des utilisateurs et des tâches avec validation Joi et architecture MVC.

## 🔐 Authentification
Non implémentée (à venir)

## 👥 Endpoints Utilisateurs

### GET /api/users
**Description**: Récupère tous les utilisateurs  
**Authentification**: Non requise  
**Paramètres**: Aucun  
**Réponse**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-13T10:00:00.000Z"
  }
]
```
**Codes de statut**:
- `200`: Succès

---

### GET /api/users/:id
**Description**: Récupère un utilisateur spécifique par ID  
**Authentification**: Non requise  
**Paramètres URL**: 
- `id` (number) - ID de l'utilisateur

**Réponse**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-02-13T10:00:00.000Z"
}
```
**Codes de statut**:
- `200`: Succès
- `404`: Utilisateur non trouvé

---

### POST /api/users
**Description**: Crée un nouvel utilisateur  
**Authentification**: Non requise  
**Validation**: userSchema (Joi)  
**Corps de la requête**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```
**Règles de validation**:
- `name`: string, min 2 caractères, max 100 caractères, requis
- `email`: string, format email valide, requis

**Réponse**:
```json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2026-02-13T10:05:00.000Z"
}
```
**Codes de statut**:
- `201`: Utilisateur créé
- `400`: Données invalides

---

### PUT /api/users/:id
**Description**: Met à jour un utilisateur existant  
**Authentification**: Non requise  
**Validation**: userSchema (Joi)  
**Paramètres URL**: 
- `id` (number) - ID de l'utilisateur

**Corps de la requête**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```
**Règles de validation**:
- `name`: string, min 2 caractères, max 100 caractères, optionnel
- `email`: string, format email valide, optionnel

**Réponse**:
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "createdAt": "2026-02-13T10:05:00.000Z"
}
```
**Codes de statut**:
- `200`: Utilisateur mis à jour
- `400`: Données invalides
- `404`: Utilisateur non trouvé

---

### DELETE /api/users/:id
**Description**: Supprime un utilisateur  
**Authentification**: Non requise  
**Paramètres URL**: 
- `id` (number) - ID de l'utilisateur

**Réponse**: Aucune (corps vide)

**Codes de statut**:
- `204`: Utilisateur supprimé
- `404`: Utilisateur non trouvé

---

## 📝 Endpoints Tâches

### GET /api/tasks
**Description**: Récupère toutes les tâches  
**Authentification**: Non requise  
**Paramètres**: Aucun  
**Réponse**:
```json
[
  {
    "id": 1,
    "title": "Tâche 1",
    "description": "Description de la tâche",
    "userId": 1,
    "status": "En attente",
    "createdAt": "2026-02-13T10:00:00.000Z",
    "updatedAt": "2026-02-13T10:00:00.000Z"
  }
]
```
**Codes de statut**:
- `200`: Succès

---

### GET /api/tasks/:id
**Description**: Récupère une tâche spécifique par ID  
**Authentification**: Non requise  
**Paramètres URL**: 
- `id` (number) - ID de la tâche

**Réponse**:
```json
{
  "id": 1,
  "title": "Tâche 1",
  "description": "Description de la tâche",
  "userId": 1,
  "status": "En attente",
  "createdAt": "2026-02-13T10:00:00.000Z",
  "updatedAt": "2026-02-13T10:00:00.000Z"
}
```
**Codes de statut**:
- `200`: Succès
- `404`: Tâche non trouvée

---

### POST /api/tasks
**Description**: Crée une nouvelle tâche  
**Authentification**: Non requise  
**Validation**: taskSchema (Joi)  
**Corps de la requête**:
```json
{
  "title": "Nouvelle tâche",
  "description": "Description détaillée",
  "userId": 1
}
```
**Règles de validation**:
- `title`: string, min 1 caractère, max 200 caractères, requis
- `description`: string, max 1000 caractères, optionnel
- `userId`: number, requis

**Réponse**:
```json
{
  "id": 2,
  "title": "Nouvelle tâche",
  "description": "Description détaillée",
  "userId": 1,
  "status": "En attente",
  "createdAt": "2026-02-13T10:10:00.000Z",
  "updatedAt": "2026-02-13T10:10:00.000Z"
}
```
**Codes de statut**:
- `201`: Tâche créée
- `400`: Données invalides

---

### PUT /api/tasks/:id
**Description**: Met à jour une tâche existante  
**Authentification**: Non requise  
**Validation**: taskUpdateSchema (Joi)  
**Paramètres URL**: 
- `id` (number) - ID de la tâche

**Corps de la requête**:
```json
{
  "title": "Tâche modifiée",
  "description": "Nouvelle description",
  "status": "En cours"
}
```
**Règles de validation**:
- `title`: string, min 1 caractère, max 200 caractères, optionnel
- `description`: string, max 1000 caractères, optionnel
- `status`: enum ['En attente', 'En cours', 'Terminée'], optionnel

**Réponse**:
```json
{
  "id": 2,
  "title": "Tâche modifiée",
  "description": "Nouvelle description",
  "userId": 1,
  "status": "En cours",
  "createdAt": "2026-02-13T10:10:00.000Z",
  "updatedAt": "2026-02-13T10:15:00.000Z"
}
```
**Codes de statut**:
- `200`: Tâche mise à jour
- `400`: Données invalides
- `404`: Tâche non trouvée

---

### DELETE /api/tasks/:id
**Description**: Supprime une tâche  
**Authentification**: Non requise  
**Paramètres URL**: 
- `id` (number) - ID de la tâche

**Réponse**: Aucune (corps vide)

**Codes de statut**:
- `204`: Tâche supprimée
- `404`: Tâche non trouvée

---

## 📊 Résumé des Endpoints

| Méthode | Endpoint | Description | Validation |
|---------|----------|-------------|------------|
| GET | /api/users | Liste tous les utilisateurs | - |
| GET | /api/users/:id | Récupère un utilisateur | - |
| POST | /api/users | Crée un utilisateur | userSchema |
| PUT | /api/users/:id | Met à jour un utilisateur | userSchema |
| DELETE | /api/users/:id | Supprime un utilisateur | - |
| GET | /api/tasks | Liste toutes les tâches | - |
| GET | /api/tasks/:id | Récupère une tâche | - |
| POST | /api/tasks | Crée une tâche | taskSchema |
| PUT | /api/tasks/:id | Met à jour une tâche | taskUpdateSchema |
| DELETE | /api/tasks/:id | Supprime une tâche | - |

## ✅ Critères d'acceptation AC-2

**Tous les endpoints CRUD sont implémentés et documentés**:

### Utilisateurs (User)
- ✅ **CREATE**: POST /api/users - Validation Joi avec userSchema
- ✅ **READ**: GET /api/users (tous) et GET /api/users/:id (un seul)
- ✅ **UPDATE**: PUT /api/users/:id - Validation Joi avec userSchema
- ✅ **DELETE**: DELETE /api/users/:id

### Tâches (Task)
- ✅ **CREATE**: POST /api/tasks - Validation Joi avec taskSchema
- ✅ **READ**: GET /api/tasks (tous) et GET /api/tasks/:id (un seul)
- ✅ **UPDATE**: PUT /api/tasks/:id - Validation Joi avec taskUpdateSchema
- ✅ **DELETE**: DELETE /api/tasks/:id

## 🔍 Tests
Voir [backend/__tests__/User.test.js](../backend/__tests__/User.test.js) pour les tests unitaires du modèle User (22 tests, 100% coverage).

## 📝 Validation
Les schémas de validation Joi sont définis dans:
- [backend/validators/userValidator.js](../backend/validators/userValidator.js)
- [backend/validators/index.js](../backend/validators/index.js)
