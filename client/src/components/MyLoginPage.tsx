import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useLoginMutation } from '../generated/graphql';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(3),
    },
  }));

const MyLoginPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();
    const [loginMutation] = useLoginMutation();
    const history = useHistory();
    const submit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login({ name, password, loginMutation}).catch((error) =>
            notify(error.message)
        );
    };
    const classes = useStyles();
    const toRegister=()=>{history.push("/register");};

    return (
        <Container className={classes.container} maxWidth="xs">
            <form onSubmit={submit}>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            label="Username" 
                            name="username" size="small" variant="outlined" value={name} onChange={e => setName(e.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Password" name="password" size="small" 
                        type="password" variant="outlined" value={password}
                        onChange={e => setPassword(e.target.value)}/>
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" fullWidth type="submit" variant="contained">
                        Login
                    </Button>
                </Grid>
                </Grid>
            </form>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Button style={{textTransform:"none"}} onClick={toRegister}>
                        Register an account?</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button  style={{textTransform:"none"}} onClick={()=>{history.push("/verify-account/YOUR_TOKEN")}}>
                            Verify your account?</Button>
                </Grid>
            </Grid>
            <Notification />
        </Container>
    );
};

export default MyLoginPage;