import { User } from "../entities/User";
import { Arg, Authorized, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import {bcrypt_hash, compare_bcrypt_hash} from "../utils/bcrypt";
import { getConnection, Like } from "typeorm";
import { UserRoles } from "../constants/userRoles";
import { getUserPermissions } from "../utils/getUserPermissions";
import { UserStatus } from "../constants/userStatus";
import { UserPermissions } from "../constants/userPermissions";
import { createJwtToken, jwt_secretKey } from "../utils/jwt";
import { verifyJwt } from "../middleware/authMiddleware";
import { jwtTokenBody, MyContext } from "../types";
import { pagination } from "./paginationField";
import { sort } from "./sortField";
import {sendEmail} from "../utils/mailService";
import { v4 } from "uuid";
import { REGISTER_PREFIX } from "../constants/important";
import { verify } from "jsonwebtoken";
import { filter } from "./filterField";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class PaginatedUsers {
  @Field(() => [User])
  users: User[];
  @Field(()=>Int)
  totalPage: number;
  @Field(()=>Int)
  totalUser: number;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  token?: string;
}


@Resolver(User)
export class UserResolver {

  @Authorized()
  @Query(() => User, { nullable: false })  
  User(
    @Arg("id",()=>Int)id:number
    ) {
    return User.findOne(id);
  }

  @Query(() => User, { nullable: false })
  @Authorized()
  isUser(
    @Ctx() { req }: MyContext
    ) {
      return req.user;
  }

  @Query(() => PaginatedUsers)
  @Authorized()
  async allUsers(
    @Arg("pagination") pagination:pagination,
    @Arg("sort") sort:sort,
    @Arg("filter") filter:filter
  ): Promise<PaginatedUsers> {
    const realPage = pagination.page?pagination.page:1;
    let sorting:any = {};
    if("name" in filter){
      filter.name = Like(`%${filter.name}%`)
    }
    if("email" in filter){
      filter.email = Like(`%${filter.email}%`)
    }
    if(sort?.sortBy)sorting[sort?.sortBy] = sort?.order;
    const [users,totalUser] = await User.findAndCount({ 
      take: pagination.perPage, skip: (realPage-1) * pagination.perPage,
      order:sorting.length===0?undefined:sorting, //email:Like(`'$${filter.email}$'`)
      where:filter,
      
    })
    return {
      users,
      totalPage:totalUser % pagination.perPage !== 0
      ? parseInt((totalUser / pagination.perPage).toString()) + 1
      : parseInt((totalUser / pagination.perPage).toString()),
      totalUser
    };
  }

  @Authorized(UserPermissions.Create_User)
  @Mutation(()=>UserResponse)
  async createUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("role",()=>Int,{nullable:true}) role : UserRoles|null,
    @Arg("status",()=>Int,{nullable:true}) status : UserStatus|null,
    @Arg("permissions",()=>[Int],{nullable:true}) permissions : UserPermissions[]|null,
    @Ctx(){redis}:MyContext
  ):Promise<UserResponse | null>{
    const roleFinal = role!==null?role:UserRoles.User;
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        name,
        email,
        password:"",
        role:roleFinal,
        status:status?status:UserStatus.Pending,
        permissions:permissions?permissions:getUserPermissions(roleFinal)
      })
      .returning("*")
      .execute();
    const token = createJwtToken({id:result.raw[0].id,email:result.raw[0].email});
    await redis.set(
      result.raw[0].id.toString(),
      JSON.stringify({token:REGISTER_PREFIX + token,createdAt:new Date()}),
      "ex",
      1000 * 60 * 60 * 24  //1days
    );
    sendEmail(email,{title:"Welcome to our system.",text:`<a href="http://localhost:3000/#/verify-account/${token}">Verify</a>`})
    console.log(result.raw)
    return {user:result.raw[0]};
  }


  @Mutation(()=>UserResponse)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Ctx() {redis}:MyContext
  ):Promise<UserResponse | null>{
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        name,
        email,
        password:"",
        role:UserRoles.User,
        status:UserStatus.Pending,
        permissions:getUserPermissions(UserRoles.User)
      })
      .returning("*")
      .execute();
    const token = createJwtToken({id:result.raw[0].id,email:result.raw[0].email});
    await redis.set(
      result.raw[0].id.toString(),
      JSON.stringify({token:REGISTER_PREFIX + token,createdAt:Date.now()}),
      "ex",
      1000 * 60 * 60 * 24  //1days
    );
    // await redis.set(result.raw[0].id,REGISTER_PREFIX,"ex",1000*60);
    const mailRes = sendEmail(email,{title:"Welcome to our system.",text:`<a href="http://localhost:3000/#/verify-account/${token}">Verify</a>`})
    console.log(result.raw)
    return {user:result.raw[0]};
  }


  @Mutation(()=>UserResponse)
  async resendVerificationEmail(
    @Arg("email") email:string,
    @Ctx(){redis}:MyContext
  ):Promise<UserResponse>{
    const user = await User.findOne({email,status:UserStatus.Pending});
    if(!user){
      return {
        errors: [
          {
            field: "email",
            message: "User does not exist or has been verified.",
          },
        ],
      };
    }
    const tokenBody = await redis.get(user.id.toString());
    const tokenCreatedTime = tokenBody?JSON.parse(tokenBody).createdAt:tokenBody;
    if(tokenCreatedTime && (Date.now()-tokenCreatedTime)<(1000*60)){
        return {
          errors: [
            {
              field: "email",
              message: "Please request after 59 seconds.",
            },
          ],
        };
    }
    const token = createJwtToken({id:user.id,email:user.email});
    await redis.set(
      user.id.toString(),
      JSON.stringify({token:REGISTER_PREFIX + token,createdAt:Date.now()}),
      "ex",
      1000 * 60 * 60 * 24  //1days
    );
    const mailRes = sendEmail(email,{title:"Welcome to our system.",text:`<a href="http://localhost:3000/#/verify-account/${token}">Verify</a>`})
    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async verifyAccount(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    if (password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 6",
          },
        ],
      };
    }

    const key = REGISTER_PREFIX + token;
    const {id,email} = verify(token,jwt_secretKey) as jwtTokenBody;
    const tokenBody = await redis.get(id.toString());
    const tokenFromRedis = tokenBody?JSON.parse(tokenBody).token:tokenBody;
    if (!tokenFromRedis || tokenFromRedis!==key) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const user = await User.findOne({id:id,email:email,status:UserStatus.Pending});
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    await User.update(
      { id: id },
      {
        password: bcrypt_hash(password),
        status:UserStatus.Active
      },
    );
    await redis.del(id.toString());
    return { user };
  }


  @Mutation(() => UserResponse)
  async login(
    @Arg("name") name: string,
    @Arg("password") password: string,
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { name } });
    if (!user) {
      return {
        errors: [
          {
            field: "name",
            message: "User doesn't exist.",
          },
        ],
      };
    }
    const valid = compare_bcrypt_hash(password,user.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      };
    }
    if(user.status!==UserStatus.Active){
      return {
        errors: [
          {
            field: "status",
            message: "User not active. Please verify your account to continue.",
          },
        ],
      };
    }
    return {
      user,
      token:createJwtToken({id:user.id,password:user.password})
    };
  }

  @Mutation(() => UserResponse, { nullable: true })
  @Authorized(UserPermissions.Update_User)
  async updateUser(
    @Arg("id",()=>Int,{nullable:false}) id:number,
    @Arg("role",()=>Int,{nullable:false}) role: UserRoles,
    @Arg("status",()=>Int,{nullable:false}) status: UserStatus,
    @Arg("permissions",()=>[Int],{nullable:false}) permissions: UserPermissions[],
    @Arg("email",()=>String,{nullable:false}) email: string,
    @Arg("name",()=>String,{nullable:false}) name: string
  ): Promise<UserResponse | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
         role:role!==null?role:undefined, 
         status:status!==null?status:undefined,
         permissions:permissions?permissions:undefined ,
         name,
         email
        })
      .where('id = :id ', {id})
      .returning("*")
      .execute();
    return {user:result.raw[0]};
  }

  @Mutation(() => [User], { nullable: true })
  @Authorized(UserPermissions.Delete_User)
  async deactivateManyUsers(
    @Arg("ids",()=>[Int],{nullable:false}) ids:number[],
  ): Promise<UserResponse | null> {
    console.log(ids);
    const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ status:UserStatus.Deactivate })
      .where('id in (:...ids) ', {ids})
      .returning("*")
      .execute();
    console.log(result)
    return result.raw;
  }
}
