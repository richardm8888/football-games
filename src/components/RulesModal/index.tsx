import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useQuery } from '@apollo/client';
import Markdown from 'react-markdown'

import { getArticle } from '../../queries/blog';
import { renderContentBlocks } from '../../components/Page/helpers';

export default function ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const navigate = useNavigate();
    const {loading, data, error} = useQuery(getArticle, {
        variables: {
            slug: 'rules'
        }
    });
    
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                {data?.article?.content2?.map((contentBlock: any, i: number) => {
                    return renderContentBlocks(contentBlock, i, navigate);
                })}
                
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="text" 
                    onClick={() => {
                        setOpen(false)
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
