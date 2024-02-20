import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ShareIcon from '@mui/icons-material/Share';

import { generateEmojiGrid } from '../../utils/emoji';
import { shareStatus } from '../../utils/share';
import Typography from '@mui/material/Typography';

export default function ({ gameType, difficulty, open, setOpen, gameData, guesses }: { gameType: string, difficulty: string, open: boolean, setOpen: (open: boolean) => void, gameData: any, guesses: any }) {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState<string>('');

    const today = new Date();
    const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
    tomorrow.setHours(0,0,0,0);
    const newGame = tomorrow.getTime() - today.getTime();

    var hours = newGame/3.6e6 | 0;
    var mins  = newGame%3.6e6 / 6e4 | 0;
    
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                <Typography variant="subtitle1">{`You have successfully completed todays ${difficulty} ${gameType} game!`}</Typography>
                <Typography variant="subtitle2">{`Next ${difficulty} ${gameType} game is in ${hours} hour${hours > 1 ? 's' : ''} and ${mins} minute${mins > 1 ? 's' : ''}.`}</Typography>
            </DialogTitle>
            <DialogContent>
                {generateEmojiGrid(gameData, guesses).map((row: any, i: number) => {
                    return <Typography key={i}>{row}</Typography>
                })}
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="text" onClick={() => navigate(`/${gameType}`)}>Change difficulty</Button>
                <Button 
                    variant="contained" 
                    startIcon={<ShareIcon />}
                    onClick={() => {
                        shareStatus(
                            difficulty, 
                            gameData, 
                            guesses, 
                            () => {
                                window.gtag('event', 'share', {
                                    method: 'clipboard',
                                    content_type: 'game',
                                    item_id: difficulty,
                                });
                                setMessage('Copied to clipboard!');
                                alert('Results copied to clipboard!');
                            }, 
                            () => setMessage('Failed to share!')
                        );
                    }}
                >
                    Share Results
                </Button>
            </DialogActions>
        </Dialog>
    );
}
