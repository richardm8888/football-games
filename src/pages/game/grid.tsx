import * as React from 'react';
import { animated, useSpring } from '@react-spring/web'

import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import UndoIcon from '@mui/icons-material/Undo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import styled from '@emotion/styled';

import { shuffleArray } from '../../utils/arrays';
import { GameContext } from './provider';

import { saveGuesses, getGuesses, saveCorrectGuesses, getCorrectGuesses } from './helpers';
import type { CorrectGuess } from './helpers';

const GameGridBox = styled(animated(Paper))`
    justify-content: center;
    align-items: center;
    border: none;
    box-shadow: none;
    width: 23.5%;
    max-width: 23.5%;
`;

const GameButton = styled(ToggleButton)`
    text-transform: none;
    width: 100%;
    height: 70px;
    max-height: 70px;
    border: 1px solid ${(props) => props.theme.palette.grey[300]} !important;
    border-radius: ${(props) => props.theme.shape.borderRadius}px !important;
    margin: 0 !important;
`;

const CorrectGuessContainer = styled(Container)<{color: string}>`
    display: flex;
    flex-direction: column;
    justify-content: flex-start; 
    align-items: center;
    width: 100%; 
    max-width: 100%; 
    margin: 0 auto;
    padding: ${(props) => props.theme.spacing(2)} !important;
    border: 1px solid ${(props) => props.theme.palette.grey[300]} !important;
    border-radius: ${(props) => props.theme.shape.borderRadius}px !important;
    background-color: ${(props) => props.color} !important;
    color: ${(props) => props.theme.palette.text.main} !important;
`;

export default function ({ difficulty, children }: { difficulty: string, children?: React.ReactElement }) {
    const GameData = React.useContext(GameContext);
    const [wrongGuess, setWrongGuess] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [guesses, setGuesses] = React.useState<string[]>(getGuesses(difficulty));
    const [gameState, setGameState] = React.useState<string[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [correctGuesses, setCorrectGuesses] = React.useState<CorrectGuess[]>(getCorrectGuesses(difficulty));

    const [shakeProps, shake] = useSpring(() => ({
        from: { x: 0 },
    }));

    const [guessOneAnimationProps, guessOneAnimation] = useSpring(() => ({
        from: { y: 0 },
    }));
    const [guessTwoAnimationProps, guessTwoAnimation] = useSpring(() => ({
        from: { y: 0 },
    }));
    const [guessThreeAnimationProps, guessThreeAnimation] = useSpring(() => ({
        from: { y: 0 },
    }));
    const [guessFourAnimationProps, guessFourAnimation] = useSpring(() => ({
        from: { y: 0 },
    }));

    const handleSelected = (
        event: React.MouseEvent<HTMLElement>,
        newSelections: string[],
      ) => {
        if (newSelections.length <= 4) {
            setSelectedItems(newSelections);
        }
    };

    React.useEffect(() => {
        const guessedGroups = correctGuesses.map((guess) => guess.name).flat();
        
        setGameState(shuffleArray(GameData.filter(group => !guessedGroups.includes(group.category)).map((group: any) => {
            return group.words;
        }).flat()));
    }, [GameData]);

    React.useEffect(() => {
        if (correctGuesses.length === 4) {
            setMessage('You have completed the game!');
        }
    }, [gameState]);

    const alreadyGuessed = (items: string[]) => {
        if (guesses.includes(items.sort().join(','))) {
            return true;
        } else {
            return false;
        }
    }

    const makeGuess = () => {
        if (selectedItems.length < 4) {
            setMessage('You must select 4 items');
            return;
        }

        if (alreadyGuessed(selectedItems)) {
            setMessage('You have already guessed this combination');
            return;
        }

        [guessOneAnimation, guessTwoAnimation, guessThreeAnimation, guessFourAnimation].forEach((animation, index) => {
            setTimeout(() => {
                animation.start({
                    to: [
                        { y: -5 },
                        { y: 0 },
                    ],
                    config: {
                        duration: 100,
                    },
                });
            }, index * 100);
        });

        setTimeout(() => {
            checkGuess();
        }, 1000);        
    }

    const checkGuess = () => {
        for(let category in GameData) {
            if (selectedItems.sort().join(',') === GameData[category].words.sort().join(',')) {
                const colors = ['#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5'];
                setGameState(gameState.filter((item) => !selectedItems.includes(item)));
                setSelectedItems([]);

                const newCorrectGuesses = [...correctGuesses, {name: GameData[category].category, color: colors[category], items: GameData[category].words}];
                saveCorrectGuesses(difficulty, newCorrectGuesses);
                setCorrectGuesses(newCorrectGuesses);
                return;
            }
        }

        for(let category in GameData) {
            if (selectedItems.filter(x => GameData[category].words.includes(x)).length === 3) {
                setMessage('Close. You were one away from having the correct answer.');
                break;
            }
        }

        const newGuesses = [...guesses, selectedItems.sort().join(',')];
        saveGuesses(difficulty, newGuesses,)
        setGuesses(newGuesses);
        setWrongGuess(true);
        setTimeout(() => {
            setWrongGuess(false);
        }, 1000);
    }

    React.useEffect(() => {
        if (wrongGuess) {
            shake.start({
                to: [
                    { x: -5 },
                    { x: 5 },
                    { x: -5 },
                    { x: 5 },
                    { x: -5 },
                    { x: 5 },
                    { x: -5 },
                    { x: 5 },
                    { x: 0 },
                ],
                config: {
                    duration: 50,
                },
            });
        }
    }, [wrongGuess]);

    return (
        <div
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent:"center" ,
                width: '100%',
                maxWidth: '500px',
                padding: 16,
                margin: '0 auto',
                gap: 8,
                boxSizing: 'border-box'
            }}
        >
            <Container 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent:"center" ,
                    width: '100%', 
                    maxWidth: '100%', 
                    padding: '0 !important',
                    margin: '0 auto 0 auto',
                    gap: 1
                }}
            >
                {correctGuesses.map((guess) => {
                    return (
                        <CorrectGuessContainer 
                            color={guess.color}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{guess.name}</Typography>
                            <Typography variant="body2">{guess.items.join(', ')}</Typography>
                        </CorrectGuessContainer>
                    )
                })}
                
                <ToggleButtonGroup
                    value={selectedItems}
                    onChange={handleSelected}
                    sx={{ 
                        flexWrap: "wrap",
                        gap: '8px 2%'
                    }}
                >
                    {gameState.map((value, index) => {
                        let animation = {};
                        if (selectedItems.includes(value)) {
                            const guessAnimationProps = [guessOneAnimationProps, guessTwoAnimationProps, guessThreeAnimationProps, guessFourAnimationProps][selectedItems.indexOf(value)];
                            animation = wrongGuess ? shakeProps : guessAnimationProps;
                        }
                        return (
                            <GameGridBox style={animation}>
                                <GameButton value={value} aria-label={value} >
                                    {value}
                                </GameButton>
                            </GameGridBox>
                        )
                    })}
                </ToggleButtonGroup>
            </Container>

            <Container 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-start', 
                    gap: 2, 
                    width: '100%', 
                    maxWidth: '100%', 
                    margin: '0 auto',
                    padding: '0 !important'
                }}
            >
                <Typography variant="body2">Mistakes remaining:</Typography>
                {Array(5 - guesses.length).fill(0).map(() => <SportsSoccerIcon />)}
            </Container>

            <Container 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    gap: 2, 
                    width: '100%', 
                    maxWidth: '100%', 
                    margin: '0 auto',
                    padding: '0 !important',
                    position: 'relative'
                }}
            >

                <Snackbar
                    open={message.length > 0}
                    autoHideDuration={2000}
                    message={message}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{ position: 'absolute' }}
                    onClose={() => setMessage('')}
                />

                <Button
                    startIcon={<ShuffleIcon />}
                    onClick={() => {
                        setGameState(shuffleArray(gameState));
                    }} 
                    variant="outlined"
                >
                    Shuffle
                </Button>

                <Button
                    startIcon={<UndoIcon />}
                    onClick={() => {
                        setSelectedItems([]);
                    }} 
                    variant="outlined"
                >
                    Deselect all
                </Button>

                <Button 
                    startIcon={<PlayArrowIcon />}
                    onClick={makeGuess} 
                    variant="contained"
                >
                    Submit
                </Button>
            </Container>
        </div>
    );
}
