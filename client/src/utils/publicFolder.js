const configuredPublicFolder = process.env.REACT_APP_PUBLIC_FOLDER || 'http://localhost:4000/images/';
const publicFolder = configuredPublicFolder.endsWith('/')
    ? configuredPublicFolder
    : `${configuredPublicFolder}/`;

export default publicFolder;
