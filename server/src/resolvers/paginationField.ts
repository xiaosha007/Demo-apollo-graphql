import { InputType, Field, Int } from "type-graphql";

@InputType()
export class pagination {
    @Field(() => Int, { nullable: true })
    page: number|null;
    @Field(() => Int)
    perPage: number;
}