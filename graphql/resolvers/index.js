const bycrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events =async eventsIds =>{
    try{
        const events = await Event.find({_id: {$in: eventsIds}})
        events.map(event =>{
            return{ ...event._doc, 
                id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        });
        return events;
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
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    }catch(err){
        throw err;
    }
}
module.exports = { 
    // points to a javascipt object that contains the resolvers
    // resolver functions need to match the schema
    //events query should have events resolver
    events: async () =>{
        // return ['Romantic Cooking','Sailing','All-night Coding'];
        try{
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc, 
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            })
        }catch(err){
            throw err;
        }
    },
    createEvent:async (args)=>{
        try{
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '62d1b93d9a915fb349b7bbfe'
            });
            let createdEvent;
            const result = await event.save()
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(), 
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this,result._doc.creator)
            };
            const user = await User.findById('62d1b93d9a915fb349b7bbfe')
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
    },
    createUser: (args)=>{
        return User.findOne({email: args.userInput.email})
        .then(user=>{
            if(user){ // if a user exists
                throw new Error('User exists already.')
            }
            return bycrypt.hash(args.userInput.password,12)
        })
        .then(hashedPassword=>{
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            return user.save();
        }).then(result=>{
            return {...result._doc, password: null, id: result.id}
        })
        .catch(err=>{
            throw err;
        })
    }
}