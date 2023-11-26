import express,{Express, Request, Response} from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import createGraphQlServer from './src/graphql/index'

async function init(){
    const app:Express = express()
    app.use(express.json())

   

    app.get('/', (req:Request, res:Response)=>{
        res.json({
            msg:'Success'
        })
    })

    app.use('/graphql', expressMiddleware(await createGraphQlServer()))
    
    app.listen(5000,()=>{
        console.log('Server running on port',5000);
    })
}

init()