const queries={}
const mutations ={
    createUser: async(_:any, 
        {firstName, lastName, email, password}:
        {firstName:String, lastName:String, email:String, password:String})=>{
        return 'randomID'
    }
}

export const resolvers ={queries, mutations}