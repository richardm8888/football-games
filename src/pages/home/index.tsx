import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    return (
        <div
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent:"center" ,
                alignItems: 'center',
                width: '100%',
                padding: 16,
                margin: '0 auto',
                gap: 8,
                boxSizing: 'border-box'
            }}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {"Correctly connect the footballers by the clubs they've played for."}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                {"There are four teams to find in each puzzle."}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                {"Each puzzle only has one solution, but beware, as some players will have played for more than 1 of the teams in the solution."}
            </Typography>

            <Button onClick={() => navigate('/difficulty')} variant="contained">Play</Button>
        </div>
    );
}
