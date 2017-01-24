import Octokat from 'octokat';

export default class Github {
    static create() {
        return new Octokat({ token: process.env.REACT_APP_GITHUB_TOKEN });
    }

    static fetchTemplateContents(path) {
        return Github.create()
            .repos(process.env.REACT_APP_GITHUB_TEMPLATE_REPO_USERNAME, process.env.REACT_APP_GITHUB_TEMPLATE_REPO_NAME)
            .contents(path)
            .fetch();
    }

    static fetchDeploymentContents(path) {
        return Github.create()
            .repos(process.env.REACT_APP_GITHUB_DEPLOYMENT_REPO_USERNAME, process.env.REACT_APP_GITHUB_DEPLOYMENT_REPO_NAME)
            .contents(path)
            .fetch();
    }

    static updateContents(path, message, content, sha) {
        let parameters = { message: message, content: btoa(content) };

        if (sha) {
            parameters.sha = sha;
        }

        return Github.create()
            .repos(process.env.REACT_APP_GITHUB_DEPLOYMENT_REPO_USERNAME, process.env.REACT_APP_GITHUB_DEPLOYMENT_REPO_NAME)
            .contents(path)
            .add(parameters);
    }
}