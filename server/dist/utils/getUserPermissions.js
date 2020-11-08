"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPermissions = void 0;
const userPermissions_1 = require("src/constants/userPermissions");
const userRoles_1 = require("src/constants/userRoles");
exports.getUserPermissions = (role) => {
    switch (role) {
        case userRoles_1.UserRoles.Admin: {
            return [...Object.keys(userPermissions_1.UserPermissions)];
        }
        case userRoles_1.UserRoles.SuperAdmin: {
            return [...Object.keys(userPermissions_1.UserPermissions)];
        }
        case userRoles_1.UserRoles.User: {
            return [
                userPermissions_1.UserPermissions.Create_Product,
                userPermissions_1.UserPermissions.Create_Order,
                userPermissions_1.UserPermissions.Update_Product,
                userPermissions_1.UserPermissions.Delete_Product,
                userPermissions_1.UserPermissions.Update_Order,
                userPermissions_1.UserPermissions.Cancel_Order
            ];
        }
    }
};
//# sourceMappingURL=getUserPermissions.js.map