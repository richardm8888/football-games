import * as React from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Header from './header';
import Footer from './footer';
import Nav from './nav';

const ContentContainer = styled.div`
    min-height: calc(100vh - 160px);
    padding: 10px 0px;
    width: 100%;
`;

export default function ({ children }: { children: React.ReactElement }) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Header toggleDrawer={toggleDrawer} />
            <Nav open={drawerOpen} toggleDrawer={toggleDrawer} />
            <ContentContainer>
                { children }
            </ContentContainer>
            <Footer />
        </Box>
    );
}
