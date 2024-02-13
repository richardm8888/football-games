import * as React from 'react';
import Markdown from 'react-markdown'
import Advert from '../Advert';
import Button from '@mui/material/Button';
import FootballConnect from '../Game/FootballConnect';
import styled from '@emotion/styled';

const Image = styled.img`
    width: 100%;
    height: auto;
    margin: 10px 0;

    @media (min-width: 768px) {
        width: 40%;
    }
`;

const ContentBlock = styled.div<{ contentBlocks: any, alignment: string }>`
    display: flex;
    flex-direction: ${props => props.contentBlocks.direction};
    justify-content: ${props => props.contentBlocks.direction == 'column' ? "center" : props.alignment};
    align-items: ${props => props.contentBlocks.direction == 'row' ? 'flex-start' : props.alignment};
    width: 100%;
    padding: 0;
    margin: 0 auto;
    gap: 16px;
    box-sizing: border-box;
    text-align: ${props => props.alignment == 'flex-start' ? 'left' : props.alignment == 'flex-end' ? 'right' : 'center'};


    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
`;

export function renderContentBlock(contentBlock: any, i: number, navigate: any) {
    switch (contentBlock.__typename) {
        case 'ContentBlock':
            return renderContentBlocks(contentBlock, i, navigate);
        case 'Content':
            return (
                <div key={`content-block-${i}`}> 
                    {contentBlock.content.map((content: string, j: number) => (
                        <div key={`content-block-${i}-${j}`}> 
                            <Markdown >{content}</Markdown>
                        </div>
                    ))}
                </div>
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
        case 'Image':
            return (
                <Image 
                    key={'content-block-' + i}
                    src={contentBlock.image[0].url}
                    alt={contentBlock.image[0].fileName}
                />
            );
    }
    
    return null;
}

export function renderContentBlocks(contentBlocks: any, i: number, navigate: any) {
    const alignment = contentBlocks.alignment == 'center' ? 'center' : 'flex-' + contentBlocks.alignment;
    return (
        <ContentBlock contentBlocks={contentBlocks} alignment={alignment} >
            {contentBlocks?.content?.map((contentBlock: any, i: number) => {
                return renderContentBlock(contentBlock, i, navigate);
            })}
        </ContentBlock>
    )
}
