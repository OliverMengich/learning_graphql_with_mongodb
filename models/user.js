const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // reference to the event model
    createdEvents: [{
        type: Schema.Types.ObjectId, //references the _id of the event
        ref: 'Event' //references the events collection name
    }]
});
module.exports = mongoose.model('User', userSchema);