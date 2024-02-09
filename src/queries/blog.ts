import { gql } from '@apollo/client';

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
            content2 {
                ... on ContentBlock {
                    id
                    direction
                    alignment
                    content {
                        ... on ContentBlock {
                            __typename
                            id
                            direction
                            alignment
                            content {
                                ... on Button {
                                    __typename
                                    colour
                                    text
                                    url
                                }
                                ... on Content {
                                    __typename
                                    content
                                }
                                ... on Game {
                                    __typename
                                    difficulty
                                    gameType
                                }
                                ... on Image {
                                    __typename
                                    image {
                                    size
                                    url
                                    fileName
                                    }
                                }
                                ... on Advert {
                                    __typename
                                    advertId
                                    adUnit
                                    width
                                    height
                                }
                            }
                        }
                        ... on Button {
                            __typename
                            colour
                            text
                            url
                        }
                        ... on Content {
                            __typename
                            content
                        }
                        ... on Game {
                            __typename
                            difficulty
                            gameType
                        }
                        ... on Image {
                            __typename
                            image {
                            size
                            url
                            fileName
                            }
                        }
                        ... on Advert {
                            __typename
                            advertId
                            adUnit
                            width
                            height
                        }
                    }
                }
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

export const getCategories = gql`
    query Categories {
        categories (where: {slug_not_in: ["blog", "about"]}) {
            slug
            title
        }
    }
`;

export const getArticles = gql`
    query Articles ($slug: String) {
        articles (where: { category: {slug: $slug} }) {
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

export const getLatest = gql`
    query Latest {
        articles (where: { category: { slug_not: "about" } }) {
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
