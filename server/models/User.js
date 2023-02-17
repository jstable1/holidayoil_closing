const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        initials: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 4
        },
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required: true
        },
        storeNumber: {
            type: Number,
            required: true,
            minlength: 2
        },
        password: {
            type: String,
            required: true,
            minlength: 4
        },
    }
)