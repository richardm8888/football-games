import { Builder, Parser, parseString } from 'xml2js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from "@vercel/postgres";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(
  request: any,
  response: any
) {;
    const { body } = request;
    let currentUrls: any = [];
    const xml = fs.readFileSync(__dirname + '/sitemap_template.xml');
    let result: any = await parseXml(xml);
    currentUrls = result.urlset.url;

    const client = createClient();
    client.connect();

    const { rows } = await client.query(`SELECT * FROM sitemap WHERE loc = $1`, [body?.data?.slug]);

    if (rows.length === 0) {
        let url = body?.data?.slug;
        if (body?.data.__typename === 'Article') {
            url = `/${(body?.data?.category?.slug ?? '')}/${url}`;
        }
        await client.query(`INSERT INTO sitemap (loc, lastmod, priority) VALUES ($1, $2, $3)`, [body?.data?.slug, body?.data.updatedAt, 0.8]);
        rows.push({ loc: body?.data?.slug, lastmod: body?.data.updatedAt, changefreq: 'daily', priority: 0.8 });
    }

    client.end();

    result.urlset.url = rows;
    const builder = new Builder();
    const newxml = builder.buildObject(result);
   
    return response.status(200).json({ new: newxml, slug: body?.data.slug, type: body?.data.__typename, updated_at: body?.data.updatedAt });
}


async function parseXml(xml: Buffer) {
    const parser = new Parser();
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
