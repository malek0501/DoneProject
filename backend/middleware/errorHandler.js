// Middleware de gestion globale des erreurs

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log de l'erreur pour débogage (pas en mode test)
    if (process.env.NODE_ENV !== 'test') {
        console.error('ERROR 💥', err);
    }

    // Réponse détaillée en développement
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Réponse simplifiée en production
        if (err.isOperational) {
            res.status(err.statusCode).json({
                success: false,
                status: err.status,
                message: err.message
            });
        } else {
            // Erreur de programmation ou inconnue
            res.status(500).json({
                success: false,
                status: 'error',
                message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
            });
        }
    }
};

// Gestionnaire d'erreurs asynchrones
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Gestionnaire pour les routes non trouvées
const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} non trouvée`, 404);
    next(error);
};

module.exports = {
    AppError,
    errorHandler,
    catchAsync,
    notFound
};
