import { AuthenticationError } from "apollo-server-express";
import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { UserStatus } from "./constants/userStatus";
import { User } from "./entities/User";
import { jwtTokenBody, MyContext } from "./types";
import { jwt_secretKey } from "./utils/jwt";



export const customAuthChecker: AuthChecker<MyContext,number> = async({context},permissions) => {
    const token = "authorization" in context.req.headers?context.req.headers['authorization']:null;
    let isValid:Boolean = true;
    if(token!==null){
        verify(token,jwt_secretKey,async(err,decodedToken)=>{
            if(err){
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

    //check permission
    if(context.req.user===null || context.req.user===undefined)return false;
    let isPermitted = true;
    permissions.forEach((permission)=>{
        if(!context.req.user.permissions.includes(permission)){
            isPermitted = false;
        }
    })
    return isPermitted; // or false if access is denied
  };