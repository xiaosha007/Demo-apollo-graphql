import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ArrayField, BooleanInput, Datagrid, DateField, EditButton, EmailField, Filter, List, Loading, SelectField, SelectInput, SingleFieldList, TextField, TextInput, useAuthState } from 'react-admin';
import { useHistory } from 'react-router-dom';
import { getConstant } from '../../utils/getConstant';
import PermissionChipField from './PermissionChipField';


const useStyles = makeStyles({
    outerSimpleField:{paddingTop:3,paddingBottom:3},
    smallText:{fontSize:12}
});

const UserFilter = (props) => (
        <Filter {...props}>
            <TextInput label="Search" source="name" alwaysOn />
            <SelectInput source="status" alwaysOn choices={
                props.UserStatus?props.UserStatus.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
            } />
            <TextInput source="email" />
        </Filter>);

const TimestampDateField = (props) => {
    // const date = new Date(props.record[props.source]);
    const recordWithTimestampAsInteger = {
        [props.source]: parseInt(props.record[props.source], 10)
    };
    return <DateField showTime {...props} record={recordWithTimestampAsInteger} ></DateField>
};
    

const UserList: React.FC<any> = (props)=>{
    const { loading, authenticated } = useAuthState();
    const history = useHistory();
    if(!authenticated){
        history.push("/login");
    }
    const classes = useStyles();
    const [constants,setConstants] = useState<any>();
    useEffect(() => {
        getConstant(["UserPermissions","UserRoles","UserStatus"]).then((result)=>{
            setConstants(result.data);
        });
    },[]);
    return ( !loading?
        <List {...props} title="User list" filters={<UserFilter UserStatus={constants?constants.UserStatus:null} />}>
            <Datagrid className={classes.smallText} >
                <TextField source="id" ></TextField>
                <TextField source="name"></TextField>
                <EmailField source="email"></EmailField>
                <TimestampDateField source="createdAt"></TimestampDateField>
                <SelectField source="status" choices={
                    constants?constants.UserStatus.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
                } />
                <SelectField source="role" choices={
                    constants?constants.UserRoles.map((permission)=>({id:permission.key,name:permission.name.replace("_"," ")})):[]
                } />
                <ArrayField source="permissions" sortable={false}>
                    <SingleFieldList linkType={false} className={classes.outerSimpleField}>
                        <PermissionChipField permissionList={constants?constants.UserPermissions:null}/>
                    </SingleFieldList>
                </ArrayField>
                <EditButton basePath="/User" label="Edit"/>
            </Datagrid>
        </List> : <Loading />
    );
};

export default UserList;