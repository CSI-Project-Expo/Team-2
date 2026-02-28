import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const rawPdfParse = require('pdf-parse');
console.log(typeof rawPdfParse, Object.keys(rawPdfParse));
