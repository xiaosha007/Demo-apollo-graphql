import { AuthenticationError } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { jwtTokenBody, MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";
import { jwt_secretKey } from "../utils/jwt";
import { User } from "../entities/User";
import { UserStatus } from "../constants/userStatus";

export const verifyJwt:MiddlewareFn<MyContext> = async ({context},next) =>{
    console.log("jwt....")
    const token = "authorization" in context.req.headers?context.req.headers['authorization']:null;
    let isValid:Boolean = true;
    if(token!==null){
        verify(token,jwt_secretKey,async(err,decodedToken)=>{
            if(err){
                console.log(err);
                isValid = false;
            }
            else context.req.decodedToken= decodedToken as jwtTokenBody;
        });
    }else throw new AuthenticationError("No token provided!");
    if(!isValid) throw new AuthenticationError("Invalid token!");
    const user = await User.findOne({id:context.req.decodedToken.id,password:context.req.decodedToken.password});
    if(!user) throw new AuthenticationError("Invalid User!");
    if(!(user.status===UserStatus.Active)) throw new AuthenticationError("This user is either pending or inactive.");
    context.req.user = user;
    return next();
}