import * as React from 'react';

import styled from '@emotion/styled';

const AdvertContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0;
`;

const StyledAdvert = styled.div<{ height: number, width: number }>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    margin: 0 auto;
`;

export default function ({ advert }: { advert: any }) {
    const [height, setHeight] = React.useState(0);
    const [width, setWidth] = React.useState(0);
    const [sizes, setSizes] = React.useState<Array<number[]>>([]);
    
    React.useEffect(() => {
        if (sizes.length > 0) {
            setHeight(sizes[0][1] ?? 0);
            setWidth(sizes[0][0] ?? 0);
        }

        googletag.cmd.push(function() {
            if (sizes.length > 0) {
                let adUnit = googletag
                    .pubads()
                    .getSlots()
                    .filter((slot: any) => {
                        return slot.getSlotId().getDomId() == advert.advertId;
                    })[0];
                if (!adUnit) {
                    const slot = googletag.defineSlot('/23061355960/' + advert.adUnit, sizes, advert.advertId);
                    slot.addService(googletag.pubads());
                    googletag.display(advert.advertId);
                    googletag.pubads().refresh([slot]);
                }
            }
        });

        return () => {
            googletag.cmd.push(function() {
                googletag.destroySlots(['/23061355960/' + advert.adUnit]);
            });
        }
    }, [sizes]);

    React.useEffect(() => {
        if (advert.size) {
            let newSizes = advert.size.map((size: string) => {
                switch(size) {
                    case 'MPU':
                        return [300, 250];
                    case 'HPU':
                        return [300, 600];
                    case 'Leaderboard':
                        return [728, 90];
                    default:
                        return null;                        
                }
            });
            setSizes(newSizes);
        }
    }, [advert.size]);


    return (
        <AdvertContainer>
            <StyledAdvert 
                key={'content-block-' + advert.advertId}
                id={advert.advertId}
                height={height}
                width={width}
            ></StyledAdvert>
        </AdvertContainer>
    );
}
