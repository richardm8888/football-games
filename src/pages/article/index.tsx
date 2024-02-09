import * as React from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';

import Typography from '@mui/material/Typography';
import { renderContentBlocks } from '../../components/Page/helpers';
import { ArticlePageLayout, ArticleContent, Categories } from '../articles/styles';

import { getArticle, getCategories } from '../../queries/blog';
import Page from '../../components/Page';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    const params = useParams();

    const {loading, data, error} = useQuery(getArticle, {
        variables: {
            slug: params.slug
        }
    });

    const {loading: catLoading, data: catData, error: catError} = useQuery(getCategories, {
        variables: {
            slug: params.category
        }
    });

    if (loading || error || catLoading || catError) {
        return null;
    }

    if (!data.article) {
        navigate('/');
    }

    if (params?.category) {
        if ((data.article.category?.slug ?? '') != (params?.category ?? '')) {
            navigate(`/${data.article.category?.slug ?? ''}/${params?.slug}`);
        }
    }

    return (
        <ArticlePageLayout>
            <ArticleContent>
                {data?.article?.content2?.map((contentBlock: any, i: number) => {
                    return renderContentBlocks(contentBlock, i, navigate);
                })}
            </ArticleContent>

            {params.category !== 'about' && (
                <Categories>
                    <Typography variant="h4">{"Categories"}</Typography>
                    {catData?.categories.map((subCategory: any) => {
                        return (
                            <Link to={`/${subCategory.slug}`}>{subCategory.title}</Link>
                        );
                    })}
                </Categories>
            )}
        </ArticlePageLayout>
    );
}
