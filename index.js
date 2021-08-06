const {ApolloServer ,PubSub} = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');


const mongoose = require('mongoose');

const resolvers = require('./graphql/resolvers');
const {MONGODB} = require('./config.js');
const pubsub = new PubSub();
const PORT = process.env.port || 5000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req , pubsub})
});


mongoose.connect(MONGODB, {useNewUrlParser: true})
.then((data)=>{
    console.log('mong connected');
    return server.listen({port:PORT})
}).then((res)=>{
    console.log('server running at ' + res.url)
}).catch(err=>{
    console.log(err)
});
