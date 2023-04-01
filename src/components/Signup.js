import { useState, useEffect } from "react";
import { TextField, Typography} from "@mui/material";
import "../index.css";
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import { setUser } from "../store/auth/userslice";
import { setSession } from "../store/auth/sessionslice";
import { useDispatch } from 'react-redux';
import Select from '@mui/material/Select';
import { useAuth } from "../utils/context/AuthContext";
import { validate } from 'react-email-validator';
import { useNavigate } from "react-router-dom";

function Signup() {
   const [btnLoading, setbtnLoading] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [name, setName] = useState('');
   const [area, setArea] = useState('-1');
   const [aadarno, setAadarno] = useState('-1');
   const [errorColor, seterrorColor] = useState('red');
   const [errorMsg, seterrorMsg] = useState("");

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { signUp, user } = useAuth();

   useEffect(() => { 
    if(user) {
        navigate('/');
    }

   }, [user]);

   const handleSignup = async () => { 

      if(email === "" || password === ""  || name === ""  || area === '-1') {
        seterrorMsg("Please fill all the fields");
        return;
      }
      if(!validate(email)) { 
        seterrorMsg("Please enter a valid email");
        return;
      }
      setbtnLoading(true);
      const { type, userdata } = signUp({ email, password, name, area, aadarno })

      if(type === "error") {
        seterrorColor("red");
        seterrorMsg(userdata.message);
        setbtnLoading(false);
      }
      if(user) {
        console.log(userdata.user);
        console.log(userdata.session);
        dispatch(setUser(userdata.user));
        dispatch(setSession(userdata.session));
        seterrorColor("green");
        seterrorMsg("Signup successfull");
        setbtnLoading(false);
      }
  
   }

    return (
        <div className="flex-1 justify-center items-center mt-10">
            <h1 className='font-bold text-2xl'>Signup</h1>
            <Box component={"form"} noValidate autoComplete="off" 
            sx={{
                '& .MuiTextField-root': { m: 1, width: '40%' },
            }}>
                <Typography mt={5} color={errorColor}>
                    {errorMsg}
                </Typography>
                <div className="mt-5">
                    <TextField
                        required
                        label="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        required
                        label="Email"
                        width="100%"
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
                <div className="mt-5 mb-5">
                    <Select
                        label="Area"
                        value={area}
                        width="100%"
                        onChange={(e) => setArea(e.target.value)}
                    >
                        <MenuItem style={{ width: 500 }} value={'-1'}>Area</MenuItem>
                        <MenuItem value={'e5fe31f4-05e6-40a0-b634-fbf2fff86927'}>Kudlu Gate</MenuItem>
                        <MenuItem value={'60491ec0-4baf-451f-a1b2-3a0b5a3721b6'}>Bomanahalli</MenuItem>
                    </Select>
                </div>
                <LoadingButton onClick={handleSignup} loading={btnLoading} variant="contained">Signup</LoadingButton>
                <Typography mt={5}>
                    Alreay have an account? <a href="/login">Login</a>
                </Typography>
            </Box>
        </div>
    );
}

export default Signup;
