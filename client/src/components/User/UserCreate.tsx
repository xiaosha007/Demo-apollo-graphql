import React, { useEffect, useState } from "react";
import { Create, SelectInput, SimpleForm, TextInput } from "react-admin"
import { getConstant } from "../../utils/getConstant";



const UserCreate = (props) =>{
    const [constants,setConstants] = useState<any>();
    useEffect(() => {
        getConstant(["UserRoles"]).then((result)=>{
            setConstants(result.data);
        });
    },[]);
    return (
        <Create title="Create User" {...props}>
            <SimpleForm>
                <TextInput source="name"></TextInput>
                <TextInput type="email" source="email"></TextInput>
                <SelectInput source="role" choices={
                    constants?constants.UserRoles.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
                } />
            </SimpleForm>
        </Create>
    )
}

export default UserCreate;