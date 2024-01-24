import * as React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Grid from './grid';

import Provider from './provider';


export default function ({ children }: { children?: React.ReactElement }) {
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!['easy', 'medium', 'hard'].includes(params?.difficulty ?? '')) {
            console.log('HERE I AM');
            navigate('/');
        }
    });

    return (
        <Provider difficulty={params?.difficulty ?? ''}>
            <h2>Game</h2>

            <Grid />
        </Provider>
    );
}