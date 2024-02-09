import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { renderContentBlocks } from './helpers';
import { getPage } from '../../queries/page';

export default function ({ slug }: { slug: string }) {
    const navigate = useNavigate();

    const {loading, data, error} = useQuery(getPage, {
        variables: {
            slug: slug
        }
    });

    return (
        <div
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent:"center" ,
                alignItems: 'center',
                width: '100%',
                margin: '0 auto',
                gap: 8,
                boxSizing: 'border-box'
            }}
        >
            {data?.page?.contentBlocks?.map((contentBlock: any, i: number) => {
                return renderContentBlocks(contentBlock, i, navigate);
            })}
        </div>
    );
}
