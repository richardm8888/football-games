import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import styled from '@emotion/styled';

import { shuffleArray } from '../../utils/arrays';
import { GameContext } from './provider';

const GameGridBox = styled(Paper)`
    justify-content: center;
    align-items: center;
`;

export default function ({ children }: { children?: React.ReactElement }) {
    const GameData = React.useContext(GameContext);
    const [gameState, setGameState] = React.useState<string[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

    const handleSelected = (
        event: React.MouseEvent<HTMLElement>,
        newSelections: string[],
      ) => {
        if (newSelections.length <= 4) {
            setSelectedItems(newSelections);
        }
    };

    React.useEffect(() => {
        setGameState(shuffleArray(GameData.map((club: any) => {
            return club.words;
        }).flat()));
    }, [GameData]);

    return (
        <>
            <Grid container justifyContent="center" columns={4}>
                
                <ToggleButtonGroup
                    value={selectedItems}
                    onChange={handleSelected}
                    sx={{ flexWrap: "wrap"}}
                >
                    {gameState.map((value, index) => {
                        return (
                            <Grid key={index} item xs={1}>
                                <GameGridBox>
                                    <ToggleButton value={value} aria-label={value}>
                                        {value}
                                    </ToggleButton>
                                </GameGridBox>
                            </Grid>
                        )
                    })}
                </ToggleButtonGroup>
            </Grid>

            <Button 
                onClick={() => {
                    setGameState(shuffleArray(gameState));
                }} 
                variant="outlined"
            >
                Shuffle
            </Button>

            <Button 
                onClick={() => {
                    setSelectedItems([]);
                }} 
                variant="outlined"
            >
                Deselect all
            </Button>

            <Button 
                onClick={() => {
                    
                }} 
                variant="contained"
            >
                Submit
            </Button>
        </>
    );
}