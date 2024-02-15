import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { getCategories } from '../../queries/blog';

import styled from '@emotion/styled';

export const Categories = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
    align-items: flex-end;
    width: 200px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        padding: 16px;
    }
    @media (max-width: 450px) {
        justify-content: center;
    }
`;

export const Category = styled(Card)`
    width: 200px;
`;

export default function ({ categorySlug }: { categorySlug?: string|null }) {
    const navigate = useNavigate();

    const {loading: catLoading, data: catData, error: catError} = useQuery(getCategories, {
        variables: {
            slug: categorySlug ?? null,
            nCategories: 4
        }
    });

    if (catLoading || catError) {
        return null;
    }

    return (
        <Categories>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', width: '100%' }}>Explore more topics</Typography>
            {catData?.categories.map((subCategory: any) => {
                const width = 200;
                const height = 115;
                return (
                    <Category 
                        onClick={() => {
                            navigate(`/${subCategory.slug}`);
                        }}
                    >
                        <CardActionArea>
                            <CardMedia
                                sx={{ height, width, margin: '0 auto'}}
                                component="img"
                                image={subCategory?.image?.url ?? 'https://fakeimg.pl/200x115?text=Loading&font=bebas'}
                                title={subCategory?.image?.fileName ?? 'Placeholder'}
                            />
                            <CardContent sx={{ padding: 1 }}>
                                <Typography gutterBottom variant="subtitle2" sx={{ textAlign: 'center', margin: 0 }}>{subCategory.title} </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Category>
                );
            })}
        </Categories>
    );
}
