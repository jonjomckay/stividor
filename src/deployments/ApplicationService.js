import Github from '../clients/Github';

export default class ApplicationService {
    static fetchAll() {
        // Load the git ref for the master branch, so we can get the repository tree
        return Github.fetchTemplateRepositoryGitReference('master').then(reference => {

            return Github.fetchTemplatesTree(reference.object.sha).then(tree => {

                const ending = '/deployment.yml';

                // The list of applications is made of all directories with a "deployment.yml" folder in (depth of 1)
                return tree.tree
                  .filter(item => item.path.endsWith(ending))
                  .filter(item => item.path.match('^[^/]+/[^/]+$'))
                  .map(item => item.path.replace(ending, ''));

            });

        });
    }
}