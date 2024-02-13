import * as React from 'react';
import { useLocation } from "react-router-dom";
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Header from './header';
import Footer from './footer';
import Nav from './nav';

const ContentContainer = styled.div<{ isHome: boolean }>`
    min-height: calc(100vh - ${props => props.isHome ? '90' : '160'}px);
    padding: 0;
    width: 100%;
`;

export default function ({ children }: { children: React.ReactElement }) {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Header toggleDrawer={toggleDrawer} />
            <Nav open={drawerOpen} toggleDrawer={toggleDrawer} />
            <ContentContainer isHome={location.pathname == '/'}>
                { children }
            </ContentContainer>
            <Footer />
        </Box>
    );
}
