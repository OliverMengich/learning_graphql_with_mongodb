const express = require('express');
const  mongoose = require('mongoose');
const {graphqlHTTP} = require('express-graphql'); //exports a function that returns a middleware
//middleware is a function that takes in a request and funnel then throught the graphql query parser
// and forward them to resolver

const { buildSchema } = require('graphql');
const Event = require('./models/event');
const app = express();
app.use(express.json());
app.use('/graphql',graphqlHTTP({
    //configure the graphql server API
    //graphql is a typed language
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { 
        // points to a javascipt object that contains the resolvers
        // resolver functions need to match the schema
        //events query should have events resolver
        events: () =>{
            // return ['Romantic Cooking','Sailing','All-night Coding'];
            return Event.find().then(events => {
                return events.map(event => {
                    return {...event._doc, _id: event._doc._id.toString() };
                })
            }).catch(err => {
                console.log(err)
            })
        },
        createEvent: (args)=>{
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save().then(result=>{
                console.log(result);
                return {...result._doc, _id: result._doc._id.toString()};
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true //enable the graphiql interface
}));
mongoose.connect("mongodb://localhost/graphql-test",
    {useNewUrlParser: true})
.then(()=>{
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    });
}).catch(err=>{
    console.log(err);
})
