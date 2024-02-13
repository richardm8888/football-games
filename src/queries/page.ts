import { gql } from '@apollo/client';

export const getPage = gql`
    query Page ($slug: String!) {
        page (where: {slug: $slug}) {
            title
            slug
            contentBlocks {
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
                                ... on LatestArticleCarousel {
                                    __typename
                                    numberOfArticles
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
                        ... on LatestArticleCarousel {
                            __typename
                            numberOfArticles
                        }
                    }
                }
            }
        }
    }
              
`;
