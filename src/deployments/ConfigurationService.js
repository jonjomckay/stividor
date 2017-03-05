import Github from '../clients/Github';
import ContentHelper from '../helpers/ContentHelper';

export default class ConfigurationService {
    static fetchConfigMap(application, namespace) {
        const path = application + '/config-map-' + namespace + '.yml';

        return Github.fetchTemplateContents(path).then(response => {
            return ContentHelper.parseBase64Yaml(response.content);
        });
    }
}