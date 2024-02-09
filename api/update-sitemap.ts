import getGameData from "./_generate.js";

export default async function handler(
  request: any,
  response: any
) {
    const { body } = request;
    return response.status(200).json({ slug: body?.data.slug, type: body?.data.__typename, updated_at: body?.data.updatedAt });
}
