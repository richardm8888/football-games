import * as React from 'react';

import styled from '@emotion/styled';

const AdvertContainer = styled.div`
    width: calc(100% + 48px);
    display: flex;
    justify-content: center;
    padding: 16px 0;
`;

const StyledAdvert = styled.div`
    min-width: 100%;
    min-height: 50px; 
    margin: 0 auto;
`;

export default function ({ advert }: { advert: any }) {
    React.useEffect(() => {
        googletag.cmd.push(function() {
            const sizeMapping = googletag
                .sizeMapping()
                .addSize([728, 0], [728, 90], [468, 60], [300, 250])
                .addSize([468, 0], [320, 50], [320, 100], [300, 250], [468, 60])
                .addSize([340, 0], [320, 50], [320, 100], [300, 250])
                .addSize([0, 0], [300, 250])
                .build();

            let adUnit = googletag
                .pubads()
                .getSlots()
                .filter((slot: any) => {
                    return slot.getSlotId().getDomId() == advert.advertId;
                })[0];
            if (!adUnit) {
                const slot = googletag.defineSlot('/23061355960/' + advert.adUnit, [[320, 50], [320, 100], [300, 250], [468, 60], [728, 90]], advert.advertId);
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