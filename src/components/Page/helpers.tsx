import * as React from 'react';
import Markdown from 'react-markdown'
import Advert from '../Advert';
import Button from '@mui/material/Button';
import FootballConnect from '../Game/FootballConnect';

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
    }
    
    return null;
}

export function renderContentBlocks(contentBlocks: any, i: number, navigate: any) {
    const alignment = contentBlocks.alignment == 'center' ? 'center' : 'flex-' + contentBlocks.alignment;
    return (
        <div 
            style={{
                display: 'flex',
                flexDirection: contentBlocks.direction,
                justifyContent: contentBlocks.direction == 'column' ? "center" : alignment,
                alignItems: contentBlocks.direction == 'row' ? 'center' : alignment,
                width: '100%',
                padding: 0,
                margin: '0 auto',
                gap: 8,
                boxSizing: 'border-box',
                textAlign: alignment == 'flex-start' ? 'left' : alignment == 'flex-end' ? 'right' : 'center'
            }}
        >
            {contentBlocks?.content?.map((contentBlock: any, i: number) => {
                return renderContentBlock(contentBlock, i, navigate);
            })}
        </div>
    )
}
