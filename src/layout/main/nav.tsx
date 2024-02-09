import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ArticleIcon from '@mui/icons-material/Article';
import PolicyIcon from '@mui/icons-material/Policy';
import SecurityIcon from '@mui/icons-material/Security';

import styled from '@emotion/styled';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 64
}));
  

export default function ({ open, toggleDrawer }: { open: boolean, toggleDrawer: () => void }) {
    const navigate = useNavigate();
    const drawerWidth = 300;
    return (
        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            anchor="left"
            open={open}
            onClose={() => toggleDrawer()}
        >
            <DrawerHeader>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>

            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/about/about-us');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary="About Football Connect" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/difficulty');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <PlayCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Play" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/about/rules');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <StickyNote2Icon />
                        </ListItemIcon>
                        <ListItemText primary="Rules" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/blog');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Blog" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/about/privacy-policy');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <SecurityIcon />
                        </ListItemIcon>
                        <ListItemText primary="Privacy Policy" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => {
                        navigate('/about/terms-and-conditions');
                        toggleDrawer();
                    }}>
                        <ListItemIcon>
                            <PolicyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Terms and Conditions" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}
