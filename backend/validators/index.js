/**
 * Point d'entrée pour les validateurs Joi
 * @module validators
 * @description Exporte tous les schémas de validation et le middleware validate
 */

const { userSchema, userUpdateSchema } = require('./userValidator');
const { taskSchema, taskUpdateSchema } = require('./taskValidator');

/**
 * Middleware de validation Joi générique
 * @param {Joi.ObjectSchema} schema - Schéma Joi à utiliser pour la validation
 * @returns {Function} Middleware Express pour valider req.body
 * @description Valide les données de la requête selon le schéma fourni
 * @example
 * router.post('/users', validate(userSchema), createUser);
 * router.post('/tasks', validate(taskSchema), createTask);
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            
            return res.status(400).json({
                success: false,
                errors
            });
        }
        
        next();
    };
};

module.exports = {
    userSchema,
    userUpdateSchema,
    taskSchema,
    taskUpdateSchema,
    validate
};
