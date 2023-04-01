import { useState, useEffect } from "react";
import { TextField, Typography} from "@mui/material";
import "../index.css";
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/context/AuthContext";
import { setUser } from "../store/auth/userslice";
import { setSession } from "../store/auth/sessionslice";
import { useDispatch } from 'react-redux';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorColor, seterrorColor] = useState('red');
    const [errorMsg, seterrorMsg] = useState("");
    const [btnLoading, setbtnLoading] = useState(false);
   
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { signIn, user } = useAuth();
 
    useEffect(() => { 
     if(user) {
         navigate('/');
     }
 
    }, [user]); 

    const handleSignin = async () => { 
 
       if(email === "" || password === "" ) {
         seterrorMsg("Please fill all the fields");
         return;
       }
       setbtnLoading(true);
       const { error, data: {session, user} } = await signIn({ email, password })
 
       if(error) {
         seterrorColor("red");
         seterrorMsg(error.message);
         setbtnLoading(false);
       }
       if(user) {
         console.log(user);
         console.log(session);
         dispatch(setUser(user));
         dispatch(setSession(session));
         setbtnLoading(false);
       }
   
    }


  return (
    <div className="flex-1 justify-center items-center mt-10">
        <h1 className='font-bold text-2xl'>Login</h1>
        <Box component={"form"} noValidate autoComplete="off" 
        sx={{
            '& .MuiTextField-root': { m: 1 },
        }}>
            <Typography mt={5} color={errorColor}>
                {errorMsg}
            </Typography>
            <div className="mt-5">
                <TextField
                    required
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <TextField
                    required
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <LoadingButton onClick={handleSignin} loading={btnLoading} variant="contained">Login</LoadingButton>
            <Typography mt={5}>
                Don't have an account? <a href="/signup">Register</a>
            </Typography>
        </Box>
    </div>
  );
}

export default Login;
