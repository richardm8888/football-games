import neo4j from 'neo4j-driver';

const URI = process.env.NEO4J_HOST || 'neo4j://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD || 'qwerty123';
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

async function getYesterdaysGame(difficulty: string = 'easy') {

    let films, actors = null;

    const { records: filmRecords } = await driver.executeQuery(
        `
        MATCH (g:MovieGame:${difficulty.toUpperCase()} WHERE g.date > date() - duration('P1D'))-[:CONTAINS_FILM]-(f:Film)
        RETURN collect(f.filmId) as filmIds
        `,
        {}
    );

    if (filmRecords.length) {
        films = filmRecords[0].get('filmIds').map((film: any) => film);
    } 

    const { records: actorRecords, summary, keys } = await driver.executeQuery(
        `
        MATCH (g:MovieGame:${difficulty.toUpperCase()} WHERE g.date > date() - duration('P3D'))-[:CONTAINS_ACTOR]-(a:Actor)
        RETURN collect(a.actorId) as actorIds
        `,
        {}
    );

    if (actorRecords.length) {
        actors = actorRecords[0].get('actorIds').map((actor: any) => actor);
    } 

    return { films, actors };
}


async function getGame(difficulty: string = 'easy') {
    const { records, summary, keys } = await driver.executeQuery(
        `
        MATCH (g:MovieGame:${difficulty.toUpperCase()} {date: date()})
        RETURN g.game_data as gameData
        `,
        {}
    );

    if (records.length) {
        return records[0].get('gameData');
    } else {
        return null;
    }
}

async function saveGame(difficulty: string, gameData: any, filmIds: string[], actorIds: string[]) {
    const { records, summary, keys } = await driver.executeQuery(
        `
        CREATE (g:MovieGame:${difficulty.toUpperCase()} {date: date(), game_data: $gameData})
        WITH g
        UNWIND $filmIds as filmId
        WITH DISTINCT filmId, g
        MATCH (f:Film {filmId: filmId})
        CREATE (g)-[:CONTAINS_FILM]->(f)
        WITH g
        UNWIND $actorIds as actorId
        WITH DISTINCT actorId, g
        MATCH (a:Actor {actorId: actorId})
        CREATE (g)-[:CONTAINS_ACTOR]->(a)`,
        { gameData: JSON.stringify(gameData), filmIds, actorIds }
    );
}



export default async function handler(request: any): Promise<any[]> {
    const difficulty = request.query['difficulty'] ?? 'easy';
    let excludedFilms: any[] = request.query['excludeFilms'] ?? [];
    const cached = await getGame(difficulty);

    if (cached) {
        return JSON.parse(cached);
    } else {
        const ydayGame = await getYesterdaysGame(difficulty);
        excludedFilms = excludedFilms.concat(ydayGame.films ?? []);
        let excludedActors: any[] = ydayGame.actors ?? [];

        let allSelectedActors: any = {};
        let game: any = {};
        let films: any[] = await getFilms(4, excludedFilms);

        console.log(films);

        let allFilmIds: string[] = films.map((film: any) => film.filmId);
        let filmIndex: number = 1;
        for(let film in films) {
            const filmId = films[film].filmId;
            const filmName = films[film].filmName;
            game[filmName] = [];
            for (let i = 0; i < 4; i++) {
                let allExcludedActors = Object.keys(allSelectedActors).concat(excludedActors);
                let excludeFilms: any[] = [];
                const actors = await lookupActorByFilm(filmId, allExcludedActors, excludeFilms);
                console.log(actors);
                if (!actors.length) {
                    request.query['excludeFilms'] = [filmId];
                    return handler(request);
                }
                const actor = actors[0];
                allSelectedActors[actor.get('a').properties.actorId] = actor.get('films').map((film: any) => film.properties.filmId);
                game[filmName].push(actor.get('a').properties.name);
                console.log(game[filmName]);
            }
            filmIndex++;
        }

        const actorsMultipleFilmsInGame: any = {};

        for (let actor of Object.keys(allSelectedActors)) {
            const filmsInGame = allSelectedActors[actor].filter((film: any) => allFilmIds.includes(film));
            if (filmsInGame.length > 1) {
                actorsMultipleFilmsInGame[actor] = filmsInGame.sort();
            }
        }

        // If there are more than 1 actor with more than 2 films in this game, check they are not the same two films
        let invalidGame = false;
        if (Object.keys(actorsMultipleFilmsInGame).length > 1) {
            for (let actor of Object.keys(actorsMultipleFilmsInGame)) {
                for (let actor2 of Object.keys(actorsMultipleFilmsInGame)) {
                    if (actor !== actor2) {
                        if (intersect(actorsMultipleFilmsInGame[actor], actorsMultipleFilmsInGame[actor2]).length > 1) {
                            invalidGame = true;
                        }
                    }
                }
            }
        }

        if (invalidGame) {
            return handler(request);
        }

        let i = 1;

        let ret: any[] = []; 
        for (const [key, value] of Object.entries(game)) {
            ret.push(
                {
                    category: key,
                    words: value,
                    difficulty: i
                }
            );
            i++;
        }

        if (ret.length < 4) {
            return handler(request);
        }

        await saveGame(difficulty, ret, allFilmIds, Object.keys(allSelectedActors));

        return ret;
    }
}


async function getFilms(numFilms: number, excludeFilms: string[] = []) {
    const { records, summary, keys } = await driver.executeQuery(
        `
        MATCH (f:Film WHERE NOT f.filmId IN $excludeFilms)-[:ACTED_IN]-(a:Actor)
        WITH f.filmId as filmId, f.name as filmName, count(a) as numActors WHERE numActors > 3 AND f.name IN ['Saving Private Ryan', 'The Matrix', 'Forrest Gump', 'Jurassic Park']
        WITH filmId, filmName, rand() as r ORDER BY r LIMIT toInteger($numFilms)
        RETURN filmId, filmName`,
        { numFilms, excludeFilms }
    );

    let films: any[] = [];
    for(let record of records) {
        films.push({
            filmId: record.get('filmId'),
            filmName: record.get('filmName')
        });
    }

    return films;
}


async function lookupActorByFilm(filmId: string, excludedActors: string[], excludedFilms: string[] = []): Promise<any[]> {   
    const { records, summary, keys } = await driver.executeQuery(
        `
            MATCH (a:Actor WHERE NOT a.actorId IN $excludedActors)-[ai:ACTED_IN]-(f:Film {filmId: $filmId})
            WITH DISTINCT a, f
            MATCH (a)-[:ACTED_IN]-(f2:Film WHERE NOT f2.filmId IN $excludedFilms)
            WITH a, collect(DISTINCT f2) as films, count(DISTINCT f2) as nFilms WHERE nFilms > 0
            RETURN a, films, rand() as r ORDER BY nFilms DESC, r LIMIT 1
        `,
        { filmId, excludedActors, excludedFilms },
    );

    if (!records.length) {
        return [];
    }

    return records;
}

function intersect(a: any[], b: any[]) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}
