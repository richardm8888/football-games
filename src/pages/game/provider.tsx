import * as React from 'react';

import mock from './mock.json';

export const GameContext = React.createContext<any[]>([]);

export default function ({ difficulty, children }: { difficulty: string, children?: React.ReactElement[] }) {
    // TODO useEffect on difficulty to look up via api
    return (
        <GameContext.Provider value={mock.GameData}>
            {children}
        </GameContext.Provider>
    );
}