const {dateToString} = require('../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');
const{ user } = require('./merge');
const { Error } = require('mongoose');
const transformEvent = event =>{
    return {
        ...event._doc, 
        id: event._doc.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    }
};
module.exports = { 
    // points to a javascipt object that contains the resolvers
    // resolver functions need to match the schema
    //events query should have events resolver
    events: async () =>{
        // return ['Romantic Cooking','Sailing','All-night Coding'];
        try{
            const events = await Event.find();
            return events.map(event => {
                console.log(event);
                return transformEvent(event);
            })
        }catch(err){
            throw err;
        }
    },
    createEvent:async (args, req)=>{
        try{
            // if request.isAUth is a false, user is not authenticated to c
            if(!req.isAuth){
                throw new Error('UnAuthenticated');
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId,
            });
            let createdEvent;
            const result = await event.save()
            createdEvent = transformEvent(result)
            const user = await User.findById(req.userId)
            if(!user){
                throw new Error("User not found");
            }
            //else if a user is specified
            user.createdEvents.push(event)
            await user.save();
            return createdEvent;
        }catch(err) {
            console.log(err);
            throw err;
        }
    }
}