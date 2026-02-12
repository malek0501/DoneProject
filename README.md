# 📋 Gestionnaire de Tâches - Projet Full Stack

Un projet simple et complet avec une architecture backend/frontend claire, incluant des diagrammes et une documentation complète.

## 🏗️ Architecture du Projet

```
DoneProject/
├── backend/                # Serveur API REST
│   ├── models/            # Modèles de données
│   │   ├── User.js        # Classe User
│   │   └── Task.js        # Classe Task
│   ├── controllers/       # Logique métier
│   │   ├── UserController.js
│   │   └── TaskController.js
│   ├── routes/            # Routes API
│   │   ├── users.js
│   │   └── tasks.js
│   ├── server.js          # Point d'entrée du serveur
│   └── package.json
│
├── frontend/              # Interface utilisateur
│   ├── index.html         # Page principale
│   ├── styles.css         # Styles CSS
│   └── app.js             # Logique JavaScript
│
├── DIAGRAMS.md            # Diagrammes du projet
└── README.md              # Ce fichier
```

## 🎯 Fonctionnalités

### Backend (API REST)
- ✅ Gestion des utilisateurs (CRUD)
- ✅ Gestion des tâches (CRUD)
- ✅ Architecture MVC claire
- ✅ Validation des données
- ✅ API RESTful

### Frontend
- ✅ Interface moderne et responsive
- ✅ Création de tâches
- ✅ Filtrage par statut (En attente, En cours, Terminée)
- ✅ Changement de statut des tâches
- ✅ Suppression de tâches
- ✅ Messages de feedback utilisateur

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- npm

### 1. Installation du Backend

```bash
cd backend
npm install
```

### 2. Démarrage du Serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 3. Démarrage du Frontend

Ouvrez simplement le fichier `frontend/index.html` dans votre navigateur web, ou utilisez un serveur local:

```bash
cd frontend
# Avec Python 3
python3 -m http.server 8080

# Avec Node.js (http-server)
npx http-server -p 8080
```

Le frontend sera accessible sur `http://localhost:8080`

## 📡 Endpoints API

### Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users` | Récupérer tous les utilisateurs |
| GET | `/api/users/:id` | Récupérer un utilisateur |
| POST | `/api/users` | Créer un utilisateur |
| PUT | `/api/users/:id` | Modifier un utilisateur |
| DELETE | `/api/users/:id` | Supprimer un utilisateur |

### Tâches

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/tasks` | Récupérer toutes les tâches |
| GET | `/api/tasks?userId=1` | Récupérer les tâches d'un utilisateur |
| GET | `/api/tasks/:id` | Récupérer une tâche |
| POST | `/api/tasks` | Créer une tâche |
| PUT | `/api/tasks/:id` | Modifier une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |

## 📊 Exemples de Requêtes

### Créer une tâche

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ma première tâche",
    "description": "Description de la tâche",
    "userId": 1,
    "status": "pending"
  }'
```

### Récupérer toutes les tâches

```bash
curl http://localhost:3000/api/tasks
```

### Mettre à jour le statut d'une tâche

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## 🎨 Classes Principales

### Backend

#### User (Modèle)
```javascript
class User {
    - id: number
    - name: string
    - email: string
    - createdAt: Date
    
    + validate(): boolean
    + toJSON(): Object
}
```

#### Task (Modèle)
```javascript
class Task {
    - id: number
    - title: string
    - description: string
    - userId: number
    - status: string (pending/in-progress/completed)
    - createdAt: Date
    - updatedAt: Date
    
    + validate(): boolean
    + updateStatus(newStatus): boolean
    + toJSON(): Object
}
```

#### TaskController
```javascript
class TaskController {
    - tasks: Task[]
    - nextId: number
    
    + getAllTasks(req, res)
    + getTaskById(req, res)
    + createTask(req, res)
    + updateTask(req, res)
    + deleteTask(req, res)
}
```

### Frontend

#### TaskApp (Classe principale)
```javascript
class TaskApp {
    - tasks: Task[]
    - currentFilter: string
    
    + loadTasks(): Promise
    + createTask(): Promise
    + updateTaskStatus(taskId, status): Promise
    + deleteTask(taskId): Promise
    + renderTasks(): void
}
```

## 📈 Diagrammes

Consultez le fichier [DIAGRAMS.md](DIAGRAMS.md) pour voir:
- Diagramme d'architecture
- Diagramme de classes
- Diagramme de séquence
- Flux de données
- Structure MVC

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **CORS** - Gestion des CORS
- **Body-parser** - Parsing des requêtes

### Frontend
- **HTML5** - Structure
- **CSS3** - Styles et design
- **JavaScript (Vanilla)** - Logique applicative
- **Fetch API** - Requêtes HTTP

## 🔧 Configuration

### Port du serveur
Par défaut, le serveur écoute sur le port `3000`. Pour changer:

```javascript
// Dans backend/server.js
const PORT = process.env.PORT || 3000;
```

### URL de l'API (Frontend)
Si vous changez le port du backend, mettez à jour:

```javascript
// Dans frontend/app.js
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📝 Statuts des Tâches

- **pending** (En attente) - Tâche créée mais non commencée
- **in-progress** (En cours) - Tâche en cours de réalisation
- **completed** (Terminée) - Tâche achevée

## 🎯 Améliorations Possibles

- [ ] Ajouter une base de données (MongoDB, PostgreSQL)
- [ ] Implémenter l'authentification JWT
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Implémenter la pagination
- [ ] Ajouter des catégories de tâches
- [ ] Implémenter des notifications
- [ ] Ajouter la possibilité de définir des dates limites
- [ ] Mode hors ligne avec Service Workers

## 👨‍💻 Développement

### Mode développement (Backend)

```bash
cd backend
npm run dev  # Utilise nodemon pour le rechargement automatique
```

## 📄 Licence

Ce projet est open source et disponible sous licence ISC.

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue.

---

**Créé avec ❤️ - 2026**
