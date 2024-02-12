import styled from '@emotion/styled';

export const ArticlePageLayout = styled('div')`
    display: flex;
    width: 100%;
    gap: 8px;
    box-sizing: border-box;
    flex-wrap: wrap;
`;

export const ArticleContent = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    width: calc(100% - 300px);

    @media (max-width: 768px) {
        width: 100%;
    }
`;
