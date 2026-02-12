const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
        maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'ID utilisateur est obligatoire']
    },
    status: {
        type: String,
        enum: {
            values: ['En attente', 'En cours', 'Terminée'],
            message: 'Le statut doit être: En attente, En cours ou Terminée'
        },
        default: 'En attente'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Index pour filtrage performant
taskSchema.index({ userId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
