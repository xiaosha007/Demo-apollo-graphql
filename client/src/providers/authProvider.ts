import { gql } from "@apollo/client";
import { AuthProvider } from "react-admin";
import {client} from "../utils/apolloClient";


export const authProvider:AuthProvider = {
    login: ({name,password,loginMutation}) => {
        console.log(name,password)
        return loginMutation({variables:{
            name,
            password
        }}).then(result => {
            if(result.data.login.errors)throw new Error(result.data.login.errors[0].message);
            localStorage.setItem('user', JSON.stringify(result.data.login.user));
            localStorage.setItem('token', JSON.stringify(result.data.login.token));
            return result;
        });;
    },
    logout: client => {
        console.log("Logout...");
        localStorage.clear();
        client.resetStore();
        return Promise.resolve();
    },
    checkAuth: params => {
        return client.query({query:gql`
            query isAuth{
                isUser{
                    id,
                    email,
                    name,
                    createdAt,
                    updatedAt
                }
            }    
        `}).then((result)=>Promise.resolve(),(reject)=>Promise.reject());
    },
    checkError: error => Promise.resolve(),
    getPermissions: params => Promise.resolve(),
};