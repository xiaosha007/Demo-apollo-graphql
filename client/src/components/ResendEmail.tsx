import * as React from 'react';
import { useState } from 'react';
import { useNotify, Notification } from 'react-admin';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useResendEmailMutation } from '../generated/graphql';


const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(3),
    },
  }));

const ResendEmail = (props) => {
    const [email, setEmail] = useState("");
    const notify = useNotify();
    const [resendEmail] = useResendEmailMutation();
    const submit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resendEmail({variables:{
            email
        }}).then((result)=>{
            console.log(result);
            if(result.data?.resendVerificationEmail.errors){
                notify(result.data?.resendVerificationEmail.errors[0].message);
                return;
            }
            notify(`Sent to ${result.data?.resendVerificationEmail.user?.email}. Please check it.`);
        }).catch((err)=>{notify("Failed to resend email.")})
    };
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="xs">
            <form onSubmit={submit}>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Email" name="email" size="small" 
                            type="email" variant="outlined" value={email}
                            onChange={e => setEmail(e.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button color="secondary" fullWidth type="submit" variant="contained">
                        Resend email
                    </Button>
                </Grid>
                </Grid>
            </form>
            <Notification />
        </Container>
    );
};

export default ResendEmail;