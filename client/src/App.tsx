import { Admin, Resource } from 'react-admin';
import * as React from "react";
import {authProvider} from "./providers/authProvider";
import dataProvider from "./providers/dataProvider"
import MyLoginPage from './components/MyLoginPage';
import customRoutes from "./customRoutes";
import { ApolloProvider, } from '@apollo/client';
import MyLogoutButton from './components/MyLogoutButton';
import UserList from './components/User/UserList';
import {client} from "./utils/apolloClient"
import UserEdit from './components/User/UserEdit';
import UserCreate from './components/User/UserCreate';





const App = () => {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <Admin
                    loginPage={MyLoginPage} 
                    authProvider={authProvider} 
                    dataProvider={dataProvider} 
                    customRoutes={customRoutes}
                    logoutButton={MyLogoutButton}
                >
                    <Resource name="User" list={UserList} edit={UserEdit} create={UserCreate}/>
                </Admin>
            </div>
        </ApolloProvider>
    );
    
}

export default App;