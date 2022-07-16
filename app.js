const express = require('express');
const  mongoose = require('mongoose');
const {graphqlHTTP} = require('express-graphql'); //exports a function that returns a middleware
//middleware is a function that takes in a request and funnel then throught the graphql query parser
// and forward them to resolver
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth');
const app = express();
app.use(express.json());
app.use(isAuth);
app.use('/graphql',graphqlHTTP({
    //configure the graphql server API
    //graphql is a typed language
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
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
