import * as React from 'react';

export default function ({ advert }: { advert: any }) {
    React.useEffect(() => {
        googletag.cmd.push(function() {
            let adUnit = googletag
                .pubads()
                .getSlots()
                .filter((slot: any) => {
                    return slot.getSlotId().getDomId() == advert.advertId;
                })[0];
            if (!adUnit) {
                googletag.defineSlot('/23061355960/' + advert.adUnit, [advert.width, advert.height], advert.advertId).addService(googletag.pubads());
            }
        });

        return () => {
            googletag.cmd.push(function() {
                googletag.destroySlots(['/23061355960/' + advert.adUnit]);
            });
        }
    }, []);

    return (
        <div 
            key={'content-block-'}
            id={advert.advertId} 
            style={{
                minWidth: advert.width, 
                minHeight: advert.height, 
                margin: '0 auto'
            }}
        ></div>
    );
}
