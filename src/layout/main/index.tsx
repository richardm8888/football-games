import * as React from 'react';
import Box from '@mui/material/Box';
import Header from './header';
import Nav from './nav';

export default function ({ children }: { children: React.ReactElement }) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header toggleDrawer={toggleDrawer} />
            <Nav open={drawerOpen} toggleDrawer={toggleDrawer} />
            { children }
        </Box>
    );
}