import * as React from 'react';
import { animated, useSpring } from '@react-spring/web'

import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import TheatersIcon from '@mui/icons-material/Theaters';
import MovieIcon from '@mui/icons-material/Movie';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import UndoIcon from '@mui/icons-material/Undo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShareIcon from '@mui/icons-material/Share';

import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import styled from '@emotion/styled';

import { shuffleArray } from '../../../utils/arrays';
import { GameContext } from './provider';

import { saveGuesses, getGuesses, saveCorrectGuesses, getCorrectGuesses, getIncorrectGuesses, saveIncorrectGuesses } from './helpers';
import type { CorrectGuess } from './helpers';

import SuccessModal from '../../SuccessModal';
import FailModal from '../../FailModal';
import RulesModal from '../../RulesModal';

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
    font-size: 12px;
    line-height: 20px;
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
    const colors = ['#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5'];

    const GameData = React.useContext(GameContext);
    const [failure, setFailure] = React.useState<boolean>(false);
    const [rulesOpen, setRulesOpen] = React.useState<boolean>(false);
    const [successOpen, setSuccessOpen] = React.useState<boolean>(false);
    const [failureOpen, setFailureOpen] = React.useState<boolean>(false);
    const [wrongGuess, setWrongGuess] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [guesses, setGuesses] = React.useState<string[]>(getGuesses(difficulty));
    const [incorrectGuesses, setIncorrectGuesses] = React.useState<string[]>(getIncorrectGuesses(difficulty));
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
        if (GameData.length > 0) {
            const newIncorrectGuesses = getIncorrectGuesses(difficulty);
            setGuesses(getGuesses(difficulty));
            setIncorrectGuesses(newIncorrectGuesses);
            setCorrectGuesses(getCorrectGuesses(difficulty));
            if (newIncorrectGuesses.length == 5) {
                setFailureOpen(true);
                setGameState([]);
                setFailure(true);
            } else {
                const guessedGroups = correctGuesses.map((guess) => guess.name).flat();
                
                setGameState(shuffleArray(GameData.filter(group => !guessedGroups.includes(group.category)).map((group: any) => {
                    return group.words;
                }).flat()));
            }
        }
    }, [GameData]);

    React.useEffect(() => {
        if (incorrectGuesses.length == 5) {
            setFailureOpen(true);
            setGameState([]);
            setFailure(true);
        }
    }, [incorrectGuesses]);

    const alreadyGuessed = (items: string[]) => {
        if (incorrectGuesses.includes(items.sort().join(','))) {
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
        const newGuesses = [...guesses, selectedItems.sort().join(',')];
        setGuesses(newGuesses);
        saveGuesses(difficulty, newGuesses);

        for(let category in GameData) {
            if (selectedItems.sort().join(',') === GameData[category].words.sort().join(',')) {
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

        const newIncorrectGuesses = [...incorrectGuesses, selectedItems.sort().join(',')];
        saveIncorrectGuesses(difficulty, newIncorrectGuesses)
        setIncorrectGuesses(newIncorrectGuesses);
        setWrongGuess(true);
        setTimeout(() => {
            setWrongGuess(false);
        }, 1000);
    }

    React.useEffect(() => {
        if (correctGuesses.length == 4) {
            setSuccessOpen(true);
        }
    }, [correctGuesses]);

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
                maxWidth: '100%',
                padding: 16,
                margin: '0 auto',
                gap: 24,
                boxSizing: 'border-box'
            }}
        >
            <SuccessModal difficulty={difficulty} open={successOpen} setOpen={setSuccessOpen} gameData={GameData} guesses={guesses} />
            <FailModal difficulty={difficulty} open={failureOpen} setOpen={setFailureOpen} gameData={GameData} guesses={guesses} />
            <RulesModal open={rulesOpen} setOpen={setRulesOpen} />
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
                {failure ? (
                    <>
                    {GameData.map((group: any, index: number) => {
                        return (
                            <CorrectGuessContainer 
                                color={colors[index]}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{group.category}</Typography>
                                <Typography variant="body2">{group.words.join(', ')}</Typography>
                            </CorrectGuessContainer>
                        );
                    })}
                    </>
                ): (
                    <>
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
                    </>
                )}
                
            </Container>

            {!failure && correctGuesses.length < 4 && (
                <Container 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%', 
                        maxWidth: '100%', 
                        margin: '0 auto',
                        padding: '0 !important'
                    }}
                >
                    <Typography variant="body2">Mistakes remaining:</Typography>
                    <div 
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 8,
                        }}
                    >
                        {Array(5 - incorrectGuesses.length).fill(0).map(() => <TheatersIcon />)}
                    </div>
                </Container>
            )}

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

                {!failure && correctGuesses.length < 4 && (
                    <>
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
                            Clear
                        </Button>

                        <Button 
                            startIcon={<PlayArrowIcon />}
                            onClick={makeGuess} 
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </>
                )}
            </Container>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                <Button
                    startIcon={<StickyNote2Icon />}
                    onClick={() => {
                        setRulesOpen(true);
                    }} 
                    variant="text"
                >
                    Rules
                </Button>

                {(correctGuesses.length == 4 || incorrectGuesses.length == 5) && (
                    <Button
                        startIcon={<ShareIcon />}
                        onClick={() => {
                            if (correctGuesses.length == 4) {
                                setSuccessOpen(true);
                            } else {
                                setFailureOpen(true);
                            }
                        }} 
                        variant="text"
                    >
                        Share Results
                    </Button>
                )}
            </div>
        </div>
    );
}
