import Redis from "ioredis";
import { UserPermissions } from "../constants/userPermissions";
import { UserRoles } from "../constants/userRoles";
import { UserStatus } from "../constants/userStatus";

export const redisStoreConstant=(redisClient:Redis.Redis)=>{
    const constantList = [UserPermissions,UserRoles,UserStatus];
    const constantName = ["UserPermissions","UserRoles","UserStatus"];
    constantList.forEach(async (constant,index)=>{
        const values = Object.keys(constant).filter((item) => {
            return isNaN(Number(item));
        });
        let i = 0;
        const processedValues = values.map((value)=>{
            return {name:value,key:i++};
        });
        await redisClient.set(constantName[index],JSON.stringify(processedValues));
    })
   
}