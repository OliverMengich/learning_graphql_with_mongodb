const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true //mongoose automatically adds a created at and updated at
});

module.exports = mongoose.model('Booking', bookingSchema);