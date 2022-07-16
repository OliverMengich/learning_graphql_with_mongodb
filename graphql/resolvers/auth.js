const bycrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
module.exports = { 
    // points to a javascipt object that contains the resolvers
    // resolver functions need to match the schema
    //events query should have events resolver
    createUser: (args)=>{
        return User.findOne({email: args.userInput.email})
        .then(user=>{
            if(user){ // if a user exists
                throw new Error('User exists already.');
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
    },
    login: async ({email, password})=>{
        //validate email and password combination is correct
        const user= await User.findOne({email});
        if(!user){
            throw new Error("User does not exit");
        }
        const isEqual = await bycrypt.compare(password,user.password);
        if(!isEqual){
            throw new Error("Password is incorrect!");
        }
        const token = await jwt.sign({userId: user.id, email: user.email},'suppersecretkey',{
            expiresIn: '1h'
        });
        //same as wha
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
}