import * as React from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { ArticlePageLayout, ArticleContent } from './styles';
import Categories from '../../components/Categories';


import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { getArticles, getCategories, getLatest } from '../../queries/blog';
import ListedArticle from '../../components/ListedArticle';

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
                {params.category === 'blog' && latestData?.articles.map((article: any) => {
                    return (
                        <ListedArticle article={article} />
                    );
                })}

                
                {params.category !== 'blog' && data?.articles.map((article: any) => {
                    return (
                        <ListedArticle article={article} />
                    );
                })}
            </ArticleContent>

            <Categories categorySlug={params.category == 'blog' ? null : params.category} />         
        </ArticlePageLayout>
    );
}
