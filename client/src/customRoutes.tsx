import React from 'react';
import { Route } from 'react-router-dom';
import AccountVerify from './components/AccountVerify';
import MyRegisterPage from './components/MyRegisterPage';
import ResendEmail from './components/ResendEmail';

const customRoutes = [
    <Route exact path="/register" component={MyRegisterPage} noLayout/>,
    <Route exact path="/verify-account/:token" component={AccountVerify} noLayout/>,
    <Route exact path="/resend-email" component={ResendEmail} noLayout/>
];


export default customRoutes;