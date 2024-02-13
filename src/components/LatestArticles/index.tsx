import * as React from 'react';
import { useQuery } from '@apollo/client';

import { getLatest } from '../../queries/blog';
import ListedArticle from '../../components/ListedArticle';

export default function ({ children }: { children?: React.ReactElement }) {
    const {loading, data, error} = useQuery(getLatest);
   
    
    if (loading || error) {
        return null;
    }

    if (!data.articles) {
        return null;
    }

    return (
        <div style={{ display: 'flex', padding: 16, flexDirection: 'column', gap: 16 }}>           
            {data?.articles.map((article: any) => {
                return (
                    <ListedArticle article={article} />
                );
            })}
        </div>
    );
}
