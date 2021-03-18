import express from "express";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql/dist/utils/buildSchema";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import {UserResolver} from "./resolvers/user";
import cors from "cors";
import Redis from "ioredis";
import { customAuthChecker } from "./authChecker";
import {redisStoreConstant} from "./utils/redisConstant";


const main = async () => {
  console.log("Hello world")
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [User],
  });
  const app = express();
  app.use(express.json())
  const redis = new Redis(process.env.REDIS_URL);
  redisStoreConstant(redis);
  
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
      authChecker:customAuthChecker,
      authMode:"error"
    }),
    context: ({ req, res }) => ({
        req,
        res,
        redis
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.post("/constants",async (req,res)=>{
    const constants = req.body.constants;
    let finalResult:any = {};
    await Promise.all(constants.map(async (cons: string)=>{
      const redisConst = await redis.get(cons);
      const redisResult = redisConst?JSON.parse(redisConst):null;
      finalResult[cons] = redisResult;
    }));
    res.status(200).json({
      data:finalResult
    });
  });
  app.listen(process.env.PORT, () => {
    console.log( `server started on localhost:${process.env.PORT}`);
  });
};

main().catch((err)=>{console.log(err);})
