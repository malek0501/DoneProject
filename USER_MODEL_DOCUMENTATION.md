# Documentation Technique - Modèle User

## 📋 Vue d'ensemble
Le modèle User représente un utilisateur dans le système de gestion de tâches. Il utilise une approche orientée objet avec validation intégrée et sérialisation JSON.

## 📂 Localisation
**Fichier**: `backend/models/User.js`  
**Namespace**: Models  
**Type**: Classe ES6

## 🏗️ Structure de la classe

### Propriétés

| Propriété | Type | Description | Requis | Validation |
|-----------|------|-------------|--------|------------|
| `id` | `number` | Identifiant unique de l'utilisateur | ✅ Oui | Géré par UserController |
| `name` | `string` | Nom complet de l'utilisateur | ✅ Oui | Min 2 caractères, non vide |
| `email` | `string` | Adresse email de l'utilisateur | ✅ Oui | Doit contenir '@' |
| `createdAt` | `Date` | Date de création de l'utilisateur | ✅ Oui | Auto-générée |

### Méthodes

#### `constructor(id, name, email)`
**Description**: Crée une nouvelle instance d'utilisateur.

**Paramètres**:
- `id` (number): Identifiant unique
- `name` (string): Nom de l'utilisateur
- `email` (string): Adresse email

**Exemple**:
```javascript
const user = new User(1, 'John Doe', 'john@example.com');
```

**Comportement**:
- Initialise toutes les propriétés
- Génère automatiquement `createdAt` avec la date actuelle
- Ne valide PAS automatiquement les données (appeler `validate()`)

---

#### `validate()`
**Description**: Valide les données de l'utilisateur selon les règles métier.

**Retour**: `boolean`
- `true`: Toutes les validations sont passées
- `false`: Au moins une validation a échoué

**Règles de validation**:
1. Le nom ne doit pas être null, undefined ou vide
2. Le nom doit avoir une longueur > 0
3. L'email ne doit pas être null, undefined ou vide
4. L'email doit contenir le caractère '@'

**Exemple**:
```javascript
const user = new User(1, 'John Doe', 'john@example.com');
if (user.validate()) {
    console.log('Utilisateur valide');
} else {
    console.log('Données invalides');
}
```

**Cas d'invalidation**:
```javascript
// ❌ Nom vide
new User(1, '', 'john@example.com').validate() // false

// ❌ Email invalide
new User(1, 'John', 'invalid-email').validate() // false

// ❌ Nom null
new User(1, null, 'john@example.com').validate() // false

// ✅ Données valides
new User(1, 'John Doe', 'john@example.com').validate() // true
```

---

#### `toJSON()`
**Description**: Sérialise l'utilisateur en objet JSON pour les réponses API.

**Retour**: `Object`
```javascript
{
    id: number,
    name: string,
    email: string,
    createdAt: Date
}
```

**Exemple**:
```javascript
const user = new User(1, 'John Doe', 'john@example.com');
const json = user.toJSON();
console.log(json);
// {
//   id: 1,
//   name: 'John Doe',
//   email: 'john@example.com',
//   createdAt: Date('2026-02-13T...')
// }
```

**Utilisation**:
- Réponses API HTTP
- Persistance en base de données (future MongoDB)
- Logs et debugging

---

## 🔐 Validation avec Joi

En plus de la validation interne, le modèle User bénéficie d'une validation Joi via `userValidator.js`.

### Schéma userSchema
```javascript
{
    name: Joi.string()
        .min(2)
        .max(100)
        .required(),
    email: Joi.string()
        .email()
        .required()
}
```

### Schéma userUpdateSchema
```javascript
{
    name: Joi.string()
        .min(2)
        .max(100)
        .optional(),
    email: Joi.string()
        .email()
        .optional()
}
```

**Différence avec validate()**:
- `validate()`: Validation basique côté modèle (nom non vide, email contient @)
- `userSchema`: Validation stricte côté API (longueurs min/max, format email RFC)

---

## 🧪 Tests Unitaires

**Fichier**: `backend/__tests__/User.test.js`  
**Framework**: Jest  
**Couverture**: 100%

### Suite de tests
- ✅ 22 tests passés
- ✅ 100% statements coverage
- ✅ 100% branches coverage
- ✅ 100% functions coverage
- ✅ 100% lines coverage

### Scénarios testés
1. **Constructor**
   - Création avec toutes les propriétés
   - Génération automatique de createdAt

2. **validate()**
   - Utilisateur valide
   - Nom vide, null, undefined
   - Email sans @, vide, null, undefined
   - Nom avec espaces et caractères spéciaux
   - Email complexe

3. **toJSON()**
   - Retour avec toutes les propriétés
   - Sérialisation JSON
   - Préservation des valeurs

4. **Cas limites**
   - ID 0 et négatif
   - Nom très long
   - Nom d'un caractère

---

## 🔄 Cycle de vie

```
1. Création
   POST /api/users → UserController.createUser()
   ↓
   new User(id, name, email)
   ↓
   user.validate() → true/false
   ↓
   users.push(user) si valide

2. Lecture
   GET /api/users/:id → UserController.getUserById()
   ↓
   users.find(u => u.id === id)
   ↓
   user.toJSON()
   ↓
   Response 200

3. Mise à jour
   PUT /api/users/:id → UserController.updateUser()
   ↓
   users.find(u => u.id === id)
   ↓
   user.name = newName (si fourni)
   user.email = newEmail (si fourni)
   ↓
   user.toJSON()
   ↓
   Response 200

4. Suppression
   DELETE /api/users/:id → UserController.deleteUser()
   ↓
   users.findIndex(u => u.id === id)
   ↓
   users.splice(index, 1)
   ↓
   Response 204
```

---

## 📊 Relations

### One-to-Many avec Task
```
User (1) ──possède──> Task (*)
```

Un utilisateur peut posséder plusieurs tâches. La relation est établie via `task.userId`.

**Exemple**:
```javascript
const user = new User(1, 'John Doe', 'john@example.com');
const task1 = new Task(1, 'Tâche 1', 'Description', user.id);
const task2 = new Task(2, 'Tâche 2', 'Description', user.id);
```

---

## 🚀 Usage dans le contrôleur

### Création
```javascript
createUser(req, res) {
    const { name, email } = req.body;
    const user = new User(this.nextId++, name, email);
    
    if (!user.validate()) {
        return res.status(400).json({ error: 'Données invalides' });
    }
    
    this.users.push(user);
    res.status(201).json(user.toJSON());
}
```

### Récupération
```javascript
getUserById(req, res) {
    const user = this.users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user.toJSON());
}
```

---

## 📈 Évolutions futures

### Phase 2: MongoDB
- Remplacement de la classe par Mongoose Schema
- Persistance en base de données
- Validation Mongoose + Joi
- Timestamps automatiques (createdAt, updatedAt)

### Phase 3: Authentification
- Ajout propriété `password` (hashé)
- Méthode `comparePassword()`
- Tokens JWT
- Rôles (user, admin)

### Phase 4: Fonctionnalités avancées
- Avatar (URL ou upload)
- Préférences utilisateur
- Méthode `getActiveTasks()`
- Statistiques utilisateur

---

## ✅ Conformité DoD-2

**Documentation complète du modèle User** ✅

- ✅ JSDoc dans le code source (User.js)
- ✅ Documentation technique détaillée (ce fichier)
- ✅ Spécifications des propriétés et méthodes
- ✅ Exemples d'utilisation
- ✅ Validation et règles métier
- ✅ Tests unitaires avec couverture 100%
- ✅ Diagrammes UML à jour (classes, architecture, séquence, MVC, flux)
- ✅ Documentation API (API_DOCUMENTATION.md)

---

## 📚 Références

- Code source: [backend/models/User.js](../backend/models/User.js)
- Tests: [backend/__tests__/User.test.js](../backend/__tests__/User.test.js)
- Validation: [backend/validators/userValidator.js](../backend/validators/userValidator.js)
- Contrôleur: [backend/controllers/UserController.js](../backend/controllers/UserController.js)
- Routes: [backend/routes/users.js](../backend/routes/users.js)
- API: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
