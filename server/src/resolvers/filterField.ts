import { UserRoles } from "src/constants/userRoles";
import { UserStatus } from "src/constants/userStatus";
import { InputType, Field, Int } from "type-graphql";
import { FindOperator } from "typeorm";

@InputType()
export class filter {
  @Field(() => Int, { nullable: true })
  id: number|null;
  @Field(() => String, { nullable: true })
  name: FindOperator<string>|null;
  @Field(() => String, { nullable: true })
  email: FindOperator<string>|null;
  @Field(() => Int, { nullable: true })
  status: UserStatus|null;
  @Field(() => Int, { nullable: true })
  role: UserRoles|null;
}