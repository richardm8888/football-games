import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    return (    
        <>
            <h2>Difficulty</h2>

            <Button onClick={() => navigate('/difficulty/easy')} variant="contained">Easy</Button>
            <Button onClick={() => navigate('/difficulty/medium')} variant="contained">Medium</Button>
            <Button onClick={() => navigate('/difficulty/hard')} variant="contained">Hard</Button>
        </>
    );
}