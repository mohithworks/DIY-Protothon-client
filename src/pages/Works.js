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
import { dbInsert, dbSelect, dbSelectMulitpleEqOrder2, dbSelectOrder, dbUpdate, dbUpdateMulitpleEq } from '../services/DatabaseServices';
import { useAuth } from "../utils/context/AuthContext";
import { storageUpload } from '../services/StorageServices';

var image;

function Works() {
  const [workName, setworkName] = useState("");
  const [workDes, setworkDes] = useState("");
  const [workImg, setworkImg] = useState();
  const [btnLoading, setbtnLoading] = useState(false);
  const [workForm, setworkForm] = useState(false);
  const [volID, setvolID] = useState(null);
  const [voteLoading, setvoteLoading] = useState(false);
  const [errorColor, seterrorColor] = useState('red');
  const [errorMsg, seterrorMsg] = useState("");

  const [works, setWorks] = useState([]);

  const { user } = useAuth();
  const { user_metadata } = user;

  useEffect(() => {
    dbSelectOrder('works', '*', 'areaid', user_metadata.area, 'approvals').then((res) => {
        if(res.error) {
            console.log(res.error);
        }
        if(res.data.length === 0) {
            setworkForm(true);
            alert("No works to display")
        }
        if(res.data) {
            setWorks(res.data);
            setworkForm(false);
        }
    })
  }, [])

  const handleLoading = (msg, color) => {
    setbtnLoading(false);
    seterrorMsg(msg);
    seterrorColor(color);
  }

  const submitIssue = async () => {
    if(workName === "" || workDes === "" || !workImg) {
      seterrorMsg("Please fill all the fields");
      return;
    }
    
    setbtnLoading(true);

        const insertData = [
            {
                name: workName,
                description: workDes,
                areaid: user_metadata.area,
                createdby: user.id,
                created_at: new Date().toLocaleString(),
            },
        ];
    
        await dbInsert("works", insertData).then(async (res) => {
            if (res.error) {
                handleLoading(res.error.message, "red");
            }
            if (res.data) {
                const workid = res.data[0].id;
    
                handleLoading("Uploading Image....", "orange");
    
                const imgname = "works.jpeg";
    
                const imagepath = "public/" + user_metadata.area + "/" + workid + "/" + imgname;
    
                await storageUpload("works", imagepath, workImg).then(
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
    
                dbUpdateMulitpleEq("works", updateData, "id", workid, "createdby", user.id).then(({ error, data }) => {
                    if (error) {
                        handleLoading(error.message, "red");
                    }
                    if (data) {
                        alert("Work Posted Successfully")
                        console.log(data);
                        setWorks([data[0], ...works])
                        handleLoading("", "red");
                        setworkForm(false);
                    }
                });
            }
        });

  }
  
  const submitApprove = (issueid, approvers, approvals) => { 
    if(approvers.includes(user.id)) {
        alert("You have already approved for this issue");
      return;
    }
    const updateData = {
        approvers: [...approvers, user.id],
        approvals: approvals + 1,
    }
    setvoteLoading(true);
    dbUpdate("works", updateData, "id", issueid).then(({ error, data }) => {
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
        setvoteLoading(false);
        alert("Approved Successfully");
        window.location.reload();
      }
    });
  }

  return (
    <div>
        {
            workForm && (
            <div className="flex-1 justify-center items-center mt-10">
                <h1 className='font-bold text-2xl'>Works</h1>
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
                            onChange={(e) => setworkName(e.target.value)}
                        />
                    </div>
                    <div>
                        <TextField
                            required
                            label="Description"
                            onChange={(e) => setworkDes(e.target.value)}
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
                                setworkImg(modifiedFile);
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
            !workForm && (
            <div>
                <Button variant="contained" color="primary" onClick={() => setworkForm(true)}>Post a Work</Button>
            </div>
            )
        }
        <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-10 mt-10'> 
        {
            !workForm && works && works.map((issue) => ( 
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
                                {issue.approvals} {issue.approvals <= 1 ? 'Approval':'Approvals'}
                            </Typography>
                        </div>
                        <div>
                            {
                                (issue.createdby !== user.id) && (
                                    <LoadingButton onClick={() => submitApprove(issue.id, issue.approvers, issue.approvals)} loading={voteLoading} size="small" color="primary">
                                        Approve
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

export default Works