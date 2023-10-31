import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const [emailSent, setEmailSent] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [emailMsg, setEmailMsg] = useState("")

    const { getLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const defaultTheme = createTheme();


    async function register(e) {
        setEmailSent(false)
        setEmailErr(false)
        setEmailMsg("")
        e.preventDefault();

        try {
            const registerData = {
                email: email,
                password: password,
                passwordVerify: passwordVerify,
            };

            const response = await axios.post(process.env.REACT_APP_API_URL + "/auth/", registerData);
            console.log(response)

            if(response.status === 201) {
                setEmailSent(true)
                setEmailMsg(response.data.message)
            } else {
                setEmailErr(true)
                //console.log(response.data.message)
                setEmailMsg(response.status + " " + response.data.message)
            }

        } catch (err) {
            //console.log(err)
            try {
            setEmailErr(true)
            console.log(err)
            setEmailMsg(err.response.data.message)
            } catch(err) {
                //backend not working
                setEmailErr(true)
                setEmailMsg("Not communicating with backend.")
            }
        }
    }

    return (
        <div>

            {emailSent && <Alert severity="success">{emailMsg}</Alert>}
            {emailErr && <Alert severity="error">{emailMsg}</Alert>}

            <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={register} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="verify password"
                                    label="Verify Password"
                                    type="password"
                                    id="passwordVerify"
                                    autoComplete="new-password"
                                    onChange={(e) => setPasswordVerify(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
        </div>
    );
}

export default Register;
