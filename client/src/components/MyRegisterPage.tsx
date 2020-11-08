import * as React from 'react';
import { useState } from 'react';
import { useNotify, Notification } from 'react-admin';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useRegisterMutation } from '../generated/graphql';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(3),
    },
  }));

const MyRegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const notify = useNotify();
    const [register] = useRegisterMutation();
    const history = useHistory();
    const submit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // login({ name, password }).catch((error) =>
        //     notify(error.message)
        // );
        register({variables:{
            name,
            email
        }}).then((result)=>{
            console.log(result);
            if(result.data?.register.errors){
                throw new Error(result.data?.register.errors[0].message);
            }
            notify("Please go to your email to proceed for account registration.");
            history.push("/login");
        }).catch((err)=>{notify("Failed to register user.")})
    };
    const classes = useStyles();

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
                        <TextField 
                            fullWidth 
                            label="Email" type="email"
                            name="email" size="small" variant="outlined" value={email} onChange={e => setEmail(e.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" fullWidth type="submit" variant="contained">
                        Register
                    </Button>
                </Grid>
                </Grid>
                <Button  style={{marginTop:10,textAlign:"center",textTransform:"none"}} onClick={()=>{history.push("/login");}}>
                    Have an account? Login now</Button>
            </form>
            <Notification />
        </Container>
    );
};

export default MyRegisterPage;