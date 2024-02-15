import * as React from 'react';
import { useLocation } from "react-router-dom";
import styled from '@emotion/styled';
import isPropValid from '@emotion/is-prop-valid';
import Box from '@mui/material/Box';
import Header from './header';
import Footer from './footer';
import Nav from './nav';

const ContentContainer = styled('div', {
    shouldForwardProp: (prop) => {
        return (
            isPropValid(prop)  && !['$isHome'].includes(prop)
        );
    }
})<{ $isHome: boolean }>`
    min-height: calc(100vh - ${props => props.$isHome ? '90' : '210'}px);
    padding: 0;
    width: 100%;
    max-width: 970px;
    margin: 0 auto;

    @media (min-width: 728px) {
        min-height: calc(100vh - ${props => props.$isHome ? '90' : '250'}px);
    }
`;

const Offset = styled('div', {
    shouldForwardProp: (prop) => {
        return (
            isPropValid(prop)  && !['$isHome'].includes(prop)
        );
    }
})<{ $isHome: boolean }>`
    height: ${props => props.$isHome ? 0 : '120px'};

    @media (min-width: 728px) {
        height: ${props => props.$isHome ? 0 : '160px'};
    }
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
            <Offset $isHome={location.pathname == '/'} />
            <Nav open={drawerOpen} toggleDrawer={toggleDrawer} />
            <ContentContainer $isHome={location.pathname == '/'}>
                { children }
            </ContentContainer>
            <Footer />
        </Box>
    );
}
