const Joi = require('joi');

// Schémas de validation

const userSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Le nom est obligatoire',
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne peut pas dépasser 100 caractères',
            'any.required': 'Le nom est obligatoire'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'L\'email est obligatoire',
            'string.email': 'Format d\'email invalide',
            'any.required': 'L\'email est obligatoire'
        })
});

const taskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.empty': 'Le titre est obligatoire',
            'string.min': 'Le titre doit contenir au moins 3 caractères',
            'string.max': 'Le titre ne peut pas dépasser 200 caractères',
            'any.required': 'Le titre est obligatoire'
        }),
    description: Joi.string()
        .max(1000)
        .allow('')
        .optional()
        .messages({
            'string.max': 'La description ne peut pas dépasser 1000 caractères'
        }),
    userId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'ID utilisateur doit être un nombre',
            'number.positive': 'L\'ID utilisateur doit être positif',
            'any.required': 'L\'ID utilisateur est obligatoire'
        }),
    status: Joi.string()
        .valid('En attente', 'En cours', 'Terminée')
        .default('En attente')
        .messages({
            'any.only': 'Le statut doit être: En attente, En cours ou Terminée'
        })
});

const taskUpdateSchema = Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().max(1000).allow('').optional(),
    status: Joi.string().valid('En attente', 'En cours', 'Terminée').optional()
}).min(1).messages({
    'object.min': 'Au moins un champ doit être fourni pour la mise à jour'
});

// Middleware de validation
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Retourner toutes les erreurs
            stripUnknown: true // Supprimer les champs non définis dans le schéma
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors
            });
        }

        // Remplacer req.body par les données validées et nettoyées
        req.body = value;
        next();
    };
};

module.exports = {
    userSchema,
    taskSchema,
    taskUpdateSchema,
    validate
};
