export function saveGuesses(difficulty: string, guesses: string[]) {
    localStorage.setItem('movie_guesses_' + difficulty, JSON.stringify({ date: new Date(), guesses }));
}

export function getGuesses(difficulty: string) {
    const guesses = localStorage.getItem('movie_guesses_' + difficulty);
    if (guesses) {
        const parsed = JSON.parse(guesses);
        if (new Date(parsed.date) < new Date(new Date().setHours(0,0,0,0))) {
            localStorage.removeItem('movie_guesses_' + difficulty);
            return [];
        }
        return parsed.guesses;
    } else {
        return [];
    }
}

export function saveIncorrectGuesses(difficulty: string, guesses: string[]) {
    localStorage.setItem('movie_incorrectGuesses_' + difficulty, JSON.stringify({ date: new Date(), guesses }));
}

export function getIncorrectGuesses(difficulty: string) {
    const guesses = localStorage.getItem('movie_incorrectGuesses_' + difficulty);
    if (guesses) {
        const parsed = JSON.parse(guesses);
        if (new Date(parsed.date) < new Date(new Date().setHours(0,0,0,0))) {
            localStorage.removeItem('movie_incorrectGuesses_' + difficulty);
            return [];
        }
        return parsed.guesses;
    } else {
        return [];
    }
}

export interface CorrectGuess {
    name: string, 
    items: any[], 
    color: string
}

export function saveCorrectGuesses(difficulty: string, correctGuesses: CorrectGuess[]) {
    localStorage.setItem('movie_correctGuesses_' + difficulty, JSON.stringify({ date: new Date(), guesses: correctGuesses}));
}

export function getCorrectGuesses(difficulty: string) {
    const correctGuesses = localStorage.getItem('movie_correctGuesses_' + difficulty);
    if (correctGuesses) {
        const parsed = JSON.parse(correctGuesses);
        if (new Date(parsed.date) < new Date(new Date().setHours(0,0,0,0))) {
            localStorage.removeItem('movie_correctGuesses_' + difficulty);
            return [];
        }
        return parsed.guesses;
    } else {
        return [];
    }
}
