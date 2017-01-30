import Github from '../clients/Github';
import ContentHelper from "../helpers/ContentHelper";

export default class TemplateService {
    static fetchDeploymentTemplate(deployment) {
        const path = deployment + '/deployment.yml';

        return Github.fetchTemplateContents(path).then(response => {
            return ContentHelper.parseBase64Yaml(response.content);
        });
    }
}