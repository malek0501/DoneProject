const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { userSchema, userUpdateSchema, validate } = require('../validators');

const userController = new UserController();

// Routes pour les utilisateurs
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.post('/', validate(userSchema), (req, res) => userController.createUser(req, res));
router.put('/:id', validate(userUpdateSchema), (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
