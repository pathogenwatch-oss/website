import { navigateToAssembly } from './Navigation';

export function defineUploadStoreErrorToast(errors) {
  const [ { message, assemblyName, navigate } ] = errors;
  const onClick = () => navigateToAssembly(assemblyName);
  const action = navigate ? { label: 'review', onClick } : null;
  return { message, assemblyName, action };
}
