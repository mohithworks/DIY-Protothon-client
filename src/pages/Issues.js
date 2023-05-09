import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { TextField, Typography} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { dbInsert, dbSelect, dbSelectOrder, dbUpdate, dbUpdateMulitpleEq } from '../services/DatabaseServices';
import { useAuth } from "../utils/context/AuthContext";
import { storageUpload } from '../services/StorageServices';

var image;

function Issues() {
  const [issueName, setissueName] = useState("");
  const [issueType, setissueType] = useState("");
  const [issueDes, setissueDes] = useState("");
  const [issueImg, setissueImg] = useState();
  const [btnLoading, setbtnLoading] = useState(false);
  const [issueForm, setissueForm] = useState(false);
  const [voters, setVoters] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [voteLoading, setvoteLoading] = useState(false);
  const [volLoading, setvolLoading] = useState(false);
  const [errorColor, seterrorColor] = useState('red');
  const [expire, setExpire] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");

  const [issues, setIssues] = useState([]);

  const { user } = useAuth();
  const { user_metadata } = user;

  useEffect(() => {
    dbSelect("competition", "stage_end_date, stage", "id", "9077102b-6dbe-4926-a719-c0eaf690ebe7").then(({ error, data }) => {
        if(error) {
            console.log(error);
        }
        if(data) {
          console.log(data)
            const status = data[0].stage; 
            if(status === "issues") { 
              const endDate = new Date(data[0].stage_end_date).toLocaleString();
              const currentDate = new Date().toLocaleString();
              console.log(currentDate)
              console.log(endDate)
               if(currentDate >= endDate) {
                
                dbSelectOrder("issues", "*", "areaid", user_metadata.area).then((res) => {
                    if (res.error) {
                        console.log(res.error);
                    }
                    if(res.data.length !== 0) {
                        if (res.data) {
                            setExpire(true);
                            console.log(res.data)
                            setIssues([res.data[0]]);
                        }
                    }
                });
              }else {
                
                    dbSelectOrder("issues", "*", "areaid", user_metadata.area).then((res) => {
                        if (res.error) {
                            console.log(res.error);
                        }
                        if(res.data.length !== 0) {
                            if (res.data) {
                                setExpire(false);
                                setIssues(res.data);
                            }
                        }else {
                            setExpire(false);
                        }
                    });

              }
            }else {
                  setExpire(true);
            }
            
        }
    })
  }, [])

  const handleLoading = (msg, color) => {
    setbtnLoading(false);
    seterrorMsg(msg);
    seterrorColor(color);
  }

  const submitIssue = async () => {
    if(issueName === "" || issueType === "" || issueDes === "" || !issueImg) {
      seterrorMsg("Please fill all the fields");
      return;
    }
    
    setbtnLoading(true);

    dbSelect("areas", "issues_raised", "id", user_metadata.area).then(async ({ error, data }) => {
        if(error) {
            handleLoading(error.message, "red");
        }
        if(data) {
            const totalIssues = data[0].issues_raised;
            console.log(totalIssues)
            if(totalIssues >= 5) {
                handleLoading("The area's issue limit is reached", "red");
                return;
            }
            const insertData = [
                {
                    name: issueName,
                    type: issueType,
                    description: issueDes,
                    areaid: user_metadata.area,
                    createdby: user.id,
                    created_at: new Date().toLocaleString(),
                },
            ];
        
            await dbInsert("issues", insertData).then(async (res) => {
                if (res.error) {
                    handleLoading(res.error.message, "red");
                }
                if (res.data) {
                    const issueid = res.data[0].id;
        
                    handleLoading("Uploading Image....", "orange");
        
                    const imgname = "issue.jpeg";
        
                    const imagepath = "public/" + user_metadata.area + "/" + issueid + "/" + imgname;
        
                    await storageUpload("issues", imagepath, issueImg).then(
                    ({ error, publicURL }) => {
                        if (error) {
                            handleLoading(error.message, "red");
                        }
                        if (publicURL) {
                            const mainurl = publicURL.toString() + "?" + new Date().getTime();
                            image = mainurl;
                        }
                    });
                    handleLoading("Image Uploaded. Please wait....", "orange");
        
                    const updateData = {
                        image: image,
                    }
        
                    dbUpdateMulitpleEq("issues", updateData, "id", issueid, "createdby", user.id).then(({ error, data }) => {
                        if (error) {
                            handleLoading(error.message, "red");
                        }
                        if (data) {
                            alert("Issue Posted Successfully")
                            console.log(data);
                            setIssues([data[0], ...issues])
                            handleLoading("", "red");
                            setissueForm(false);
                        }
                    });
                }
            });
        }
    })

  }
  
  const submitVote = (issueid, voters, votings) => { 
    if(voters.includes(user.id)) {
        alert("You have already voted for this issue");
      return;
    }
    const updateData = {
      voters: [...voters, user.id],
      votings: votings + 1,
    }
    setvoteLoading(true);
    dbUpdate("issues", updateData, "id", issueid).then(({ error, data }) => {
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
        setvoteLoading(false);
        alert("Voted Successfully");
        setVoters([...voters, user.id]);
        window.location.reload();
      }
    });
  }

  const submitVolunteers = (issueid, volunteers) => { 
    if(volunteers.includes(user.id)) {
        alert("You have already a volunteer for this issue");
      return;
    }
    
    if(volunteers.length === 5) {
        alert("There are already 5 volunteers for this issue");
        return;
    }
    const updateData = {
      volunteers: [...volunteers,  {id: user.id, name: user_metadata.name, email: user.email}],
    }
    setvolLoading(true);
    dbUpdate("issues", updateData, "id", issueid).then(({ error, data }) => {
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
        setvolLoading(false);
        alert("Successfully Added to Volunteers");
        setVolunteers([...volunteers, user.id]);
      }
    });
  }

  return (
    <div>
        {
            issueForm && (
            <div className="flex-1 justify-center items-center mt-10">
                <h1 className='font-bold text-2xl'>Issue</h1>
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
                            label="Name"
                            onChange={(e) => setissueName(e.target.value)}
                        />
                    </div>
                    <div>
                        <TextField
                            required
                            label="Type"
                            autoComplete="current-password"
                            onChange={(e) => setissueType(e.target.value)}
                        />
                    </div>
                    <div>
                        <TextField
                            required
                            label="Description"
                            autoComplete="current-password"
                            onChange={(e) => setissueDes(e.target.value)}
                        />
                    </div>
                    <div className='mt-2'>
                        <TextField
                            required
                            type="file"
                            onChange={(e) => {
                                const modifiedFile = new File(
                                  [e.target.files[0]],
                                  "issue.jpeg",
                                  { type: "image/jpeg", lastModified: Date.now() }
                                );
                                setissueImg(modifiedFile);
                                console.log(modifiedFile)
                            }}
                        />
                    </div>
                    <LoadingButton onClick={submitIssue} loading={btnLoading} variant="contained">Post</LoadingButton>
                </Box>
            </div>
            )
        }
        {
            !issueForm && (expire === false) && (
            <div>
                <Button variant="contained" color="primary" onClick={() => setissueForm(true)}>Post an Issue</Button>
            </div>
            )
        }
        <div className='self-center gap-10 mt-10'> 
        {
            !issueForm && issues && issues.map((issue) => ( 
                <Card key={issue.id} sx={{ maxWidth: 345, maxHeight: 500 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="100"
                            image={issue.image}
                            alt="issue"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {issue.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {issue.description}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className='justify-between'>
                        <div>
                            <Typography variant="body2" color="text.secondary">
                                {issue.votings} {issue.votings <= 1 ? 'Vote':'Votes'}
                            </Typography>
                        </div>
                        <div>
                            {
                                (issue.createdby !== user.id ) && (expire === false) && (
                                    <LoadingButton onClick={() => submitVote(issue.id, issue.voters, issue.votings)} loading={voteLoading} size="small" color="primary">
                                        VOTE
                                    </LoadingButton>
                                )   
                            }
                            {
                                (expire === true) && (
                                    <LoadingButton loading={volLoading} onClick={() => submitVolunteers(issue.id, issue.volunteers)} variant="contained" size="small" color="primary">
                                        VOLUNTEER
                                    </LoadingButton>
                                )
                            }
                        </div>
                    </CardActions>
                </Card>
            ))

        }
        </div>
    </div>
  )
}

export default Issues