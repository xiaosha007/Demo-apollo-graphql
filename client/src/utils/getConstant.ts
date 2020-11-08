import axios from 'axios';

export const getConstant =async (constant:("UserPermissions"|"UserRoles"|"UserStatus")[]) =>{
    const response = await axios.post('http://localhost:4000/constants',{constants:constant});
    console.log(response);
    return response.data?response.data:null
}