import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import Markdown from 'react-markdown'

import { getPage } from '../../queries/page';
import Advert from '../Advert';
import Button from '@mui/material/Button';
import FootballConnect from '../Game/FootballConnect';

export default function ({ slug }: { slug: string }) {
    const navigate = useNavigate();

    const {loading, data, error} = useQuery(getPage, {
        variables: {
            slug: slug
        }
    });

    function renderContentBlock(contentBlock: any, i: number) {
        switch (contentBlock.__typename) {
            case 'Content':
                return (
                    <>
                        {contentBlock.content.map((content: string, j: number) => (
                            <div key={`content-block-${i}-${j}`}> 
                                <Markdown >{content}</Markdown>
                            </div>
                        ))}
                    </>
                );
            case 'Button':
                return (
                    <Button
                        key={'content-block-' + i}
                        onClick={() => navigate(contentBlock.url)} 
                        color={contentBlock.colour}
                        variant="contained"
                    >
                        {contentBlock.text}
                    </Button>
                );
            case 'Game':
                switch(contentBlock.gameType) {
                    case 'FootballConnect':
                        return (
                            <FootballConnect key={'content-block-' + i} difficulty={contentBlock.difficulty} />
                        );
                }
                break;
            case 'Advert':
                return (
                    <Advert key={'content-block-' + i} advert={contentBlock} />
                );
        }
        
        return null;
    }

    function renderContentBlocks(contentBlocks: any, i: number) {
        return (
            <>
                {contentBlocks?.content?.map((contentBlock: any, i: number) => {
                    return renderContentBlock(contentBlock, i);
                })}
            </>
        )
    }

    return (
        <div
            style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent:"center" ,
                alignItems: 'center',
                width: '100%',
                padding: 16,
                margin: '0 auto',
                gap: 8,
                boxSizing: 'border-box'
            }}
        >
            {data?.page?.contentBlocks?.map((contentBlock: any, i: number) => {
                return renderContentBlocks(contentBlock, i);
            })}
        </div>
    );
}
