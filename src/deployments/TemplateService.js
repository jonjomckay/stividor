import Github from '../Github';
import ContentHelper from "../ContentHelper";

export default class TemplateService {
    static fetchDeploymentTemplate(deployment) {
        const path = deployment + '/deployment.yml';

        return Github.fetchTemplateContents(path).then(response => {
            return ContentHelper.parseBase64Yaml(response.content);
        });
    }
}