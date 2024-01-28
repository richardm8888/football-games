import * as React from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from '@apollo/client';

import { getCategory } from '../../queries/blog';

export default function ({ children }: { children?: React.ReactElement }) {
    const navigate = useNavigate();
    const params = useParams();
    const {loading, data, error} = useQuery(getCategory, {
        variables: {
            slug: params?.category ?? 'blog'
        }
    });
    
    if (loading || error) {
        return null;
    }

    if (!data.category) {
        navigate('/');
    }

    return (
        <>
            <h2>{data.category.title}</h2>

            {data.category.categories.map((subCategory: any) => {
                return (
                    <Link to={`/${params?.category ?? 'blog'}/${subCategory.slug}`}>{subCategory.title}</Link>
                );
            })}

        </>
    );
}