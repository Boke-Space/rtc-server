import path from 'path';

import moduleAlias from 'module-alias';
moduleAlias.addAlias('@', path.join(process.cwd(), 'src'));
