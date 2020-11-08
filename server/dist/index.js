"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const apollo_server_express_1 = require("apollo-server-express");
const buildSchema_1 = require("type-graphql/dist/utils/buildSchema");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const user_1 = __importDefault(require("./resolvers/user"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello world");
    const conn = yield typeorm_1.createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: true,
        entities: [User_1.User],
    });
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield buildSchema_1.buildSchema({
            resolvers: [user_1.default],
            validate: false,
        }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log("server started on localhost:4000");
    });
});
main().catch((err) => { console.log(err); });
//# sourceMappingURL=index.js.map