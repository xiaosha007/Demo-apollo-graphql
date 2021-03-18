import { UserPermissions } from "../constants/userPermissions";
import { UserRoles } from "../constants/userRoles";

export const getUserPermissions=(role:UserRoles) : UserPermissions[] =>{
    switch(role){
        case UserRoles.Admin:{
            return [
                UserPermissions.Create_Product,
                UserPermissions.Create_Order,
                UserPermissions.Update_Product,
                UserPermissions.Delete_Product,
                UserPermissions.Update_Order,
                UserPermissions.Cancel_Order
            ];
        }
        case UserRoles.SuperAdmin:{
            return [
                UserPermissions.Create_Product,
                UserPermissions.Create_Order,
                UserPermissions.Update_Product,
                UserPermissions.Delete_Product,
                UserPermissions.Update_Order,
                UserPermissions.Cancel_Order,
                UserPermissions.Create_User,
                UserPermissions.Update_User,
                UserPermissions.Delete_User
            ];
        }
        case UserRoles.User:{
            return [
                UserPermissions.Create_Product,
                UserPermissions.Create_Order,
                UserPermissions.Update_Product,
                UserPermissions.Delete_Product,
                UserPermissions.Update_Order,
                UserPermissions.Cancel_Order
            ];
        }
    }
}