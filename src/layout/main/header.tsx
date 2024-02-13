import * as React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';  

import HeaderLeaderboard from '../../components/Advert/HeaderLeaderboard';

import styled from '@emotion/styled';

const StyledSelect = styled(Select)`
    height: 40px;
    background-color: ${props => props.theme.palette.background.paper};
    font-size: 12px;
    
    & .MuiOutlinedInput-notchedOutline {
        display: none;
    }
`;

const Logo = styled.img`

    height: 60px;
    width: 200px;
    position: absolute;
    left: calc(50% - 100px);
    text-align: center;
    cursor: pointer;

    @media (max-width: 380px) {
        left: calc(50% - 100px - 32px);
        width: 180px;
        height: 54px;
    }
`;

const StyledAppBar = styled(AppBar)<{ isHome: boolean }>`
    height: ${props => props.isHome ? '0' : '130'}px;
    box-shadow: none;

    @media (min-width: 728px) {
        height: ${props => props.isHome ? '0' : '170'}px;
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
        <StyledAppBar isHome={location.pathname == '/'} color="transparent" position="static">
            {location.pathname !== '/' && (
                <HeaderLeaderboard advert={{ adUnit: 'difficulty-select', advertId: 'header-leaderboard' }} />
            )}
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
                {location.pathname !== '/' && (
                    <Logo 
                        onClick={() => navigate('/')} 
                        src="/logo.jpg" 
                        title="Football Connect" 
                        alt="Football Connect"
                    />
                )}
                <div style={{ display: 'flex', gap: '16px'}}>
                    {actionButton}
                </div>
            </Toolbar>
        </StyledAppBar>
    );
}
