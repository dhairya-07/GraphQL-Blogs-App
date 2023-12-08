import express,{Express, Request, Response} from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import createGraphQlServer from './src/graphql/index'
import UserServices from './src/services/users';

async function init(){
    const app:Express = express()
    app.use(express.json())

   

    app.get('/', (req:Request, res:Response)=>{
        res.json({
            msg:'Success'
        })
    })

    app.use('/graphql', expressMiddleware(await createGraphQlServer(),
     {context:async({req})=>{
        // @ts-ignore
        const token = req.headers['token']
        try{
            const user = UserServices.decodeJWTToken(token as string)
            return {user}
        }catch(err){
            return {}
        }
    }}
    ))
    
    app.listen(5000,()=>{
        console.log('Server running on port',5000);
    })
}

init()