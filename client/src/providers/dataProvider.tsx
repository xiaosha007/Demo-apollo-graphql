import { gql } from "@apollo/client";
import {CreateParams, DataProvider, DeleteManyParams, DeleteParams, GetListParams, GetManyParams, GetOneParams, UpdateManyParams, UpdateParams } from "react-admin";
import {client} from "../utils/apolloClient";



const dataProvider:DataProvider = {
    getList: (resource:string, params:GetListParams):Promise<any> => {
        // params.filter.name = params.filter.name?params.filter.name:"";
        // params.filter.email = params.filter.name?params.filter.email:"";
        console.log(params)
        if(resource==="User"){
            return client.query({query:
                gql`
                    query AllUsers($sort:sort!,$pagination:pagination!,$filter:filter!){
                        allUsers(
                            sort:$sort,
                            pagination:$pagination,
                            filter:$filter
                        ){
                            users{
                                name,
                                id,
                                email,
                                status,
                                permissions,
                                role,
                                createdAt
                            },
                            totalPage,
                            totalUser
                        }
                    }
                `,variables:{
                    "sort": {"sortBy": `${params.sort.field}`,"order": `${params.sort.order}`},
                    "pagination": {"page": params.pagination.page,"perPage": params.pagination.perPage},
                    "filter": params.filter
                }}).then((result)=>{return {data:result.data.allUsers.users,total:result.data.allUsers.totalUser};})
        }
        return Promise.resolve();
    },
    getOne:(resource:string, params:GetOneParams):Promise<any> => {
        console.log(params);
        if(resource==="User"){
            return client.query({query:gql`
                query {
                User(id: ${params.id}) {
                        id,
                        name,
                        email,
                        createdAt,
                        status,
                        permissions,
                        role
                    }
                }
            `}).then((result)=>{return {data:result.data.User}})
        }
        return Promise.resolve();
    },
    getMany:    (resource:string, params:GetManyParams):Promise<any> => Promise.resolve(),
    getManyReference: (resource:string, params:GetListParams):Promise<any> => Promise.resolve(),
    create:(resource:string, params:CreateParams):Promise<any> => {
        if(resource==="User"){
            return client.mutate({mutation:gql`
                mutation {
                    createUser(
                        role: ${params.data.role},
                        email: ${"\""+params.data.email+"\""},
                        name: ${"\""+params.data.name+"\""}
                    ) {
                        user {
                            id
                            name
                            status
                            role
                            permissions
                            createdAt
                            email
                        }
                        errors {
                            field
                            message
                        }
                    }
                }
            `}).then((result)=>{
                console.log(result);
                return {data:result.data.createUser.user};
            })
        }
        return Promise.resolve();
    },
    update:(resource:string, params:UpdateParams):Promise<any> => {
        console.log(params);
        if(resource==="User"){
            return client.mutate({mutation:
                gql`
                    mutation {
                        updateUser(
                            id: ${params.data.id}, 
                            name:${"\""+params.data.name+"\""},
                            email:${"\""+params.data.email+"\""},
                            permissions: [${params.data.permissions}], 
                            role: ${params.data.role}, 
                            status: ${params.data.status}) {
                            user {
                                id,
                                name,
                                email,
                                createdAt,
                                status,
                                permissions,
                                role
                            }
                            errors {
                                field
                                message
                            }
                        }
                    }
                `
            }).then((result)=>{
                console.log(result);
                return {data:result.data.updateUser.user};
            },(err)=>{return Promise.reject(err)});
        }
        return Promise.resolve();
    },
    updateMany: (resource:string, params:UpdateManyParams):Promise<any> => Promise.resolve(),
    delete:(resource:string, params:DeleteParams):Promise<any> => {
        return client.mutate({mutation:gql`
            mutation{
                deactivateManyUsers(ids:[${params.id}]){
                        id,
                        name,
                        email,
                        status,
                        permissions,
                        role,
                        createdAt,
                    }
                }`
            }
        ).then((result)=>{return {data:result.data.deactivateManyUsers[0]}})
    },
    deleteMany: (resource:string, params:DeleteManyParams):Promise<any> =>{
        console.log(params)
        return client.mutate({mutation:gql`
            mutation{
                deactivateManyUsers(ids:[${params.ids}]){
                        id,
                        name,
                        email,
                        status,
                        permissions,
                        role,
                        createdAt,
                    }
                }`
            }
        ).then((result)=>{return {data:result.data.deactivateManyUsers}})
    }
}

export default dataProvider;