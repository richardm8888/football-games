export function getScreenName(path: string) {
    switch (path) {
        case '/':
            return 'Home';
        case '/football':
            return 'Football Game Difficulty';
        case '/football/easy':
            return 'Football Game Easy';
        case '/football/medium':
            return 'Football Game Medium';
        case '/football/hard':
            return 'Football Game Hard';
        case '/movie':
            return 'Movie Game Difficulty';
        case '/movie/easy':
            return 'Movie Game Easy';
        case '/movie/medium':
            return 'Movie Game Medium';
        case '/movie/hard':
            return 'Movie Game Hard';
        case '/about/rules':
            return 'Rules';
        case '/about/about-us':
            return 'About';
        case '/about/privacy-policy':
            return 'Privacy';
        case '/about/terms-and-conditions':
            return 'Terms';
        default:
            return 'Article';
    }
}
