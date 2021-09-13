const mongoose = require('mongoose');

var logsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Logs', logsSchema);