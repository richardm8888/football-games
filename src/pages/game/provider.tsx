import * as React from 'react';

import mock from './mock.json';

export const GameContext = React.createContext<any[]>([]);

export default function ({ difficulty, children }: { difficulty: string, children?: React.ReactElement | React.ReactElement[] }) {
    const [gameData, setGameData] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/game?difficulty=" + difficulty)
            .then(res => res.json())
            .then(
                (result) => {
                    
                    setGameData(result.GameData);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                }
            );
    }, [difficulty]);

    return (
        <GameContext.Provider value={gameData}>
            {children}
        </GameContext.Provider>
    );
}
