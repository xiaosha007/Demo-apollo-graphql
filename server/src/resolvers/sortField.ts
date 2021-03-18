import { InputType, Field, Int } from "type-graphql";

@InputType()
export class sort {
  @Field(() => String, { nullable: true })
  sortBy: "id"|"createdAt"|"status"|"role"|"name"|null;
  @Field(() => String, { nullable: true })
  order: "DESC"|"ASC"|null;
}