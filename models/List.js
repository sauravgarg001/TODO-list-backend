const mongoose = require('mongoose');

let tasksSubSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    subTasks: [],
    isOpen: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let contributersSubSchema = new mongoose.Schema({ // In the begining there is only read access
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    canEdit: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let changesSubSchema = new mongoose.Schema({ // To Undo Changes
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    operationToUndo: {
        type: String,
        required: true,
    },
    paramsToUndo: mongoose.Schema.Types.Mixed,
    createdOn: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let listSchema = new mongoose.Schema({
    listId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    tasks: [tasksSubSchema],
    contributers: [contributersSubSchema],
    changes: [changesSubSchema],
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('List', listSchema);