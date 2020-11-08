export enum UserPermissions {
    "Create_User",
    "Update_User",
    "Delete_User",
    "Create_Product",
    "Update_Product",
    "Delete_Product",
    "Create_Order",
    "Update_Order",
    "Cancel_Order",
    "Region_Malaysia",
    "Region_China",
    "Region_Hongkong"
}

import { registerEnumType } from "type-graphql";

registerEnumType(UserPermissions, {
  name: "UserPermissions", // this one is mandatory

});