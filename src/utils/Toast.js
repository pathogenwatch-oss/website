import UploadWorkspaceNavigation
  from '../actions/UploadWorkspaceNavigationActionCreators';

export function defineUploadStoreErrorToast(errors) {
  const [ { message, assemblyName, navigate } ] = errors;
  const onClick =
    UploadWorkspaceNavigation.navigateToAssembly.bind(null, assemblyName);
  const action = navigate ? { label: 'review', onClick } : null;
  return { message, assemblyName, action };
}
