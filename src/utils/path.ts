import path from 'path';

export const resolveApp = (relativePath) => path.join(__dirname, '../', relativePath);