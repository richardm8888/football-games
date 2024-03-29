import getGameData from "./_generate_football.js";

export default async function handler(
  request: any,
  response: any
) {
    if (!request.url) return response.status(400);

    const GameData = await getGameData(request);

    return response.status(200).json({ GameData });
}
