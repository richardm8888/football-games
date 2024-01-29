import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function () {
    return (
        <Container sx={{ 
            width: '100%',
            maxWidth: '100% !important',
            height: 90, 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: "primary.light",
            margin: 0,
            padding: 0,
            color: "primary.contrastText",
        }}>
            <Typography variant="body2">&copy; 2024 Football Connect</Typography>
            <Typography variant="body2">
                <Link to="/about-us">About us</Link>
                {" | "}
                <Link to="/privacy-policy">Privacy Policy</Link>
            </Typography>
        </Container>
    );
}
