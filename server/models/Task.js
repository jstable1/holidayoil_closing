const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
    {
        taskName: {
            type: String,
            required: 'Please add a task!'
        },
        hour: {
            type: Number,
            maxlength: 2,
            required: true
        },
        taskDescription: {
            type: String
        },
        storeNumber: {
            type: Number
        },
        completed: {
            type: Boolean,
            default: false
        }
    }
);

const Task = model('Task', taskSchema);

model.exports = Task;