import bcrypt from "bcrypt";
const saltRounds = 10;

export const bcrypt_hash = (password:String) => {
  const hashed = bcrypt.hashSync(password, saltRounds);
  return hashed;
};

export const compare_bcrypt_hash = (ori_text:String, hashed_text:string) => {
  const isSame = bcrypt.compareSync(ori_text, hashed_text);
  return isSame;
};
