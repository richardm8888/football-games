import neo4j from 'neo4j-driver';

const URI = process.env.NEO4J_HOST || 'neo4j://localhost:7687';
const USER = process.env.NEO4J_USER || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD || 'qwerty123';
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

async function getYesterdaysGame() {

    let clubs, players = null;

    const { records: clubRecords } = await driver.executeQuery(
        `
        MATCH (g:Game {date: date() - duration('P1D')})-[:CONTAINS_CLUB]-(c:Club)
        RETURN collect(c.clubId) as clubIds
        `,
        {}
    );

    if (clubRecords.length) {
        clubs = clubRecords[0].get('clubIds');
    } 

    const { records: playerRecords, summary, keys } = await driver.executeQuery(
        `
        MATCH (g:Game {date: date() - duration('P1D')})-[:CONTAINS_PLAYER]-(p:Player)
        RETURN collect(p.playerId) as playerIds
        `,
        {}
    );

    if (playerRecords.length) {
        players = playerRecords[0].get('playerIds');
    } 

    return { clubs, players };
}


async function getGame(difficulty: string = 'easy') {
    const { records, summary, keys } = await driver.executeQuery(
        `
        MATCH (g:Game:${difficulty.toUpperCase()} {date: date()})
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

async function saveGame(difficulty: string, gameData: any, clubIds: number[], playerIds: number[]) {
    const { records, summary, keys } = await driver.executeQuery(
        `
        CREATE (g:Game:${difficulty.toUpperCase()} {date: date(), game_data: $gameData})
        WITH g
        UNWIND $clubIds as clubId
        WITH DISTINCT clubId, g
        MATCH (c:Club {clubId: toInteger(clubId)})
        CREATE (g)-[:CONTAINS_CLUB]->(c)
        WITH g
        UNWIND $playerIds as playerId
        WITH DISTINCT playerId, g
        MATCH (p:Player {playerId: toInteger(playerId)})
        CREATE (g)-[:CONTAINS_PLAYER]->(p)`,
        { gameData: JSON.stringify(gameData), clubIds, playerIds }
    );
}



export default async function handler(request: any): Promise<any[]> {
    const difficulty = request.query['difficulty'] ?? 'easy';
    const cached = await getGame(difficulty);

    if (cached) {
        return JSON.parse(cached);
    } else {
        const ydayGame = await getYesterdaysGame();
        let excludedClubs: any[] = ydayGame.clubs ?? [];
        let excludedPlayers: any[] =ydayGame.players ?? [];
        let includedClubs: any[] = getGameClubs(difficulty);

        let allSelectedPlayers: any = {};
        let game: any = {};
        const clubs = await getClubs(includedClubs, excludedClubs);
        let allClubIds: number[] = clubs.map((club: any) => club.clubId);
        let clubIndex: number = 1;
        for(let club in clubs) {
            const clubId = clubs[club].clubId;
            const clubName = clubs[club].clubName;
            game[clubName] = [];
            for (let i = 0; i < 4; i++) {
                let allExcludedPlayers = Object.keys(allSelectedPlayers).map((playerId: string) => parseInt(playerId)).concat(excludedPlayers);
                let excludedClubs: any[] = [];
                let minClubs = 2;
                let maxClubs = 10;
                let minApps = 100 - (150 / (clubIndex + 1));
                if (clubIndex == 4) {
                    excludedClubs = allClubIds.filter(cId => cId !== clubId) ?? [];
                    minClubs = 1;
                    minApps += 100;
                } else if (clubIndex == 3) {
                    minApps += 50;
                }
                const players = await lookupPlayerByClub(clubId, allExcludedPlayers, excludedClubs, minClubs, maxClubs, minApps, includedClubs);
                const player = players[0];
                allSelectedPlayers[player.get('p').properties.playerId.low] = player.get('clubs').map((club: any) => club.properties.clubId.low);
                game[clubName].push(player.get('p').properties.name);
            }
            clubIndex++;
        }

        const playersMultipleClubsInGame: any = {};

        for (let player of Object.keys(allSelectedPlayers)) {
            const clubsInGame = allSelectedPlayers[player].filter((club: any) => allClubIds.includes(club));
            if (clubsInGame.length > 1) {
                playersMultipleClubsInGame[player] = clubsInGame.sort();
            }
        }

        // If there are more than 1 player with more than 2 clubs in this game, check they are not the same two clubs
        let invalidGame = false;
        if (Object.keys(playersMultipleClubsInGame).length > 1) {
            for (let player of Object.keys(playersMultipleClubsInGame)) {
                for (let player2 of Object.keys(playersMultipleClubsInGame)) {
                    if (player !== player2) {
                        if (intersect(playersMultipleClubsInGame[player], playersMultipleClubsInGame[player2]).length > 1) {
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

        await saveGame(difficulty, ret, allClubIds, Object.keys(allSelectedPlayers).map((playerId: string) => parseInt(playerId)));

        return ret;
    }
}


async function getClubs(includeClubs: number[] = [], excludeClubs: number[] = []) {
    const { records, summary, keys } = await driver.executeQuery(
        `
        MATCH (c:Club WHERE c.clubId IN $includeClubs AND NOT c.clubId IN $excludeClubs) 
        WITH c.clubId as clubId, c.name as clubName
        WITH clubId, clubName, rand() as r ORDER BY r LIMIT 4
        RETURN clubId, clubName`,
        { includeClubs, excludeClubs }
    );

    let clubs: any[] = [];
    for(let record of records) {
        clubs.push({
            clubId: record.get('clubId'),
            clubName: record.get('clubName')
        });
    }

    return clubs;
}


async function lookupPlayerByClub(clubId: number, excludedPlayers: number[], excludedClubs: number[] = [], minClubs: number = 1, maxClubs: number = 10, minApps: number = 50, includeClubs: number[] = []): Promise<any[]> {
    const { records, summary, keys } = await driver.executeQuery(
        `
            MATCH (p:Player WHERE NOT p.playerId IN $excludedPlayers)-[pf:PLAYED_FOR]-(ec:Club)
            WITH p, sum(pf.count) as totalPlayed WHERE totalPlayed > $minApps
            MATCH (p)-[pf:PLAYED_FOR WHERE pf.count > 10]-(c:Club {clubId: $clubId})
            WITH DISTINCT p, c
            MATCH (p)-[:PLAYED_FOR]-(c2:Club WHERE c2.clubId IN $includeClubs AND NOT c2.clubId IN $excludedClubs)
            WITH p, collect(DISTINCT c2) as clubs
            WITH p, clubs, size(clubs) as n_clubs WHERE n_clubs >= $minClubs AND n_clubs <= $maxClubs
            RETURN p, clubs, n_clubs, rand() as r ORDER BY r LIMIT 1
        `,
        { clubId, excludedPlayers, excludedClubs, minClubs, maxClubs, minApps, includeClubs },
    );

    if (!records.length) {
        return lookupPlayerByClub(clubId, excludedPlayers, excludedClubs, minClubs, maxClubs, minApps, includeClubs);
    }

    return records;
}

function intersect(a: any[], b: any[]) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}


function getGameClubs(difficulty: string = 'easy') {
    var clubs = getEnglishClubs();

    switch (difficulty) {
        case 'medium':
            clubs = clubs.concat(getSpanishClubs());
            break;
        case 'hard':
            clubs = clubs.concat(getSpanishClubs(), getItalianClubs(), getGermanClubs(), getFrenchClubs());
            break
    }
    
    return clubs;
}

function getEnglishClubs() {
    return [
        762,
        543,
        873,
        703,
        631,
        350,
        985,
        379,
        281,
        1148,
        931,
        1237,
        989,
        148,
        31,
        405,
        1132,
        29,
        11,
    ];
}

function getSpanishClubs() {
    return [
        131, // Barcelona
        418, // Real Madrid
        // 940, // Celta Vigo
        // 368, // Sevilla
        // 13, // Athletico
    ];
}

function getItalianClubs() {
    return [
        46, // Inter
        506, // Juve
        5, // AC
        // 12, // Roma
        // 398, // Lazio
        // 6195, //Napoli
    ];
}

function getFrenchClubs() {
    return [
        244, // Marseille
        583, // PSG
        1041, // OL
        162, // Monaco
    ];
}

function getGermanClubs() {
    return [
        27, // Bayern
        16 // Dortmund
    ];
}
