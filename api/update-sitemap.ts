import { Parser } from 'xml2js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from "@vercel/postgres";
import { verifyWebhookSignature } from '@hygraph/utils';
import apolloPkg from '@apollo/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { ApolloClient, InMemoryCache, gql } = apolloPkg;

export default async function handler(
  request: any,
  response: any
) {;
    const { body, headers } = request;
    let isValid = true;
    if (process.env.VERCEL_ENV !== 'development') {
        const signature = headers['gcms-signature'];
        isValid = verifyWebhookSignature({ body, signature, secret: process.env.HYGRAPH_WEBHOOK_KEY ?? '' });
    }

    if (!isValid) {
        return response.status(401).send('Unauthorized');
    }

    const apolloClient = new ApolloClient({
        uri: 'https://eu-west-2.cdn.hygraph.com/content/clrxb05v2128g01ut2nskdnz4/master',
        cache: new InMemoryCache(),
    });

    const client = createClient();
    client.connect();

    const category = body?.data?.category?.id;

    let categorySlug = '';
    if (body?.data?.__typename == 'Article') {
        const {data: categoryData, loading, error} = await apolloClient.query({
            query: gql`
                query GetCategory ($id: ID!) {
                    category(where: {id: $id}) {
                    slug
                    }
                }          
            `,
            variables: {
                id: category
            }
        });
        if (error) {
            return response.status(400);
        }
        categorySlug = categoryData.category.slug;
    }

    const categoryUrl = `${(categorySlug ? categorySlug + '/' : '/')}`;
    const url = `${(categoryUrl)}${body?.data?.slug}`;

    const { rows } = await client.query(`SELECT * FROM sitemap WHERE loc = $1`, [url]);
    if (rows.length === 0) {
        await client.query(`INSERT INTO sitemap (loc, lastmod, priority) VALUES ($1, $2, $3)`, [url, body?.data.updatedAt, 0.8]);
    } else {
        await client.query(`UPDATE sitemap SET lastmod = $1`, [body?.data.updatedAt]);
    }

    client.end();
    apolloClient.stop();
   
    return response.status(204);
}
