import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';

import { generateEmojiGrid } from '../../utils/emoji';
import { shareStatus } from '../../utils/share';
import Typography from '@mui/material/Typography';

export default function ({ difficulty, open, setOpen, gameData, guesses }: { difficulty: string, open: boolean, setOpen: (open: boolean) => void, gameData: any, guesses: any }) {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState<string>('');
    
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Success!</DialogTitle>
            <DialogContent>
                <p>You have successfully completed the game!</p>
                {generateEmojiGrid(gameData, guesses).map((row: any, i: number) => {
                    return <Typography key={i}>{row}</Typography>
                })}
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="text" onClick={() => navigate('/difficulty')}>Change difficulty</Button>
                <Button 
                    variant="contained" 
                    onClick={() => {
                        shareStatus(
                            difficulty, 
                            gameData, 
                            guesses, 
                            () => setMessage('Copied to clipboard!'), 
                            () => setMessage('Failed to share!')
                        );
                    }}
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
}