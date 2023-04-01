import React from 'react'
import { Box } from '@mui/system';
import { Container } from '@mui/material'
import { Icon, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button"
import { useAuth } from "../utils/context/AuthContext";

function MainPage() {
    const { user, signOut } = useAuth()

  return (
    <div className= "Home">
        <Container>
            <Box mt={20} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" component="div" gutterBottom>
                    Welcome {user.user_metadata.name}
                    </Typography>
                     <Typography variant="h6" component="div" gutterBottom>
                       {user.email}
                      </Typography>
                  </Box>
        </Container>
    </div>
  )
}

export default MainPage