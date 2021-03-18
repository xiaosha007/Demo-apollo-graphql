import * as React from 'react';
import { useState } from 'react';
import { useNotify, Notification } from 'react-admin';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useVerifyAccountMutation } from '../generated/graphql';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(3),
    },
  }));

const AccountVerify = (props) => {
    const passedToken = props.match.params.token;
    const [token, setToken] = useState(passedToken);
    const [password, setPassword] = useState('');
    const notify = useNotify();
    const [verify] = useVerifyAccountMutation();
    const history = useHistory();
    const submit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // login({ name, password }).catch((error) =>
        //     notify(error.message)
        // );
        verify({variables:{
            token,
            password
        }}).then((result)=>{
            console.log(result);
            if(result.data?.verifyAccount.errors){
                notify(result.data?.verifyAccount.errors[0].message);
                return;
            }
            notify("Verify account successfully");
            history.push("/login");
        }).catch((err)=>{notify("Failed to verify user.")})
    };
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="xs">
            <form onSubmit={submit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Password" name="password" size="small" 
                                type="password" variant="outlined" value={password}
                                onChange={e => setPassword(e.target.value)}/>
                            </Grid>
                            <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                label="Token" type="text"
                                name="token" size="small" variant="outlined" value={token} onChange={e => setToken(e.target.value)}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="secondary" fullWidth type="submit" variant="contained">
                            Verify account
                        </Button>
                    </Grid>
                </Grid>
                
            </form>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Button  style={{marginTop:10,textTransform:"none"}} onClick={()=>{history.push("/register");}}>
                        Register an account
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button  style={{marginTop:10,textTransform:"none"}} onClick={()=>{history.push("/resend-email");}}>
                        Resend verification email
                    </Button>
                </Grid>
            </Grid>
            <Notification />
        </Container>
    );
};

export default AccountVerify;