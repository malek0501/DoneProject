/**
 * Validateur Joi pour le modèle Task
 * @module validators/taskValidator
 */

const Joi = require('joi');

/**
 * Schéma de validation pour la création d'une tâche
 * @type {Joi.ObjectSchema}
 */
const taskSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.base': 'Le titre doit être une chaîne de caractères',
            'string.empty': 'Le titre ne peut pas être vide',
            'string.min': 'Le titre doit contenir au moins 1 caractère',
            'string.max': 'Le titre ne doit pas dépasser 200 caractères',
            'any.required': 'Le titre est obligatoire'
        }),
    description: Joi.string()
        .allow('', null)
        .max(1000)
        .messages({
            'string.base': 'La description doit être une chaîne de caractères',
            'string.max': 'La description ne doit pas dépasser 1000 caractères'
        }),
    userId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'userId doit être un nombre',
            'number.integer': 'L\'userId doit être un entier',
            'number.positive': 'L\'userId doit être positif',
            'any.required': 'L\'userId est obligatoire'
        }),
    status: Joi.string()
        .valid('pending', 'in-progress', 'completed')
        .default('pending')
        .messages({
            'any.only': 'Le statut doit être pending, in-progress ou completed'
        })
});

/**
 * Schéma de validation pour la mise à jour d'une tâche
 * @type {Joi.ObjectSchema}
 */
const taskUpdateSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .messages({
            'string.base': 'Le titre doit être une chaîne de caractères',
            'string.empty': 'Le titre ne peut pas être vide',
            'string.min': 'Le titre doit contenir au moins 1 caractère',
            'string.max': 'Le titre ne doit pas dépasser 200 caractères'
        }),
    description: Joi.string()
        .allow('', null)
        .max(1000)
        .messages({
            'string.base': 'La description doit être une chaîne de caractères',
            'string.max': 'La description ne doit pas dépasser 1000 caractères'
        }),
    status: Joi.string()
        .valid('pending', 'in-progress', 'completed')
        .messages({
            'any.only': 'Le statut doit être pending, in-progress ou completed'
        })
}).min(1);

module.exports = {
    taskSchema,
    taskUpdateSchema
};
