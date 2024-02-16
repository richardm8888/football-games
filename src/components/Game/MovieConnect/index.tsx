import * as React from 'react';

import Grid from './grid';
import Provider from './provider';

export default function ({ difficulty }: { difficulty: string }) {

    return (
        <Provider difficulty={difficulty}>
            <Grid difficulty={difficulty} />
        </Provider>
    )
}
