export enum UserStatus {
    "Active",
    "Pending",
    "Deactivate"
}

import { registerEnumType } from "type-graphql";

registerEnumType(UserStatus, {
  name: "UserStatus", // this one is mandatory

});