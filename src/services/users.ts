import {randomBytes, createHmac, pseudoRandomBytes} from 'node:crypto'
import JWT from 'jsonwebtoken'
import {prismaClient} from '../lib/db'

const jwtSecret = 'I_am_B@tm@m'

export interface createUserPayload{
    firstName:string,
    lastName: string,
    email:string,
    password:string
}

export interface getUserTokenPayload{
    email:string,
    password:string
}

class UserServices{
    private static generateHash(salt:string, password:string){
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')
        return hashedPassword
    }

    public static createUser(payload:createUserPayload){
        const {firstName, lastName, email, password} = payload
        const salt = randomBytes(32).toString('hex')
        const hashedPassword = UserServices.generateHash(salt, password)
        return prismaClient.users.create({
            data:{
                firstName,
                lastName,
                email,
                salt,
                password:hashedPassword
            }
        })
    }

    private static  getUserEmail(email:string){
        return  prismaClient.users.findUnique({where:{email}})
    }

    public static getUserById(id:string){
        return prismaClient.users.findUnique({where:{id}})
    }

    public static async getUserToken(payload:getUserTokenPayload){
        const {email, password} = payload
        const user = await UserServices.getUserEmail(email)
        if(!user)throw new Error('User not found')

        const userSalt = user.salt
        const candidateHashPassword = UserServices.generateHash(userSalt, password)

        if(candidateHashPassword!==user.password) throw new Error('Incorrect Password')
        
        const token = JWT.sign({id:user.id, email:user.email}, jwtSecret)
        return token
    }

    public static decodeJWTToken(token:string){
        return JWT.verify(token, jwtSecret)
    }
}

export default UserServices