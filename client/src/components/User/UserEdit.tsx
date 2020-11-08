import { type } from "os";
import React, { useState,useEffect } from "react";
import { CheckboxGroupInput, Edit, SelectInput, SimpleForm, TextInput, useNotify, useRedirect, useRefresh } from "react-admin"
import { getConstant } from "../../utils/getConstant";


const UserEdit = (props) =>{
    const [constants,setConstants] = useState<any>();
    useEffect(() => {
        getConstant(["UserPermissions","UserRoles","UserStatus"]).then((result)=>{
            setConstants(result.data);
        });
    },[]);

    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onFailure = (error) => {
        notify(error.message,"error");
    };
    
    return (
        <Edit title="Edit User" {...props} onFailure={onFailure} undoable={false}>
            <SimpleForm>
                <TextInput source="name"></TextInput>
                <TextInput type="email" source="email"></TextInput>
                <SelectInput source="role" choices={
                    constants?constants.UserRoles.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
                } />
                <SelectInput source="status" choices={
                    constants?constants.UserStatus.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
                } />
                <CheckboxGroupInput source="permissions" choices={
                    constants?constants.UserPermissions.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
                } />
            </SimpleForm>
        </Edit>
    )
}

export default UserEdit;