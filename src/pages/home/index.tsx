import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    return (
        <>
            <h2>Home</h2>

            <Button onClick={() => navigate('/difficulty')} variant="contained">Play</Button>
            <Button onClick={() => navigate('/rules')} variant="outlined">Rules</Button>
        </>
    );
}