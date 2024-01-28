import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function () {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "primary.light", padding: 5 }}>
            <Typography variant="body2">&copy; 2024 Football Connect</Typography>
            <Typography variant="body2">
                <Link to="/about-us">About us</Link>
                {" | "}
                <Link to="/privacy-policy">Privacy Policy</Link>
            </Typography>
        </Container>
    );
}