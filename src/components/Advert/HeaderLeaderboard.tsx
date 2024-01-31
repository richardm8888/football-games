import * as React from 'react';

import styled from '@emotion/styled';

const AdvertContainer = styled.div`
    width: 100%;
    background-color: ${props => props.theme.palette.grey[100]};
    display: flex;
    justify-content: center;
`;

const StyledAdvert = styled.div`
    height: 60px;
    margin: 0 auto;
    padding: 5px 0;

    @media (min-width: 728px) {
        height: 100px;
    }
`;

export default function ({ advert }: { advert: any }) {
    React.useEffect(() => {
        googletag.cmd.push(function() {
            const sizeMapping = googletag
                .sizeMapping()
                .addSize([728, 0], [728, 90])
                .addSize([0, 0], [320, 50])
                .build();

            let adUnit = googletag
                .pubads()
                .getSlots()
                .filter((slot: any) => {
                    return slot.getSlotId().getDomId() == advert.advertId;
                })[0];
            if (!adUnit) {
                const slot = googletag.defineSlot('/23061355960/' + advert.adUnit, [[320, 50], [728, 90]], advert.advertId);
                slot.defineSizeMapping(sizeMapping);
                slot.addService(googletag.pubads());
                googletag.display(advert.advertId);
            }
        });

        return () => {
            googletag.cmd.push(function() {
                googletag.destroySlots(['/23061355960/' + advert.adUnit]);
            });
        }
    }, []);

    return (
        <AdvertContainer>
            <StyledAdvert 
                key={'content-block-' + advert.advertId}
                id={advert.advertId}
            ></StyledAdvert>
        </AdvertContainer>
    );
}
