const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { taskSchema, taskUpdateSchema, validate } = require('../validators');

const taskController = new TaskController();

// Routes pour les tâches
router.get('/', (req, res) => taskController.getAllTasks(req, res));
router.get('/:id', (req, res) => taskController.getTaskById(req, res));
router.post('/', validate(taskSchema), (req, res) => taskController.createTask(req, res));
router.put('/:id', validate(taskUpdateSchema), (req, res) => taskController.updateTask(req, res));
router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

module.exports = router;
