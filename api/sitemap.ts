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
    const xml = fs.readFileSync(__dirname + '/sitemap_template.xml');
    let result: any = await parseXml(xml);

    const client = createClient();
    client.connect();

    const { rows } = await client.query(`SELECT loc, lastmod, priority FROM sitemap`);
    client.end();

    result.urlset.url = rows.map((row: any) => {
        row.loc = `https://www.football-connect.co.uk/${row.loc}`;
        row.lastmod = row.lastmod.toJSON();
        return row;
    });

    const builder = new Builder();
    const newxml = builder.buildObject(result);
   
    response.setHeader('Content-Type', 'application/xml');
    return response.status(200).send(newxml);
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
