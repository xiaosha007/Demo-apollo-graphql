import * as React from 'react';
import { useLogout } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import { useApolloClient } from '@apollo/client';

const MyLogoutButton = ((props) => {
    const logout = useLogout();
    const handleClick = () => logout(client,"/login");
    const client = useApolloClient();
    return (
        <MenuItem onClick={handleClick}>
            <ExitIcon /> Logout
        </MenuItem>
    );
});

export default MyLogoutButton;