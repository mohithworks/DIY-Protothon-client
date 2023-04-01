import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import MainPage from './MainPage';
import Issues from './Issues';
import Volunteers from './Volunteers';
import Works from './Works';
import { dbSelect } from '../services/DatabaseServices';
import { useAuth } from "../utils/context/AuthContext";

function Auth() {
    
  const [tab, setTab] = useState('1');
  const [area, setArea] = useState(null);
  const [areaName, setAreaName] = useState(null);
  const [areaWallet, setareaWallet] = useState(0);

  const { user } = useAuth()

  const { user_metadata } = user;

  useEffect(() => { 
    dbSelect('areas', '*', 'id', user_metadata.area).then(({ error, data }) => { 
        if(error) {
            alert(error.message)
        } 
        if(data) { 
            console.log(data);
            setArea(data[0].id);
            setAreaName(data[0].name);
            setareaWallet(data[0].amount_wallet)
        }
    })
  }, []);
  
  if(!area && !areaName) return null;
  return (
    <div>
        <Header areaname={areaName} areawallet={areaWallet} />
        <Box>
            <TabContext value={tab}>
                <TabList onChange={(e, value) => setTab(value)} aria-label="lab API tabs example">
                    <Tab label="Home" value="1" />
                    <Tab label="Issues" value="2" />
                    <Tab label="Volunteers" value="3" />
                    <Tab label="Works" value="4" />
                </TabList>
                <TabPanel value="1"><MainPage /></TabPanel>
                <TabPanel value="2"><Issues /></TabPanel>
                <TabPanel value="3"><Volunteers /></TabPanel>
                <TabPanel value="4"><Works /></TabPanel>
            </TabContext>  
        </Box> 
    </div>
  )
}

export default Auth