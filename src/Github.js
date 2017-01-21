import Octokat from 'octokat';

export default class Github {
    static create() {
        return new Octokat({ token: process.env.REACT_APP_GITHUB_TOKEN });
    }

    static fetchContents(path) {
        return Github.create()
            .repos(process.env.REACT_APP_GITHUB_REPO_USERNAME, process.env.REACT_APP_GITHUB_REPO_NAME)
            .contents(path)
            .fetch();
    }
}