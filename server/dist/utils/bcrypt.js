"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare_bcrypt_hash = exports.bcrypt_hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
exports.bcrypt_hash = (password) => {
    const hashed = bcrypt_1.default.hashSync(password, saltRounds);
    return hashed;
};
exports.compare_bcrypt_hash = (ori_text, hashed_text) => {
    const isSame = bcrypt_1.default.compareSync(ori_text, hashed_text);
    return isSame;
};
//# sourceMappingURL=bcrypt.js.map