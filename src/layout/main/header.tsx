import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';  

import styled from '@emotion/styled';

const StyledSelect = styled(Select)`
    height: 40px;
    background-color: ${props => props.theme.palette.background.paper};

    & .MuiOutlinedInput-notchedOutline {
        display: none;
    }
`;

export default function ({ toggleDrawer }: { toggleDrawer: () => void}) {
    const location = useLocation();
    const navigate = useNavigate();

    let actionButton = null;
    if (location.pathname.split('/').length == 3 && location.pathname.split('/')[1] == 'difficulty'){
        actionButton = (
                <StyledSelect
                    value={location.pathname.split('/')[2]}
                    label="Difficulty"
                    onChange={(event: SelectChangeEvent<unknown>) => {
                        navigate('/difficulty/' + event?.target?.value);
                    }}
                >   
                    <MenuItem value={'easy'} sx={{ backgroundColor: 'white',  }}>Easy</MenuItem>
                    <MenuItem value={'medium'}>Medium</MenuItem>
                    <MenuItem value={'hard'}>Hard</MenuItem>
                </StyledSelect>        
        )
    }
    return (
        <AppBar color="transparent" position="static" sx={{ height: 70, boxShadow: 'none' }}>
            <Toolbar sx={{ height: 70, justifyContent: 'space-between', padding: '0 10px' }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={toggleDrawer}
                >
                    <MenuIcon />
                </IconButton>
                <Typography 
                    onClick={() => navigate('/')} 
                    variant="h6" 
                    component="div" 
                    sx={{
                        position: 'absolute', 
                        left: 'calc(50% - 100px)',
                        width: 200,
                        textAlign: 'center' 
                    }}
                >
                    Football Connect
                </Typography>
                <div style={{ display: 'flex', gap: '16px'}}>
                    {actionButton}
                </div>
            </Toolbar>
        </AppBar>
    );
}
