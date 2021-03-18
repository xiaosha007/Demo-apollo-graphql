import {sign} from "jsonwebtoken";
import { jwtTokenBody } from "../types";

const maxAge = 36000;

export const jwt_secretKey = "prototype";

export const createJwtToken = (tokenBody:jwtTokenBody):string => {
    return sign(tokenBody, jwt_secretKey, {
      expiresIn: maxAge,
    });
};


