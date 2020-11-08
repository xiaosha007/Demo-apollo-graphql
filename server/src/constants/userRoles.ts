export enum UserRoles {
    "SuperAdmin",
    "Admin",
    "User"
}

import { registerEnumType } from "type-graphql";

registerEnumType(UserRoles, {
  name: "UserRoles", // this one is mandatory

});