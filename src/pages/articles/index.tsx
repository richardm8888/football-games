import * as React from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { ArticlePageLayout, ArticleContent } from './styles';
import Categories from '../../components/Categories';
import {Helmet} from "react-helmet";
import Typography from '@mui/material/Typography';

import { getArticles, getCategories, getLatest } from '../../queries/blog';
import ListedArticle from '../../components/ListedArticle';
import { ucWords } from '../../utils/strings';

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
            <Helmet>
                <title>{'Football Connect - ' + ucWords(params.category ?? '')}</title>
            </Helmet>
            <ArticleContent>
                {(params.category === 'blog' || data?.articles.length == 0) && (
                    <>
                        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'center' }}>Latest articles</Typography>
                        {latestData?.articles.map((article: any) => {
                            return (
                                <ListedArticle article={article} />
                            );
                        })}
                    </>
                )}

                
                {params.category !== 'blog' && data?.articles.length > 0 && (
                    <>
                        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'center' }}>Articles for {ucWords(params.category ?? '')}</Typography>
                        {data?.articles.map((article: any) => {
                            return (
                                <ListedArticle article={article} />
                            );
                        })}
                    </>
                )}
            </ArticleContent>

            <Categories categorySlug={params.category == 'blog' ? null : params.category} />         
        </ArticlePageLayout>
    );
}
