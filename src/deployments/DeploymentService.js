import Github from '../Github';
import ContentHelper from "../ContentHelper";

export default class DeploymentService {
    static updateGithubDeployment(deployment, namespace, content) {
        let sha;

        const deploymentPath = deployment + '/deployment-' + namespace + '.yml';

        return Github.fetchDeploymentContents(deploymentPath).then(oldDeploymentContent => {
            sha = oldDeploymentContent.sha;
        }).catch(() => {
            sha = null;
        }).then(() => {
            const commitMessage = 'Updated ' + deployment + ' deployment in the namespace ' + namespace;

            return Github.updateContents(deploymentPath, commitMessage, ContentHelper.dumpYaml(content), sha).then(() => {
                // Do nothing, but apparently this '.then()' call is needed
            });
        });
    }
}