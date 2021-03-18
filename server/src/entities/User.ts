import { UserPermissions } from "../constants/userPermissions";
import { UserRoles } from "../constants/userRoles";
import { UserStatus } from "../constants/userStatus";
import { ObjectType, Field, Int } from "type-graphql";

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field(()=>Int)
  @Column()
  status!: UserStatus;

  @Field(()=>Int)
  @Column()
  role!: UserRoles;

  @Field(()=>[Int])
  @Column("int",{ array: true })
  permissions!: UserPermissions[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}
