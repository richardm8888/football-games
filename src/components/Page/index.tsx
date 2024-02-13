import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { renderContentBlocks } from './helpers';
import { getPage } from '../../queries/page';
import styled from '@emotion/styled';
import {Helmet} from "react-helmet";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    gap: 8px;
    box-sizing: border-box;
`;  

export default function ({ slug }: { slug: string }) {
    const navigate = useNavigate();

    const {loading, data, error} = useQuery(getPage, {
        variables: {
            slug: slug
        }
    });

    return (
        <Container>

            <Helmet>
                <title>{'Football Connect - ' + data?.page?.title ?? ''}</title>
            </Helmet>
            {data?.page?.contentBlocks?.map((contentBlock: any, i: number) => {
                return renderContentBlocks(contentBlock, i, navigate);
            })}
        </Container>
    );
}
