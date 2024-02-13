import * as React from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { ArticlePageLayout, ArticleContent } from './styles';
import Categories from '../../components/Categories';
import {Helmet} from "react-helmet";

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
