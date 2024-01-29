export const generateEmojiGrid = (gameData: any, submittedGuesses: any) => {
  const wordToDifficultyMap: any = {};
  const tiles = getEmojiTiles();

  const numCategories = gameData.length;
  const allWords = [];
  for (let i = 0; i < numCategories; i++) {
    allWords.push(gameData[i].words);

    let difficulty = gameData[i].difficulty;
    gameData[i].words.map(
      (word: string) => (wordToDifficultyMap[word] = difficulty)
    );
  }

  const allEmojiRowsArray: any = [];

  for (let i = 0; i < submittedGuesses.length; i++) {
    const submittedGuess = submittedGuesses[i];

    let wordDifficultiesArray = submittedGuess.split(',').map(
      (word: string) => wordToDifficultyMap[word]
    );

    const emojiRowForGuess = wordDifficultiesArray
      .map((wordDifficulty: number) => {
        switch (wordDifficulty) {
          case 1:
            return tiles[0];
          case 2:
            return tiles[1];
          case 3:
            return tiles[2];
          case 4:
            return tiles[3];
        }
      })
      .join("");

    allEmojiRowsArray.push(emojiRowForGuess);
  }

  return allEmojiRowsArray;
};

export function getEmojiTiles() {
  let tiles = [];
  tiles.push("🟩");
  tiles.push("🟨");
  tiles.push("🟪");
  tiles.push("🟦");
  return tiles;
}
