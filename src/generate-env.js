const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'src/environment/environment.ts');

const apiKey = process.env.GROCY_API_KEY || '';
const apiUrl = process.env.GROCY_API_URL || '';

const content = `export const environment = {
  production: true,
  apiKey: '${apiKey}',
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(envPath, content);
console.log('Generated src/environment/environment.ts');