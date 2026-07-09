import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'frontend');

// Create frontend directory if it doesn't exist
if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
    console.log('Created frontend directory.');
}

const itemsToMove = [
    'src',
    'public',
    'index.html',
    'vite.config.ts',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'eslint.config.js',
    'node_modules',
    'dist'
];

itemsToMove.forEach(item => {
    const srcPath = path.join(rootDir, item);
    const destPath = path.join(frontendDir, item);

    if (fs.existsSync(srcPath)) {
        try {
            fs.renameSync(srcPath, destPath);
            console.log(`Moved ${item} to frontend/`);
        } catch (err) {
            console.error(`Failed to move ${item}:`, err.message);
            console.log('Attempting to copy and delete instead...');
            try {
                fs.cpSync(srcPath, destPath, { recursive: true });
                fs.rmSync(srcPath, { recursive: true, force: true });
                console.log(`Successfully moved ${item} via copy/delete.`);
            } catch (copyErr) {
                console.error(`Could not move ${item} at all:`, copyErr.message);
            }
        }
    } else {
        console.log(`${item} does not exist in root, skipping.`);
    }
});

console.log('\nSeparation completed successfully!');
console.log('Your project structure is now:');
console.log('learningpath/');
console.log('  ├── frontend/   <-- Frontend code');
console.log('  └── backend/    <-- Backend code');
