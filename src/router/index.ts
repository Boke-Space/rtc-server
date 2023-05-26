import fs from 'fs';
import path from 'path';

export function registerRoutes(app) {
    const routerPath = path.join(__dirname, '../router');
    const fileList = fs.readdirSync(routerPath).filter(item => item !== 'index.ts');
    for (const file of fileList) {
        const { default: route } = require(`${routerPath}/${file}`);
        app.use(route);
    }
}
