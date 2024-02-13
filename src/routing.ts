export function getScreenName(path: string) {
    switch (path) {
        case '/':
            return 'Home';
        case '/difficulty':
            return 'Difficulty';
        case '/difficulty/easy':
            return 'Easy';
        case '/difficulty/medium':
            return 'Medium';
        case '/difficulty/hard':
            return 'Hard';
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
