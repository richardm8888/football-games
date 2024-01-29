import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();

    React.useEffect(() => {
        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1706129779392-0'); });
    }, []);

    return (    
        <div
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent:"center" ,
                alignItems: 'center',
                width: '100%',
                maxWidth: '500px',
                padding: 16,
                margin: '0 auto',
                gap: 8,
                boxSizing: 'border-box'
            }}
        >
            <Typography variant="body1" sx={{ textAlign: 'center' }}>Select your difficulty:</Typography>

            <Button sx={{ width: 150 }} onClick={() => navigate('/difficulty/easy')} variant="contained">Easy</Button>
            <Button sx={{ width: 150 }} onClick={() => navigate('/difficulty/medium')} variant="contained">Medium</Button>
            <Button sx={{ width: 150 }} onClick={() => navigate('/difficulty/hard')} variant="contained">Hard</Button>

            <div id='div-gpt-ad-1706129779392-0' style={{minWidth: 300, minHeight: 250, margin: '0 auto'}}></div>
        </div>
    );
}
