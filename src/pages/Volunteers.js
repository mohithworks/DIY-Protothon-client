import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { dbInsert, dbSelect, dbSelectOrder, dbUpdate, dbUpdateMulitpleEq } from '../services/DatabaseServices';
import { useAuth } from "../utils/context/AuthContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import supabaseClient from '../utils/supabaseClient';

var image;

function Volunteers() {
  const [voters, setVoters] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [voteLoading, setvoteLoading] = useState(false);
  const [volLoading, setvolLoading] = useState(false);
  const [errorColor, seterrorColor] = useState('red');
  const [volPhase, setvolPhase] = useState(true);
  const [expire, setExpire] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");

  const [issues, setIssues] = useState([]);

  const { user } = useAuth();
  const { user_metadata } = user;

  useEffect(() => {
    dbSelect("competition", "stage, stage_end_date", "id", "9077102b-6dbe-4926-a719-c0eaf690ebe7").then(async ({ error, data }) => {
        if(error) {
            console.log(error);
        }
        if(data) {
            const status = data[0].stage;
            if(status === "volunteers") {
                const endDate = new Date(data[0].stage_end_date).toLocaleString();
                const currentDate = new Date().toLocaleString();
                console.log(currentDate)
                console.log(endDate)
                if(currentDate >= endDate) {
                    dbSelect("volunteers", "*", "areaid", user_metadata.area).then((res) => {
                        if (res.error) {
                            console.log(res.error);
                        }
                        if(res.data.length !== 0) {
                            if (res.data) {
                                setExpire(true);
                                console.log(res.data)
                                setVolunteers([res.data[0]]);
                            }
                        }else {
                            setExpire(true);
                            alert("Voting Volunteers time is over")
                        }
                    });
                }else {
                    console.log("Yes")

                    const res = await supabaseClient
                    .from("issues")
                    .select("volunteers")
                    .eq("areaid", user_metadata.area)
                    .order("created_at", { ascending: true });
                    if (res.error) {
                        console.log(res.error);
                    }
                    if(res.data.length !== 0) {
                        if (res.data) {
                            console.log(res.data)
                            setExpire(false);
                            setVolunteers(res.data[0].volunteers);
                        }
                    }
                } 
            }else {
                setExpire(true);
                setvolPhase(false);
            }
            
        }
    })
  }, [])
  
  const submitVote = async (volid) => { 

    dbSelect("volunteers", "voters, votings", "id", volid).then(async (res) => { 
        if(res.error) {
            alert(res.error.message);
        }
        if(res.data.length === 0) {
            setVoters([]);
            dbInsert("volunteers", 
            {
                id: volid,
                voters: [user.id],
                votings: 1,
                areaid: user_metadata.area
            }).then(async ({ error, data }) => { 
                if(error) {
                    alert(error.message);
                }
                if(data) {
                    console.log(data);
                    setvoteLoading(false);
                    alert("Voted Successfully");
                    setVoters([user.id]);
                    window.location.reload();
                }
            })
        }
        if(res.data) {
            const votersL = res.data[0].voters;
            const votings = res.data[0].votings;

            if(votersL.includes(user.id)) {
                alert("You have already voted for this volunteer");
                return;
            }
            const updateData = [{
                id: volid,
                voters: [...votersL, user.id],
                votings: votings + 1,
                areaid: user_metadata.area
            }]
            setvoteLoading(true);
            
            dbUpdate("volunteers", updateData, 'id', volid).then(async ({ error, data }) => {
                
                if (error) {
                    alert(error.message);
                }
                if (data) {
                    console.log(data);
                    setvoteLoading(false);
                    alert("Voted Successfully");
                    setVoters([...voters, user.id]);
                    window.location.reload();
                }
            })
        }
    })
    
    
  }

  return (
    <div>
        {
            !volPhase ? (
                <div className='flex-1 justify-center items-center mt-10'>
                    <h1 className='font-bold text-2xl'>Volunteer Phase Over</h1>
                </div>
            )
            :
            (
            <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-10 mt-10'> 
                <TableContainer>
                    <Table sx={{ minWidth: 500 }}>
                        <TableHead>
                        <TableRow>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {expire === false && volunteers && volunteers.map((row, index) => (
                            <TableRow
                                key={row.volid}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">
                                <LoadingButton onClick={() => submitVote(row.id)} loading={voteLoading} size="small" color="primary">
                                                VOTE
                                </LoadingButton>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            )
        }
    </div>
  )
}

export default Volunteers