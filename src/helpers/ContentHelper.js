import yaml from "js-yaml";

export default class ContentHelper {
    static dumpYaml(content) {
        return yaml.dump(content);
    }

    static parseBase64Yaml(content) {
        return yaml.load(atob(content));
    }
}