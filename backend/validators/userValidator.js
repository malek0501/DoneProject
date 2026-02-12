/**
 * Validateur Joi pour le modèle User
 * @module validators/userValidator
 */

const Joi = require('joi');

/**
 * Schéma de validation pour la création d'un utilisateur
 * @type {Joi.ObjectSchema}
 */
const userSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.base': 'Le nom doit être une chaîne de caractères',
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne doit pas dépasser 100 caractères',
            'any.required': 'Le nom est obligatoire'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email doit être valide',
            'any.required': 'L\'email est obligatoire'
        })
});

/**
 * Schéma de validation pour la mise à jour d'un utilisateur
 * @type {Joi.ObjectSchema}
 */
const userUpdateSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.base': 'Le nom doit être une chaîne de caractères',
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne doit pas dépasser 100 caractères'
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'L\'email doit être valide'
        })
}).min(1);

module.exports = {
    userSchema,
    userUpdateSchema
};
