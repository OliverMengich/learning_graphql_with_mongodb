const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../helpers/date');
const events =async eventsIds =>{
    try{
        const events = await Event.find({_id: {$in: eventsIds}})
        return events.map(event =>{
            return transformEvent(event)
        });
    }catch(err){
        throw err;
    }
}
const user= async (userId)=>{
    try{
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            password: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    }catch(err){
        throw err;
    }
}
const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId);
        return transformEvent(event);
    }catch(err){
        throw err;
    }
}
const transformEvent = event =>{
    return {
        ...event._doc, 
        id: event._doc.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    }
};
const transformBooking = booking =>{
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this,booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}
exports.user = user;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.singleEvent = singleEvent;