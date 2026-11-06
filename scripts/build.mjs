import { mkdir, copyFile, cp } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css']) await copyFile(file, `dist/${file}`);
await cp('src', 'dist/src', { recursive: true });
await cp('docs', 'dist/docs', { recursive: true });
await cp('qa', 'dist/qa', { recursive: true });
await copyFile('README.md', 'dist/README.md');
await copyFile('.nojekyll', 'dist/.nojekyll');
console.log('Static production site built in dist/. All application paths are relative.');
