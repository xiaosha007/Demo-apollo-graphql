import { Redis } from "ioredis";
import { User } from "./entities/User";

export type jwtTokenBody = {
    id:number,
    password?:string,
    email?:string
}

export type MyContext = {
    req: Request & {decodedToken:jwtTokenBody,user:User};
    res: Response;
    redis:Redis;
};