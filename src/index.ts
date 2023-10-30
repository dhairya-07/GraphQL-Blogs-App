import express,{Express, Request, Response} from 'express'
import {ApolloServer} from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4';

async function init(){
    const app:Express = express()
    app.use(express.json())

    const server = new ApolloServer({
        typeDefs: `
        type Query{
            hello: String
            say(name:String):String
        }`,
        resolvers: {
            Query:{
                hello: ()=> 'Hey from graphql server',
                say: (_, {name}:{name:String}) =>`Hey there, I am ${name}. How are you`
            }
        }
    })
    await server.start()

    app.get('/', (req:Request, res:Response)=>{
        res.json({
            msg:'Success'
        })
    })

    app.use('/graphql', expressMiddleware(server))
    
    app.listen(5000,()=>{
        console.log('Server running on port',5000);
    })
}

init()