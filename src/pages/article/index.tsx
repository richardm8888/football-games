import * as React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@apollo/client';
import Markdown from 'react-markdown'

import { getArticle } from '../../queries/blog';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    const params = useParams();
    const {loading, data, error} = useQuery(getArticle, {
        variables: {
            slug: params?.slug
        }
    });

    if (loading || error) {
        return null;
    }

    if (!data.article) {
        navigate('/');
    }

    if (params?.category) {
        if (data.article.category?.slug ?? '' != params?.category ?? '') {
            navigate(`/${data.article.category?.slug ?? ''}/${params?.slug}`);
        }
    }

    return (
        <>
            <h2>{data.article.title}</h2>

            <Markdown>{data.article.content.markdown}</Markdown>
        </>
    );
}