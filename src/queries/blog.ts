import { gql } from '@apollo/client';

export const getBlogPosts = gql`
    query BlogPosts {
        blogPosts {
            id
            slug
            summary
            title
            publishedAt
            updatedAt
            createdBy {
                name
            }
        }
    }  
`;

export const getArticle = gql`
    query Article ($slug: String!) {
        article (where: {slug: $slug}) {
            id
            category {
                slug
            }
            slug
            summary
            title
            content {
                markdown
            }
            publishedAt
            updatedAt
            createdBy {
                name
            }
        }
    }
  
`;

export const getCategory = gql`
    query Category ($slug: String!) {
        category (where: {slug: $slug}) {
            categories {
                slug
                title
            }
            slug
            title
        }
    }
`;