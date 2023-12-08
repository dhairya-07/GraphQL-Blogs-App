import UserServices,{createUserPayload} from '../../services/users'

const queries={
    getUserToken:async(_:any, payload:{email:string, password:string})=>{
        const token = await UserServices.getUserToken({
            email:payload.email,
            password:payload.password
        })
        return token
    },
    getLoggedInUser: async(_:any, parameters:any, context:any)=>{
        if(context && context.user){
        const id = context.user.id
        const user = await UserServices.getUserById(id)
        return user
    }
        console.log(context);
        throw new Error('Not the user')
    }
}
const mutations ={
    createUser: async(_:any, payload:createUserPayload)=>{
        const res = await UserServices.createUser(payload)
        return res.id
    }
}

export const resolvers ={queries, mutations}