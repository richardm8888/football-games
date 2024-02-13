import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@apollo/client';

import {Helmet} from "react-helmet";
import { renderContentBlocks } from '../../components/Page/helpers';
import { ArticlePageLayout, ArticleContent } from '../articles/styles';
import Categories from '../../components/Categories';

import { getArticle } from '../../queries/blog';


export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    const params = useParams();

    const {loading, data, error} = useQuery(getArticle, {
        variables: {
            slug: params.slug
        }
    });

    if (loading || error) {
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

    const contentStyle = params.category == 'about' ? { width: '100%' } : { };

    return (
        <ArticlePageLayout>
            <Helmet>
                <title>{'Football Connect - ' + data.article.title}</title>
            </Helmet>
            <ArticleContent style={contentStyle}>
                {/*<img src={data?.article?.image?.url} style={{ width: '100%' }} />*/}
                {data?.article?.content2?.map((contentBlock: any, i: number) => {
                    return renderContentBlocks(contentBlock, i, navigate);
                })}
            </ArticleContent>

            {params.category !== 'about' && (
                <Categories categorySlug={params.category ?? ''} />
            )}
        </ArticlePageLayout>
    );
}
