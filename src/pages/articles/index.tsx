import * as React from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { ArticlePageLayout, ArticleContent, Categories } from './styles';

import { getArticles, getCategories, getLatest } from '../../queries/blog';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    const params = useParams();
    const {loading, data, error} = useQuery(getArticles, {
        variables: {
            slug: params.category == 'blog' ? null : params.category
        }
    });

    const {loading: latestLoading, data: latestData, error: latestError} = useQuery(getLatest);
   

    const {loading: catLoading, data: catData, error: catError} = useQuery(getCategories, {
        variables: {
            slug: params.category == 'blog' ? null : params.category
        }
    });
    
    if (loading || error) {
        return null;
    }

    if (!data.articles) {
        navigate('/');
    }

    return (
        <ArticlePageLayout>
            <ArticleContent>
                <Typography variant="h5">{"Articles"}</Typography>
                {params.category === 'blog' && latestData?.articles.map((article: any) => {
                    return (
                        <Link to={`/${article?.category ? article.category.slug + '/' : ''}${article.slug}`}>{article.title}</Link>
                    );
                })}

                
                {params.category !== 'blog' && data?.articles.map((article: any) => {
                    return (
                        <Link to={`/${article.category.slug}/${article.slug}`}>{article.title}</Link>
                    );
                })}
            </ArticleContent>

            <Categories>
                {params.category !== 'blog' && <Typography variant="h5">{"Latest"}</Typography>}
                {params.category !== 'blog' && latestData?.articles.map((article: any) => {
                    return (
                        <Link to={`/${article?.category ? article.category.slug + '/' : ''}${article.slug}`}>{article.title}</Link>
                    );
                })}

                <Typography variant="h5">{"Categories"}</Typography>
                {catData?.categories.map((subCategory: any) => {
                    return (
                        <Link to={`/${subCategory.slug}`}>{subCategory.title}</Link>
                    );
                })}
            </Categories>          
        </ArticlePageLayout>
    );
}
